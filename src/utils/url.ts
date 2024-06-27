export function removeTrailngSlash(url: string): string {
  const slash = url.charAt(url.length - 1)

  return slash === "/" ? url.substring(0, url.length - 1) : url
}
