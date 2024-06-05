import "./App.css"
import "./tailwind.css"
import "./css-reset.css"
import "./modal.css"

import {Tasks, Sidebar, DesktopOnly, Router} from "./components"

function App() {
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
        ]}
      />
    </div>
  )
}

export default App
