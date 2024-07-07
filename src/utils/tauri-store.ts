import {Store} from "@tauri-apps/plugin-store"
import toast from "react-hot-toast"

export const store = new Store(".settings.dat")
export const optionStore = new Store(".options.dat")

export const CREDS = "CREDS"

export const APIStore = {
  async set({apiKey, host}: {host: string; apiKey: string}) {
    try {
      await store.set(CREDS, {host, apiKey})
    } catch (error) {
      toast.error("Saving API key failed")
    }
  },
  async get() {
    try {
      return await store.get<{host: string; apiKey: string}>(CREDS)
    } catch (error) {
      toast.error("Getting API key failed")
      return null
    }
  },
  async reset() {
    try {
      await store.reset()

      return true
    } catch (error) {
      toast.error("Resetting API key failed")

      return false
    }
  },
  async save(): Promise<boolean> {
    // This manually saves the store.
    try {
      await store.save()

      return true
    } catch (error) {
      toast.error("Saving API key failed")
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

      await optionStore.set("options", {
        ...allOptions,
        [key]: value,
      })
    } catch {
      toast.error("Setting option failed")
    }
  },
  async get(): Promise<OptionsType | null> {
    try {
      return await optionStore.get("options")
    } catch {
      toast.error("Getting option failed")
      return null
    }
  },
  async save(): Promise<boolean> {
    try {
      await optionStore.save()

      return true
    } catch (error) {
      toast.error("Saving Options failed")
      return false
    }
  },
  async reset() {
    try {
      await optionStore.reset()

      return true
    } catch (error) {
      toast.error("Resetting options failed")

      return false
    }
  },
}
