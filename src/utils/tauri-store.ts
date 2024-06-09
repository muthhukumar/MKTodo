import {Store} from "@tauri-apps/plugin-store"

export const store = new Store(".settings.dat")

export const CREDS = "CREDS"

export const APIStore = {
  async set({apiKey, host}: {host: string; apiKey: string}) {
    try {
      await store.set(CREDS, {host, apiKey})
    } catch (error) {
      console.log("Failed to save api key", error)
    }
  },
  async get() {
    try {
      return await store.get<{host: string; apiKey: string}>(CREDS)
    } catch (error) {
      console.log("Failed to get API key", error)
      return null
    }
  },
  async reset() {
    try {
      await store.reset()

      return true
    } catch (error) {
      console.log("failed to reset values")

      return false
    }
  },
  async save(): Promise<boolean> {
    // This manually saves the store.
    try {
      await store.save()

      return true
    } catch (error) {
      console.log("failed to save", error)
      return false
    }
  },
}
