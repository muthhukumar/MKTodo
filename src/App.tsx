import * as React from "react"
import "./App.css"
import "./tailwind.css"
import "./css-reset.css"
import "./modal.css"
import {Toaster} from "react-hot-toast"

import {createRouter, RouterProvider} from "@tanstack/react-router"
import {useAuth, AuthProvider} from "./auth-context"

import {routeTree} from "./routeTree.gen"
import {FeatureFlag, SplashScreen, Syncing} from "~/components"
import {FeatureContextProvider} from "./feature-context"

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
      <FeatureFlag feature="SyncingNotifier">
        <FeatureFlag.Feature>
          <Syncing />
        </FeatureFlag.Feature>
      </FeatureFlag>
      <Toaster position="top-center" />
      {showSplashScreen ? <SplashScreen /> : <RouterProvider router={router} context={{auth}} />}
    </>
  )
}

function App() {
  return (
    <AuthProvider>
      <FeatureContextProvider>
        <InnerApp />
      </FeatureContextProvider>
    </AuthProvider>
  )
}

export default App
