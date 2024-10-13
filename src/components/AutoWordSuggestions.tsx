interface AutoWordSuggestionsProps {
  wordSuggestions: Array<{id: number; word: string}>
  onSelect: (selectedWord: string) => void
}

export default function AutoWordSuggestions({wordSuggestions, onSelect}: AutoWordSuggestionsProps) {
  if (wordSuggestions.length === 0) return null

  return (
    <div className="flex items-center px-3 gap-2">
      {wordSuggestions.map(w => (
        <button
          key={w.id}
          type="button"
          className="inline-block text-center border border-inherit rounded-md px-4"
          onClick={() => onSelect(w.word)}
        >
          <p className="text-center">{w.word}</p>
        </button>
      ))}
    </div>
  )
}
