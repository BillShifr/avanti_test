import { describe, expect, it } from 'vitest'

import { createPreviewHref } from '../../preview/preview_href'

describe('createPreviewHref', () => {
  it('сохраняет Laravel-подобные пути в локальном preview', () => {
    expect(createPreviewHref('./', '/home')).toBe('/home')
    expect(createPreviewHref('./', '/')).toBe('/')
  })

  it('удерживает ссылки внутри GitHub Pages project path', () => {
    expect(createPreviewHref('/avanti_test/', '/documenti')).toBe('/avanti_test/#/documenti')
    expect(createPreviewHref('/avanti_test/', '/')).toBe('/avanti_test/')
  })

  it('поддерживает Pages на custom domain без project prefix', () => {
    expect(createPreviewHref('/', '/assistenza')).toBe('/#/assistenza')
  })
})
