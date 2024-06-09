import * as React from "react"
import "./App.css"
import "./tailwind.css"
import "./css-reset.css"
import "./modal.css"

import {Tasks, Sidebar, DesktopOnly, Router} from "~/components"
import {APIStore, CREDS, store} from "./utils/tauri-store"
import {UnlistenFn} from "@tauri-apps/api/event"
import {useTasks} from "./context"

function App() {
  const [creds, setCreds] = React.useState<{host: string; apiKey: string} | null>(null)

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

  return (
    <div className="h-screen flex">
      {Boolean(creds) ? (
        <>
          <DesktopOnly>
            <Sidebar />
          </DesktopOnly>
          <Router
            routes={[
              {
                path: "/",
                component: () => <Tasks />,
              },
              {
                path: "/important",
                component: () => <Tasks />,
              },
              {
                path: "/my-day",
                component: () => <Tasks />,
              },
              {
                path: "/planned",
                component: () => <Tasks title="Planned" showFilters />,
              },
            ]}
          />
        </>
      ) : (
        <LoginForm />
      )}
    </div>
  )
}

function LoginForm() {
  const hostRef = React.useRef<HTMLInputElement>(null)
  const apiKeyRef = React.useRef<HTMLInputElement>(null)
  const {sync} = useTasks()

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const host = hostRef.current?.value
    const apiKey = apiKeyRef.current?.value

    if (!host || !apiKey) return

    try {
      await APIStore.set({apiKey, host})

      await APIStore.save()

      sync()
    } catch (err) {
      console.log("faild to save details", err)
    }
  }

  return (
    <div className="h-full w-full flex items-center justify-center px-3">
      <form className="w-full max-w-sm mx-auto rounded-md px-3 py-2" onSubmit={onSubmit}>
        <h2 className="mt-3 font-bold text-5xl text-center">mktodo</h2>
        <div className="mt-5">
          <h3>Connect to Server</h3>
          <input
            ref={hostRef}
            className="mt-2 border rounded-md border-light-black px-3 py-2 w-full"
            placeholder="Host"
            name="host"
          />
        </div>
        <div className="mt-3">
          <h3>API Key</h3>
          <input
            ref={apiKeyRef}
            className="mt-2 border-light-black border rounded-md px-3 py-2 w-full"
            placeholder="API key"
          />
        </div>
        <button className="border-light-black mt-8 px-3 py-2 w-full border rounded-md">
          Connect
        </button>
      </form>
    </div>
  )
}

export default App
