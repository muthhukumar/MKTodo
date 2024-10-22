import * as React from "react"
import "./App.css"
import "./tailwind.css"
import "./css-reset.css"
import "./modal.css"
import {Toaster} from "react-hot-toast"

import {createRouter, RouterProvider} from "@tanstack/react-router"
import {useAuth, AuthProvider} from "./auth-context"

import {routeTree} from "./routeTree.gen"
import {FeatureFlag, FontInitializer, Notifier, SplashScreen} from "~/components"
import {FeatureContextProvider} from "./feature-context"
import {ListContextProvider} from "./utils/list/hooks"

export const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  context: {
    auth: undefined!,
  },
})

function InnerApp() {
  const auth = useAuth()

  const [showSplashScreen, setShowSplashScreen] = React.useState(true)

  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      setShowSplashScreen(false)
    }, 750)

    return () => {
      return clearTimeout(timeoutId)
    }
  }, [])

  return (
    <>
      <FeatureFlag feature="SyncNotifier">
        <FeatureFlag.Feature>
          <Notifier elementId="syncing" />
        </FeatureFlag.Feature>
      </FeatureFlag>
      <FeatureFlag feature="Notifier">
        <FeatureFlag.Feature>
          <Notifier elementId="notifier" />
        </FeatureFlag.Feature>
      </FeatureFlag>
      <FontInitializer />
      <Toaster position="top-center" />
      {showSplashScreen ? <SplashScreen /> : <RouterProvider router={router} context={{auth}} />}
    </>
  )
}

function App() {
  return (
    <AuthProvider>
      <FeatureContextProvider>
        <ListContextProvider>
          <InnerApp />
        </ListContextProvider>
      </FeatureContextProvider>
    </AuthProvider>
  )
}

export default App
