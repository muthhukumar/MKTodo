import * as React from "react"
import {API} from "~/service"

export function useOutsideAlerter(
  ref: React.RefObject<any>,
  {
    onClickOutside,
    ignore = [],
  }: {
    onClickOutside: () => void
    ignore?: Array<React.RefObject<any>>
  },
) {
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        ref.current &&
        !ref.current.contains(event.target) &&
        !ignore.some(iRef => iRef.current && iRef.current.contains(event.target))
      ) {
        onClickOutside()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [ref, onClickOutside, ignore])
}

export function useSize() {
  const [windowSize, setWindowSize] = React.useState({
    height: window.innerHeight,
    width: window.innerWidth,
  })

  React.useEffect(() => {
    const windowSizeHandler = () => {
      setWindowSize({width: window.innerWidth, height: window.innerHeight})
    }
    window.addEventListener("resize", windowSizeHandler)

    return () => {
      window.removeEventListener("resize", windowSizeHandler)
    }
  }, [])

  const isMobile = windowSize.width <= 768

  return {windowSize, isMobile, isDesktop: !isMobile}
}

export function useDelayedLoading({waitFor, loading}: {waitFor: number; loading: boolean}) {
  const [delayedLoading, setDelayedLoading] = React.useState<boolean | null>(null)

  React.useEffect(() => {
    let timeout: NodeJS.Timeout | null = null

    if (!loading) {
      timeout && clearTimeout(timeout)
      setDelayedLoading(false)

      return
    }

    timeout = setTimeout(() => {
      setDelayedLoading(true)
    }, waitFor)

    return () => {
      timeout && clearTimeout(timeout)
    }
  }, [loading, waitFor])

  return delayedLoading
}

export function useDelay<T extends any>(
  callback: (...args: Array<T>) => void,
  delay: number = 1000,
) {
  let timer: NodeJS.Timeout | null

  function fn(...args: Array<T>) {
    if (timer) clearTimeout(timer)

    timer = setTimeout(() => {
      callback(...args)
    }, delay)
  }

  return fn
}

export function usePing() {
  const [online, setOnline] = React.useState<boolean | null>(null)

  React.useEffect(() => {
    async function isOnline() {
      const isOnline = await API.ping()

      setOnline(isOnline)
    }

    isOnline()
  }, [])

  return online
}

export const useAudio = (url: string) => {
  const [audio] = React.useState(new Audio(url))
  const [playing, setPlaying] = React.useState(false)

  const toggle = () => setPlaying(!playing)

  React.useEffect(() => {
    playing ? audio.play() : audio.pause()
  }, [playing])

  React.useEffect(() => {
    audio.addEventListener("ended", () => setPlaying(false))
    return () => {
      audio.removeEventListener("ended", () => setPlaying(false))
    }
  }, [])

  return [playing, toggle] as const
}
