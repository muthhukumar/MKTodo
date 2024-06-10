import React from "react"
import ReactDOM from "react-dom/client"
// import App from "./App"
import TasksProvider from "./context"
import {RouterProvider, createRouter} from "@tanstack/react-router"
import {routeTree} from "./routeTree.gen"
import {AuthProvider, useAuth} from "./auth-context"

// Set up a Router instance
const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  context: {
    auth: undefined!, // This will be set after we wrap the app in an AuthProvider
  },
})

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router
  }
}

function InnerApp() {
  const auth = useAuth()
  return <RouterProvider router={router} context={{auth}} />
}

function App() {
  return (
    <React.StrictMode>
      <AuthProvider>
        <TasksProvider>
          <InnerApp />
        </TasksProvider>
      </AuthProvider>
    </React.StrictMode>
  )
}

const rootElement = document.getElementById("root")!

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)

  root.render(<App />)
}
