export const options = ["p1", "p2", "p3", "notes", "bug", "watch"]

export const tagColors = {
  p1: "bg-green-400 text-green-900 border border-green-500",
  p2: "bg-blue-400 text-blue-900 border border-blue-500",
  p3: "bg-yellow-400 text-yellow-900 border border-yellow-500",
  notes: "bg-gray-200 text-gray-800 border border-gray-300",
  default: "bg-gray-200 text-gray-800 border border-gray-300",
  bug: "bg-red-400 text-white border border-red-500",
  watch: "bg-purple-400 text-white border border-purple-500",
}

export function getTagColor(tag: string) {
  if (!(tag in tagColors)) {
    return tagColors.default
  }

  return tagColors[tag as keyof typeof tagColors]
}
