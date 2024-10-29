import * as React from "react"
import {SettingsStore} from "./utils/persistent-storage"

const allFeatures = [
  {id: "TaskTagsView", title: "Show Tags for Tasks", category: "Display"},
  {id: "TaskTagInput", title: "Enable Tag Input for Tasks", category: "Feature"},
  {id: "ImportantTaskView", title: "Show Important Tasks List", category: "Feature"},
  {id: "ToggleTaskImportant", title: "Allow Marking Tasks as Important", category: "Feature"},
  {id: "LinkifyLinkInTask", title: "Convert Links in Task Descriptions", category: "Feature"},
  {id: "LinksListDrawer", title: "Show Links in Drawer", category: "Display"},
  {id: "TasksCountInTitle", title: "Display Task Count in Title", category: "Display"},
  {id: "TagFilter", title: "Enable Filtering by Tag", category: "Feature"},
  {
    id: "TaskTypeInputInCreateTask",
    title: "Enable Task Type Input on Creation",
    category: "Feature",
  },
  {id: "CopyTaskTextInDrawer", title: "Enable Copying Task Text from Drawer", category: "Feature"},
  {id: "TaskStaleTag", title: "Show Stale Task Tags", category: "Display"},
  {id: "ShowCompletedTasks", title: "Show Completed Tasks", category: "Display"},
  {id: "PreLoadTasks", title: "Preload Tasks for Better Performance", category: "Feature"},
  {id: "Font", title: "Change Font Style", defaultValue: "Inter", category: "Display"},
  {id: "TaskNameAutoComplete", title: "Enable Task Name Autocomplete", category: "Feature"},
  {
    id: "AutoCompletionSuggestionFrequencyCount",
    title: "Show Autocomplete Suggestion Frequency",
    category: "Display",
  },
  {id: "ShowTaskSubTaskInfo", title: "Show Subtask Completion Info", category: "Display"},
  {id: "SubTask", title: "Enable Subtasks and Subtask Input", category: "Feature"},
  {id: "RecurringTask", title: "Enable Recurring Tasks", category: "Feature"},
  {id: "RecurringTaskTag", title: "Show Recurring Task Tags", category: "Display"},
  {id: "Notifier", title: "Show Pop Up Notifier", category: "Display"},
  {id: "SyncNotifier", title: "Show Sync Notifier", category: "Display"},
  {id: "PullToRefresh", title: "Enable pull to refresh", category: "Feature"},
  {id: "SwipeNavigation", title: "Swipe to navigate between screens", category: "Feature"},
  {id: "UpdateTaskListInput", title: "Enable Task List Change input", category: "Feature"},
] as const

// TODO: fix the type for this
function arrangeFeatureByCategory() {
  const result: Record<string, Array<{id: string; title: string}>> = {}

  for (let feature of allFeatures) {
    if (!(feature.category in result)) {
      result[feature.category] = []
    }

    result[feature.category].push({id: feature.id, title: feature.title})
  }

  const finalResult: Array<{category: string; features: Array<{id: string; title: string}>}> = []

  Object.keys(result).forEach(k => {
    finalResult.push({category: k, features: result[k]})
  })

  return finalResult
}

export const allFeaturesByCategory = arrangeFeatureByCategory()

export type Feature = (typeof allFeatures)[number]["id"]

export type FeatureSetting = {
  id: Feature
  enable: boolean
  title: string
  value: string
}

const FeatureContext = React.createContext<{
  features: Array<FeatureSetting>
  setFeatures: React.Dispatch<React.SetStateAction<FeatureSetting[]>>
  toggleFeature: (id: Feature) => void
  setFeature: (props: {value: string; featureId: Feature}) => void
}>({
  features: [],
  toggleFeature: () => undefined,
  setFeatures: () => undefined,
  setFeature: () => undefined,
})

export const defaultFeatureSettings = allFeatures.map(s => ({
  id: s.id,
  enable: true,
  value: "defaultValue" in s ? s.defaultValue : "true",
  title: s.title as string,
}))

export function FeatureContextProvider({children}: {children: React.ReactNode}) {
  const [features, setFeatures] = React.useState<Array<FeatureSetting>>([])

  React.useEffect(() => {
    async function getSavedSettings() {
      const features = await SettingsStore.get()

      if (!features) setFeatures(defaultFeatureSettings)
      else {
        setFeatures(ensureValidFeatures(features))
      }
    }

    getSavedSettings()
  }, [])

  React.useEffect(() => {
    if (features.length > 0) {
      window.featureManager.set(features)

      SettingsStore.set(features).then(() => {
        SettingsStore.save()
      })
    }
  }, [features])

  function setFeature({value, featureId}: {value: string; featureId: Feature}) {
    setFeatures(state => {
      const features = [...state]

      const idx = features.findIndex(f => f.id === featureId)

      if (idx === -1) return state

      const updatedFeature = {
        ...features[idx],
        value,
      }

      features[idx] = updatedFeature

      return features
    })
  }

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
    <FeatureContext.Provider value={{features, toggleFeature, setFeatures, setFeature}}>
      {children}
    </FeatureContext.Provider>
  )
}

export const useFeature = () => {
  const context = React.useContext(FeatureContext)

  if (!context) {
    throw new Error("useFeature should be used inside FeatureContext")
  }

  return context
}

export const useFeatureValue = (featureId: Feature): FeatureSetting | null => {
  const {features} = useFeature()

  const feature = React.useMemo(() => features.find(f => f.id === featureId), [featureId, features])

  if (!feature) return null

  return feature
}

export const useEnabledFeatureCallback = <T extends (...args: any[]) => any>(
  featureId: Feature,
  callback: T,
) => {
  const feature = useFeatureValue(featureId)

  if (!feature || !feature.enable) return () => undefined

  return callback
}

function ensureValidFeatures(features: Array<FeatureSetting>) {
  if (features.length !== defaultFeatureSettings.length) {
    const featuresIds = features.map(f => f.id)

    const missingSettings = defaultFeatureSettings.filter(df => !featuresIds.includes(df.id))

    const unique = {} as Record<Feature, FeatureSetting>

    for (let item of [...features, ...missingSettings]) {
      if (!unique[item.id]) {
        unique[item.id] = item
      }
    }

    return Object.values(unique)
  }

  return features
}
