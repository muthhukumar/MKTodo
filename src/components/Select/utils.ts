export function isEveryItemSelected(data: Array<string>, selectedOptions: Array<string>) {
  return data.every(item => selectedOptions.includes(item))
}
