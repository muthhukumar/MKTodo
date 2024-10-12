import * as React from "react"
import {useFeatureValue} from "~/feature-context"

export default function FontInitializer() {
  const font = useFeatureValue("Font")

  React.useEffect(() => {
    if (font) document.documentElement.style.setProperty("--primary-font", font?.value || "Inter")
  }, [font])

  return null
}
