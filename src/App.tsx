import * as React from "react"
import "./App.css"
import "./tailwind.css"
import "./css-reset.css"
import "./modal.css"

import {Tasks, Sidebar, DesktopOnly, Router} from "~/components"
import {APIStore, CREDS, store} from "./utils/tauri-store"
import {UnlistenFn} from "@tauri-apps/api/event"

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
    </div>
  )
}

export default App
