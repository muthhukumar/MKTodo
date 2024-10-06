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

let creds: {host: string; apiKey: string} | null = null

export async function getCreds() {
  if (!creds) {
    creds = await APIStore.get()
  }

  return creds
}
