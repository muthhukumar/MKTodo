import * as React from "react"
import {Feature, useFeature} from "~/feature-context"

interface FeatureFlagProps {
  feature: Feature
  children: React.ReactNode
}

const FeatureFlagContext = React.createContext<{feature: Feature} | null>(null)

function FeatureFlag({children, feature}: FeatureFlagProps) {
  return <FeatureFlagContext.Provider value={{feature}}>{children}</FeatureFlagContext.Provider>
}

FeatureFlag.Feature = function Feature({children}: {children: React.ReactNode}) {
  const {feature} = useFeatureFlag()
  const {features} = useFeature()

  const currFeature = features.find(f => f.id === feature)

  if (currFeature && currFeature.enable) {
    return children
  }

  return null
}

FeatureFlag.Fallback = function Fallback({children}: {children: React.ReactNode}) {
  const {feature} = useFeatureFlag()
  const {features} = useFeature()

  const currFeature = features.find(f => f.id === feature)

  if (!currFeature || !currFeature.enable) {
    return children
  }

  return null
}

const useFeatureFlag = () => {
  const context = React.useContext(FeatureFlagContext)

  if (!context) {
    throw new Error("useFeatureFlag should be used inside FeatureFlagContext Provider")
  }

  return context
}

export default FeatureFlag
