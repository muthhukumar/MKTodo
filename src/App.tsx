import "./App.css"
import "./tailwind.css"
import "./css-reset.css"
import "./modal.css"

import {Tasks, Sidebar, DesktopOnly} from "./components"

function App() {
  return (
    <div className="h-screen flex">
      <DesktopOnly>
        <Sidebar />
      </DesktopOnly>
      <Tasks />
    </div>
  )
}

export default App
