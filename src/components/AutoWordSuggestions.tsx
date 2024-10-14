import * as React from "react"
import {IoIosArrowDropleftCircle, IoIosArrowDroprightCircle} from "react-icons/io"
import DesktopOnly from "./DesktopOnly"
import {AutoCompleteSuggestion} from "~/utils/autocomplete"
import FeatureFlag from "./FeatureFlag"

interface AutoWordSuggestionsProps {
  wordSuggestions: Array<AutoCompleteSuggestion & {id: number}>
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
      <DesktopOnly>
        <div className="flex items-center">
          <button className="inline-block mr-3" onClick={scrollLeft}>
            <IoIosArrowDropleftCircle size={24} />
          </button>
        </div>
      </DesktopOnly>
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar" ref={containerRef}>
        {wordSuggestions.map(w => (
          <button
            key={w.id}
            type="button"
            className="relative inline-block text-center border border-inherit rounded-md px-4"
            onClick={() => onSelect(w.word)}
          >
            <p className="text-center">{w.word}</p>
            <FeatureFlag feature="AutoCompletionSuggestionFrequencyCount">
              <FeatureFlag.Feature>
                <span className="inline-block border border-border rounded-full text-[8px] absolute top-0 right-0">
                  {w.frequency}
                </span>
              </FeatureFlag.Feature>
            </FeatureFlag>
          </button>
        ))}
      </div>
      <DesktopOnly>
        <div className="flex items-center">
          <button className="inline-block ml-3" onClick={scrollRight}>
            <IoIosArrowDroprightCircle size={24} />
          </button>
        </div>
      </DesktopOnly>
    </div>
  )
}
