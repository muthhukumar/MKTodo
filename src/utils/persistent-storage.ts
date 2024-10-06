import {Store} from "@tauri-apps/plugin-store"
import toast from "react-hot-toast"
import {store as TauriStore} from "./tauri-store"
import {TTask} from "~/@types"
import {FeatureSetting} from "~/feature-context"

class PersistentStore<T> {
  private store: Store = TauriStore

  constructor(public key: string) {}

  async set(value: T): Promise<void> {
    try {
      await this.store.set(this.key, value)
    } catch (error) {
      toast.error(`Saving ${this.key} value failed`)
    }
  }

  async get(): Promise<T | null> {
    try {
      return (await this.store.get<T>(this.key)) as T
    } catch (error) {
      toast.error(`getting ${this.key} value failed`)
      return null
    }
  }

  async save(): Promise<boolean> {
    try {
      await this.store.save()
      return true
    } catch (error) {
      toast.error(`Saving ${this.key} failed`)
      return false
    }
  }

  async reset() {
    try {
      //await this.store.reset()

      return true
    } catch (error) {
      toast.error(`Resetting ${this.key} failed`)

      return false
    }
  }
}

export const TasksStore = new PersistentStore<Array<TTask>>("tasks")
export const SettingsStore = new PersistentStore<Array<FeatureSetting>>("settings")
// export const APIStore = new PersistentStore<{host: string; apiKey: string}>("CREDS")
