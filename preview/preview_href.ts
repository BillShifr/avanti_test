export function createPreviewHref(basePath: string, path: `/${string}`): string {
  if (basePath === './') {
    return path
  }

  const normalizedBasePath = basePath.endsWith('/') ? basePath : `${basePath}/`

  return path === '/' ? normalizedBasePath : `${normalizedBasePath}#${path}`
}
