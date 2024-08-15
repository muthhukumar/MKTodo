export function removeTrailingSlash(url: string): string {
  const slash = url.charAt(url.length - 1)

  return slash === "/" ? url.substring(0, url.length - 1) : url
}

// TODO: use more proper way to find the links
export function extractLinks(text: string): string[] {
  const urlPattern = /https?:\/\/[^\s]+/g
  const links = text.match(urlPattern)

  return links ? links : []
}
