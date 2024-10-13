import * as React from "react"
import {IoIosArrowDropleftCircle, IoIosArrowDroprightCircle} from "react-icons/io"

interface AutoWordSuggestionsProps {
  wordSuggestions: Array<{id: number; word: string}>
  onSelect: (selectedWord: string) => void
}

export default function AutoWordSuggestions({wordSuggestions, onSelect}: AutoWordSuggestionsProps) {
  if (wordSuggestions.length === 0) return null

  const containerRef = React.useRef<HTMLDivElement>(null)

  function scrollLeft() {
    if (containerRef.current) {
      containerRef.current.scrollBy({
        left: -150,
        behavior: "smooth",
      })
    }
  }

  function scrollRight() {
    if (containerRef.current) {
      containerRef.current.scrollBy({
        left: 150,
        behavior: "smooth",
      })
    }
  }

  return (
    <div className="flex items-center px-3">
      <button className="inline-block mr-3" onClick={scrollLeft}>
        <IoIosArrowDropleftCircle size={24} />
      </button>
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar" ref={containerRef}>
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
      <button className="inline-block ml-3" onClick={scrollRight}>
        <IoIosArrowDroprightCircle size={24} />
      </button>
    </div>
  )
}
