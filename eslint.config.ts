import js from '@eslint/js'
import globals from 'globals'
import pluginVue from 'eslint-plugin-vue'
import tseslint from 'typescript-eslint'
import prettier from 'eslint-config-prettier'
import { defineConfig } from 'eslint/config'

export default defineConfig(
  {
    ignores: [
      'node_modules/**',
      'vendor/**',
      'public/build/**',
      'dist-preview/**',
      'test-results/**',
      'playwright-report/**',
      'home-reference/**',
      'resources/images/**',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  ...pluginVue.configs['flat/recommended'],
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
        extraFileExtensions: ['.vue'],
      },
    },
  },
  {
    files: ['**/*.vue'],
    languageOptions: {
      parserOptions: { parser: tseslint.parser },
    },
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/ban-ts-comment': 'error',
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
      '@typescript-eslint/explicit-function-return-type': [
        'error',
        { allowExpressions: true, allowTypedFunctionExpressions: true },
      ],
      '@typescript-eslint/restrict-template-expressions': [
        'error',
        { allowNumber: true, allowBoolean: false },
      ],
      'vue/component-api-style': ['error', ['script-setup']],
      'vue/multi-word-component-names': 'off',
      'vue/no-v-html': 'error',
      'vue/no-static-inline-styles': ['error', { allowBinding: false }],
      'vue/no-restricted-static-attribute': [
        'error',
        { key: 'style', message: 'Inline CSS запрещён' },
      ],
      'vue/no-restricted-v-bind': [
        'error',
        { argument: 'style', message: 'Inline CSS (:style) запрещён' },
      ],
      'vue/v-on-handler-style': ['error', ['method', 'inline-function']],
      'vue/no-template-target-blank': 'error',
      'vue/attributes-order': 'error',
      'vue/block-order': ['error', { order: ['script', 'template', 'style'] }],
    },
  },
  {
    // для служебных скриптов отключается проверка типов
    files: ['tools/**/*.mjs'],
    extends: [tseslint.configs.disableTypeChecked],
    rules: {
      '@typescript-eslint/explicit-function-return-type': 'off',
      'no-useless-assignment': 'off',
    },
  },
  {
    files: ['tests/**/*.ts', '*.config.ts'],
    rules: {
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      // метод событий вызывает ложное срабатывание правила
      '@typescript-eslint/unbound-method': 'off',
    },
  },
  prettier,
)
