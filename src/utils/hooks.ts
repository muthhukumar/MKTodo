import * as React from "react"

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

export function useReRenderOnPopState(callback?: () => void) {
  const [_, setState] = React.useState(false)

  React.useEffect(() => {
    function handleRouteChange() {
      setState(state => !state)
      callback && callback()
    }

    window.addEventListener("popstate", handleRouteChange)

    return () => {
      window.removeEventListener("popstate", handleRouteChange)
    }
  }, [])
}

export function useDelayedLoading({waitFor, loading}: {waitFor: number; loading: boolean}) {
  const [delayedLoading, setDelayedLoading] = React.useState<boolean | null>(null)

  React.useEffect(() => {
    let timeout: number | null = null

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
