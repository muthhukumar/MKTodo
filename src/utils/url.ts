export function removeTrailingSlash(url: string): string {
  const slash = url.charAt(url.length - 1)

  return slash === "/" ? url.substring(0, url.length - 1) : url
}

export function extractLinks(text: string): string[] {
  const urlPattern = /https?:\/\/[^\s]+/g
  const links = text.match(urlPattern)

  return links ? links : []
}

export function getDomain(url: string): string {
  try {
    const parsedUrl = new URL(url)
    return `${parsedUrl.protocol}//${parsedUrl.hostname}`
  } catch (error) {
    return url
  }
}
