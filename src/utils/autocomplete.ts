export function getTaskNames(data: {data: Array<{name: string}>}) {
  return data.data.map(d => d.name)
}

export type AutoCompleteSuggestion = {frequency: number; word: string}
export type AutoCompleteHashType = Record<string, Array<AutoCompleteSuggestion>>

export function buildHash(data: Array<string>, hash: AutoCompleteHashType = {}) {
  for (let i = 0; i < data.length; i++) {
    const words = data[i].split(" ").filter(Boolean)

    for (let j = 0; j < words.length; j++) {
      const word = words[j].toLowerCase()

      if (word === "") continue

      //invariant(word !== "", "word cannot be empty string. but got %s", word)

      if (!(word in hash)) hash[word] = []

      if (j < words.length - 1) {
        const existingWord = hash[word].find(w => w.word === words[j + 1])

        if (!existingWord) {
          hash[word].push({word: words[j + 1], frequency: 1})
        } else {
          existingWord.frequency += 1
        }
      }
    }
  }

  for (let key of Object.keys(hash)) {
    hash[key].sort((a, b) => b.frequency - a.frequency)
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

export function autocomplete(hash: AutoCompleteHashType, sentence: string) {
  const lastWord = getLastWord(sentence.toLowerCase())

  if (!(lastWord in hash)) {
    return []
  }

  return hash[lastWord]
}
