import React from "react"
import ReactDOM from "react-dom/client"
import App, {router} from "./App"

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router
  }
}

const rootElement = document.getElementById("root")!

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)

  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
}
