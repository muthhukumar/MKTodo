export function getTaskNames(data: {data: Array<{name: string}>}) {
  return data.data.map(d => d.name)
}

export function buildHash(data: Array<string>) {
  const hash = {} as Record<string, Array<string>>

  for (let i = 0; i < data.length; i++) {
    const words = data[i].split(" ").filter(Boolean)

    for (let j = 0; j < words.length; j++) {
      const word = words[j].toLowerCase()

      if (word === "") continue

      //invariant(word !== "", "word cannot be empty string. but got %s", word)

      if (!(word in hash)) hash[word] = []

      if (j < words.length - 1 && !hash[word].includes(words[j + 1])) {
        hash[word].push(words[j + 1])
      }
    }
  }

  return hash
}

export function getLastWord(sentence: string): string {
  if (!sentence) return ""

  const words = sentence.split(" ")

  if (words.length === 1) return words[0]

  for (let i = words.length - 1; i >= 0; i--) {
    if (words[i]) return words[i]
  }

  return ""
}

export function autocomplete(hash: Record<string, Array<string>>, sentence: string) {
  const lastWord = getLastWord(sentence.toLowerCase())

  if (!(lastWord in hash)) {
    return []
  }

  return hash[lastWord].slice(0, 3)
}
