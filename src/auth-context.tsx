// TODO: remove loading

import * as React from "react"
import {APIStore} from "./utils/tauri-store"
import toast from "react-hot-toast"
import {API} from "./service"
import {handleError} from "./utils/error"

export type Creds = {
  apiKey: string
  host: string
}

export interface AuthContextType {
  isAuthenticated: boolean
  login: (creds: Creds) => void
  logout: () => void
  creds: Creds | null
  loading: boolean
}

const AuthContext = React.createContext<AuthContextType | null>(null)

export const AuthProvider = ({children}: {children: React.ReactNode}) => {
  const [creds, setCreds] = React.useState<{apiKey: string; host: string} | null>(null)
  const [loading, setLoading] = React.useState(false)

  const isAuthenticated = !!creds

  React.useEffect(() => {
    async function getCreds() {
      try {
        const creds = await APIStore.get()

        if (creds) {
          setLoading(true)

          API.checkServerHealth({
            notifyServerStatus: isOnline => {
              if (!isOnline) {
                toast.error("Unable to connect to server.")
                setCreds(creds)
              }
            },
            notifyInternetStatus: isOnline => {
              if (!isOnline) {
                toast.error("You are offline. Please connect to the internet.")
                setCreds(creds)
              }
            },
            notifySessionValidity: {
              creds,
              notify: isOnline => {
                if (!isOnline) {
                  toast.error("Login failed. Invalid credentials.")
                  setCreds(null)
                  logout()
                }
              },
            },
          })
        }

        setCreds(creds)
      } catch (err) {
        handleError({error: err, defaultMessage: "Connecting to server failed..."})
      } finally {
        setLoading(false)
      }
    }

    getCreds()
  }, [])

  async function logout() {
    try {
      await APIStore.reset()
      await APIStore.save()

      setCreds(null)
    } catch (error) {
      toast.error("Logout failed")
    }
  }

  async function login(creds: Creds) {
    try {
      await APIStore.set(creds)
      await APIStore.save()

      setCreds(creds)
    } catch (err) {
      toast.error("Session start failed")
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
        loading,
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
