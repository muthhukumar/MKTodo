export const options = ["p1", "p2", "notes", "bug", "watch", "feature", "learn", "idea", "thought"]

export const tagColors = {
  p1: "bg-green-400 text-green-900 border border-green-500",
  p2: "bg-blue-400 text-blue-900 border border-blue-500",
  notes: "bg-gray-200 text-gray-800 border border-gray-300",
  bug: "bg-red-400 text-white border border-red-500",
  watch: "bg-purple-400 text-white border border-purple-500",
  feature: "bg-teal-400 text-teal-900 border border-teal-500",
  learn: "bg-indigo-400 text-indigo-900 border border-indigo-500",
  idea: "bg-pink-400 text-pink-900 border border-pink-500",
  thought: "bg-orange-400 text-orange-900 border border-orange-500",
  default: "bg-gray-200 text-gray-800 border border-gray-300",
}

export function getTagColor(tag: string) {
  if (!(tag in tagColors)) {
    return tagColors.default
  }

  return tagColors[tag as keyof typeof tagColors]
}
