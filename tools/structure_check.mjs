#!/usr/bin/env node
/**
 * Структурный контроль правил лида.
 *
 * Ломает сборку, когда:
 *  - имя Vue-файла не соответствует `<domain>_<purpose>.vue` в snake_case;
 *  - файл длиннее 300 строк;
 *  - в шаблоне встречается inline CSS (`style="…"`, `:style`) или inline JS
 *    (стрелочные функции и выражения в обработчиках, `v-html`);
 *  - в `<script>` есть `any`, `@ts-ignore` или `@ts-nocheck`.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative, basename } from 'node:path'

const ROOTS = ['resources/js', 'preview']
const MAX_LINES = 300
const WARN_LINES = 220
const NAME_PATTERN = /^[a-z][a-z0-9]*(_[a-z0-9]+)+\.vue$/

const errors = []
const warnings = []

function walk(dir) {
  const entries = []
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) {
      entries.push(...walk(full))
    } else if (entry.endsWith('.vue')) {
      entries.push(full)
    }
  }
  return entries
}

function sectionOf(source, tag) {
  const match = source.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`))
  return match === null ? '' : match[1]
}

function checkFile(file) {
  const rel = relative(process.cwd(), file)
  const source = readFileSync(file, 'utf8')
  const lines = source.split('\n').length
  const name = basename(file)

  if (!NAME_PATTERN.test(name)) {
    errors.push(`${rel}: имя файла должно быть <domain>_<purpose>.vue в snake_case`)
  }

  if (lines > MAX_LINES) {
    errors.push(`${rel}: ${lines} строк, лимит ${MAX_LINES}`)
  } else if (lines > WARN_LINES) {
    warnings.push(`${rel}: ${lines} строк, целевой размер ${WARN_LINES}`)
  }

  const template = sectionOf(source, 'template')
  const script = sectionOf(source, 'script')

  const templateRules = [
    [/\sstyle\s*=\s*"/, 'inline CSS через атрибут style'],
    [/\s:style\s*=/, 'inline CSS через :style'],
    [/\sv-bind:style\s*=/, 'inline CSS через v-bind:style'],
    [/\sv-html\s*=/, 'v-html запрещён'],
    [/@[a-zA-Z.:-]+\s*=\s*"[^"]*=>/, 'inline arrow-function в обработчике'],
    [/@[a-zA-Z.:-]+\s*=\s*"[^"]*[;{]/, 'inline-выражение в обработчике'],
  ]

  for (const [pattern, message] of templateRules) {
    if (pattern.test(template)) {
      errors.push(`${rel}: ${message}`)
    }
  }

  const scriptRules = [
    [/@ts-ignore/, '@ts-ignore запрещён'],
    [/@ts-nocheck/, '@ts-nocheck запрещён'],
    [/:\s*any\b/, 'тип any запрещён'],
    [/\bas\s+any\b/, 'приведение к any запрещено'],
  ]

  for (const [pattern, message] of scriptRules) {
    if (pattern.test(script)) {
      errors.push(`${rel}: ${message}`)
    }
  }

  if (!/<script setup lang="ts">/.test(source)) {
    errors.push(`${rel}: требуется <script setup lang="ts">`)
  }
}

for (const root of ROOTS) {
  let files = []
  try {
    files = walk(root)
  } catch {
    continue
  }
  files.forEach(checkFile)
}

for (const warning of warnings) {
  process.stdout.write(`warn  ${warning}\n`)
}

if (errors.length > 0) {
  for (const error of errors) {
    process.stderr.write(`error ${error}\n`)
  }
  process.exit(1)
}

process.stdout.write('structure check: ok\n')
