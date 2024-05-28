import "./App.css"
import "./tailwind.css"
import "./css-reset.css"
import "./modal.css"

import {Tasks, Sidebar} from "./components"

function App() {
  return (
    <div className="h-screen flex">
      <Sidebar />
      <Tasks />
    </div>
  )
}

export default App
