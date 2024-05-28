import * as React from "react"

export function useOutsideAlerter(
  ref: React.RefObject<any>,
  {
    onClickOutside,
    ignore,
  }: {
    onClickOutside: () => void

    ignore: Array<React.RefObject<any>>
  },
) {
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target)) {
        if (ignore.length <= 0) {
          onClickOutside()
          return
        }

        if (!ignore.some(iRef => iRef.current.contains(event.target))) {
          onClickOutside()
          return
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [ref])
}
