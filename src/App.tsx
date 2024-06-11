import "./App.css"
import "./tailwind.css"
import "./css-reset.css"
import "./modal.css"

import {createRouter, RouterProvider} from "@tanstack/react-router"
import {useAuth, AuthProvider} from "./auth-context"

import {routeTree} from "./routeTree.gen"

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
  return (
    <AuthProvider>
      <InnerApp />
    </AuthProvider>
  )
}

export default App
