import * as React from "react"
import {SettingsStore} from "./utils/tauri-store"

const allFeatures = [
  {id: "TaskTagsView", title: "Show Task Tags"},
  {id: "TaskTagInput", title: "Show Task Tags Input"},
  {id: "ImportantTaskView", title: "Show Important List"},
  {id: "ToggleTaskImportant", title: "Toggle Task Importance"},
  {id: "LinkifyLinkInTask", title: "Convert Links in Task Description"},
  {id: "LinksListDrawer", title: "Show Links List in Drawer"},
  {id: "TasksCountInTitle", title: "Show Task Count in Title"},
  {id: "TagFilter", title: "Enable Tag Filter"},
  {id: "TaskTypeInputInCreateTask", title: "Enable Task Type Input in Create Task"},
  {id: "CopyTaskTextInDrawer", title: "Copy Task Text in Drawer"},
  {id: "SyncingNotifier", title: "Show Syncing Notifier"},
  {id: "TaskStaleTag", title: "Show Stale Task Tag"},
] as const

export type Feature = (typeof allFeatures)[number]["id"]

export type FeatureSetting = {
  id: Feature
  enable: boolean
  title: string
}

const FeatureContext = React.createContext<{
  features: Array<FeatureSetting>
  toggleFeature: (id: Feature) => void
}>({
  features: [],
  toggleFeature: () => undefined,
})

export const defaultFeatureSettings = allFeatures.map(s => ({
  id: s.id,
  enable: true,
  title: s.title as string,
}))

export function FeatureContextProvider({children}: {children: React.ReactNode}) {
  const [features, setFeatures] = React.useState<Array<FeatureSetting>>([])

  React.useEffect(() => {
    async function getSavedSettings() {
      const features = await SettingsStore.get()

      if (!features) setFeatures(defaultFeatureSettings)
      else setFeatures(features)
    }

    getSavedSettings()
  }, [])

  React.useEffect(() => {
    if (features.length > 0) {
      SettingsStore.set(features).then(() => {
        SettingsStore.save()
      })
    }
  }, [features])

  function toggleFeature(id: Feature) {
    setFeatures(state => {
      const features = [...state]

      const idx = features.findIndex(f => f.id === id)

      if (idx === -1) return state

      const updatedFeature = {
        ...features[idx],
        enable: !features[idx].enable,
      }

      features[idx] = updatedFeature

      return features
    })
  }

  return (
    <FeatureContext.Provider value={{features, toggleFeature}}>{children}</FeatureContext.Provider>
  )
}

export const useFeature = () => {
  const context = React.useContext(FeatureContext)

  if (!context) {
    throw new Error("useFeature should be used inside FeatureContext")
  }

  return context
}