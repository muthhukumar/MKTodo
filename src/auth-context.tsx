import * as React from "react"
import {APIStore, CREDS, store} from "./utils/tauri-store"
import {UnlistenFn} from "@tauri-apps/api/event"

type Creds = {
  apiKey: string
  host: string
}

export interface AuthContextType {
  isAuthenticated: boolean
  login: (creds: Creds) => void
  logout: () => void
  creds: Creds | null
}

const AuthContext = React.createContext<AuthContextType | null>(null)

export const AuthProvider = ({children}: {children: React.ReactNode}) => {
  const [creds, setCreds] = React.useState<{apiKey: string; host: string} | null>(null)

  const isAuthenticated = !!creds

  React.useEffect(() => {
    let unsubscribe: UnlistenFn | null = null

    async function listen() {
      try {
        const creds = await APIStore.get()

        setCreds(creds)

        unsubscribe = await store.onKeyChange(CREDS, async () => {
          setCreds(await APIStore.get())
        })
      } catch (err) {
        console.log("failed ot listen to values")
      }
    }

    listen()

    return () => {
      console.log("unsubscripted")
      if (unsubscribe) unsubscribe()
    }
  }, [])

  React.useEffect(() => {
    async function getCreds() {
      try {
        const creds = await APIStore.get()

        setCreds(creds)
      } catch (err) {
        console.log("erro getting creds", err)
      }
    }

    getCreds()
  }, [])

  async function logout() {
    try {
      await APIStore.reset()

      setCreds(null)
    } catch (error) {
      console.log("failed to choose different server", error)
    }
  }

  async function login(creds: Creds) {
    try {
      await APIStore.set(creds)
      await APIStore.save()

      setCreds(creds)
    } catch (err) {
      console.log("failed to save credentials", err)
    }

    return undefined
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        creds,
        logout,
        login,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = React.useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
