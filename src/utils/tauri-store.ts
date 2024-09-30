import {Store} from "@tauri-apps/plugin-store"
import toast from "react-hot-toast"

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

      console.log("allloptions", allOptions)

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
