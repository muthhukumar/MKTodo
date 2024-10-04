import {Store} from "@tauri-apps/plugin-store"
import toast from "react-hot-toast"
import {TTask} from "~/@types"
import {FeatureSetting} from "~/feature-context"

export const store = new Store(".settings.dat")

export const CREDS = "CREDS"

export const APIStore = {
  async set({apiKey, host}: {host: string; apiKey: string}) {
    try {
      await store.set(CREDS, {host, apiKey})
    } catch (error) {
      toast.error("Saving API key failed. Code: AS:13")
    }
  },
  async get() {
    try {
      return await store.get<{host: string; apiKey: string}>(CREDS)
    } catch (error) {
      toast.error("Getting API key failed. Code: AS:20")
      return null
    }
  },
  async reset() {
    try {
      await store.reset()

      return true
    } catch (error) {
      toast.error("Resetting API key failed. Code: R:30")

      return false
    }
  },
  async save(): Promise<boolean> {
    // This manually saves the store.
    try {
      await store.save()

      return true
    } catch (error) {
      toast.error("Saving API key failed. Code: SAKF:42")
      return false
    }
  },
}

export type OptionsType = {
  showCompleted: boolean
}

export const OptionsStore = {
  async set<T extends keyof OptionsType>({key, value}: {key: T; value: OptionsType[T]}) {
    try {
      const allOptions = (await OptionsStore.get()) ?? {}

      await store.set("options", {
        ...allOptions,
        [key]: value,
      })
    } catch {
      toast.error("Setting option failed. Code: OS:64")
    }
  },
  async get(): Promise<OptionsType | null> {
    try {
      return await store.get("options")
    } catch {
      toast.error("Getting option failed. Code: OSG:71")
      return null
    }
  },
  async save(): Promise<boolean> {
    try {
      await store.save()

      return true
    } catch (error) {
      toast.error("Saving Options failed. Code: OSS:81")
      return false
    }
  },
  async reset() {
    try {
      await store.reset()

      return true
    } catch (error) {
      toast.error("Resetting options failed. Code: OSR:91")

      return false
    }
  },
}

let creds: {host: string; apiKey: string} | null = null

export async function getCreds() {
  if (!creds) {
    creds = await APIStore.get()
  }

  return creds
}

export const SettingsStore = {
  async set(settings: Array<FeatureSetting>) {
    try {
      await store.set("settings", settings)
    } catch (error) {
      toast.error("Saving settings failed. Code: AS:112")
    }
  },
  async get() {
    try {
      return await store.get<Array<FeatureSetting>>("settings")
    } catch (error) {
      toast.error("Getting API key failed. Code: AS:20")
      return null
    }
  },
  async save(): Promise<boolean> {
    try {
      await store.save()

      return true
    } catch (error) {
      toast.error("Saving settings failed. Code: OSS:81")
      return false
    }
  },
}

export const TasksOfflineStore = {
  async set(settings: Array<TTask>) {
    try {
      await store.set("tasks", settings)
    } catch (error) {
      toast.error("Saving tasks failed. Code: AS:141")
    }
  },
  async get() {
    try {
      return await store.get<Array<TTask>>("tasks")
    } catch (error) {
      toast.error("Getting tasks failed. Code: AS:148")
      return null
    }
  },
  async save(): Promise<boolean> {
    try {
      await store.save()

      return true
    } catch (error) {
      toast.error("Saving tasks failed. Code: OSS:158")
      return false
    }
  },
}
