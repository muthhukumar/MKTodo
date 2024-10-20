import * as React from "react"
import {API} from "~/service"
import {logger} from "./logger"
import {getVersion} from "@tauri-apps/api/app"
import {AutoCompleteHashType, autocomplete, buildHash} from "./autocomplete"
import {useFeatureValue} from "~/feature-context"
import {calculatePartValue} from "./math"

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

  function cancel() {
    if (timer) clearTimeout(timer)
  }

  return [fn, cancel]
}

export function usePing() {
  const [online, setOnline] = React.useState<{server: boolean; internet: boolean} | null>(null)

  React.useEffect(() => {
    API.checkServerHealth({
      notifyInternetStatus: status =>
        setOnline(state => {
          if (!state) return {internet: status, server: false}

          return {...state, internet: status}
        }),
      notifyServerStatus(isOnline) {
        setOnline(state => {
          if (!state) return {server: isOnline, internet: false}

          return {...state, server: isOnline}
        })
      },
    })
  }, [])

  return online
}

export function useAudioPlayer(src: string) {
  const audioRef = React.useRef<HTMLAudioElement | null>()
  const [isPlaying, setIsPlaying] = React.useState(false)

  React.useEffect(() => {
    audioRef.current = new Audio(src)

    const handleEnded = () => setIsPlaying(false)
    audioRef.current.addEventListener("ended", handleEnded)

    return () => {
      audioRef.current?.removeEventListener("ended", handleEnded)
      audioRef.current?.pause()
      audioRef.current = null
    }
  }, [src])

  const togglePlay = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.volume = 0.3
      audioRef.current.play()
    }

    setIsPlaying(!isPlaying)
  }

  const resetAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      audioRef.current = null
    }
    setIsPlaying(false)
  }

  return {togglePlay, resetAudio}
}

export function useOnKeyDown({
  validateKey,
  callback,
}: {
  validateKey: (e: KeyboardEvent) => boolean
  callback: (e: KeyboardEvent) => void
}) {
  React.useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (validateKey(e)) {
        callback(e)
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [])

  return null
}

export function useOnKeyPress({
  validateKey,
  callback,
}: {
  validateKey: (e: KeyboardEvent) => boolean
  callback: (e: KeyboardEvent) => void
}) {
  React.useEffect(() => {
    function handleKeyPress(e: KeyboardEvent) {
      if (validateKey(e)) {
        callback(e)
      }
    }

    window.addEventListener("keypress", handleKeyPress)

    return () => {
      window.removeEventListener("keypress", handleKeyPress)
    }
  }, [])

  return null
}

export function useDeviceCallback<T>({
  mobile,
  desktop,
}: {
  mobile: (...args: Array<T>) => void
  desktop: (...args: Array<T>) => void
}) {
  const {isMobile} = useSize()

  function fn(...args: Array<T>) {
    if (isMobile) {
      mobile(...args)
    } else {
      desktop(...args)
    }
  }

  return fn
}

export function useVersion() {
  const [version, setVersion] = React.useState("")

  React.useEffect(() => {
    async function fetchVersion() {
      try {
        const version = await getVersion()

        if (version) setVersion(version)
      } catch (error) {
        logger.error("Failed to get version", error)
      }
    }

    fetchVersion()
  }, [])

  return version
}

function isLastCharacterMatches(str: string, match: string) {
  return str && str[str.length - 1] === match
}

export function useAutoCompletion({
  onSuggestionSelect,
  data,
  typedText,
  defaultHash = {},
}: {
  data: Array<string>
  typedText: string
  onSuggestionSelect: (word: string) => void
  defaultHash?: AutoCompleteHashType
}) {
  function onWordSelect(word: string) {
    if (isLastCharacterMatches(typedText, "!")) {
      onSuggestionSelect(`${typedText.substring(0, typedText.length - 1)}${word} `)
    } else if (isLastCharacterMatches(typedText, " ")) {
      onSuggestionSelect(`${typedText}${word} `)
    } else onSuggestionSelect(`${typedText} ${word} `)
  }

  const feature = useFeatureValue("TaskNameAutoComplete")

  const tasksNames = React.useMemo(() => {
    if (feature && !feature.enable) return []
    else return data
  }, [data, feature])

  const hash = React.useMemo(() => buildHash(tasksNames, defaultHash), [tasksNames])

  const wordSuggestions = React.useMemo(
    () => autocomplete(hash, typedText).map((w, idx) => ({id: idx, ...w})),
    [typedText, tasksNames, feature],
  )

  return {wordSuggestions, onWordSelect}
}

export function useOnMousePull<T extends HTMLElement>(
  {ref, pullThresholdPercentage = 35}: {ref: React.RefObject<T>; pullThresholdPercentage?: number},
  callback: () => void,
) {
  const eventStart = React.useRef(false)
  const YStartPosition = React.useRef<number | null>(null)
  const callbackCalled = React.useRef(false)

  React.useEffect(() => {
    if (!ref.current) return

    function reset() {
      eventStart.current = false
      YStartPosition.current = null
      callbackCalled.current = false
    }

    function onMouseDown(e: MouseEvent) {
      eventStart.current = true

      YStartPosition.current = e.clientY

      callbackCalled.current = false
    }

    function onMouseMove(event: MouseEvent) {
      if (!YStartPosition.current) return

      const maxPullThreshold = calculatePartValue(pullThresholdPercentage, window.innerHeight)

      if (event.clientY - YStartPosition.current > maxPullThreshold && !callbackCalled.current) {
        callback()
        callbackCalled.current = true
      }
    }

    function onTouchStart(e: TouchEvent) {
      eventStart.current = true

      const touch = e.touches[0]

      if (touch.clientY) {
        YStartPosition.current = touch.clientY
      } else {
        logger.warn("client y not found.")
      }

      callbackCalled.current = false
    }

    function onTouchMove(event: TouchEvent) {
      if (!YStartPosition.current) return

      const maxPullThreshold = calculatePartValue(pullThresholdPercentage, window.innerHeight)

      const touch = event.touches[0]

      logger.info(
        "Touch details",
        `${touch?.clientY}, ${YStartPosition.current}, ${maxPullThreshold}`,
      )

      if (!touch || !touch?.clientY) {
        logger.warn("Touch not found", touch)

        return
      }

      if (touch.clientY - YStartPosition.current > maxPullThreshold && !callbackCalled.current) {
        callback()
        callbackCalled.current = true
      }
    }

    ref.current.addEventListener("touchstart", onTouchStart)
    ref.current.addEventListener("touchend", reset)
    ref.current.addEventListener("touchmove", onTouchMove)

    ref.current.addEventListener("mousedown", onMouseDown)
    ref.current.addEventListener("mouseup", reset)
    ref.current.addEventListener("mousemove", onMouseMove)

    return () => {
      if (!ref.current) return

      ref.current.removeEventListener("mousedown", onMouseDown)
      ref.current.removeEventListener("mouseup", reset)
      ref.current.removeEventListener("mousemove", onMouseMove)

      ref.current.removeEventListener("touchstart", onTouchStart)
      ref.current.removeEventListener("touchend", reset)
      ref.current.removeEventListener("touchmove", onTouchMove)
    }
  }, [])
}
