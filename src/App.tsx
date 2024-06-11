import * as React from "react"
import "./App.css"
import "./tailwind.css"
import "./css-reset.css"
import "./modal.css"

import {createRouter, RouterProvider} from "@tanstack/react-router"
import {useAuth, AuthProvider} from "./auth-context"

import {routeTree} from "./routeTree.gen"
import {SplashScreen} from "~/components"

export const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  context: {
    auth: undefined!,
  },
})

function InnerApp() {
  const auth = useAuth()

  return <RouterProvider router={router} context={{auth}} />
}

function App() {
  const [showSplashScreen, setShowSplashScreen] = React.useState(true)

  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      setShowSplashScreen(false)
    }, 750)

    return () => {
      return clearTimeout(timeoutId)
    }
  }, [])

  return <AuthProvider>{showSplashScreen ? <SplashScreen /> : <InnerApp />}</AuthProvider>
}

export default App
