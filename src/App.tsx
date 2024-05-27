import * as React from "react"
import "./App.css"
import "./tailwind.css"
import "./css-reset.css"

import {API} from "./service"
import {TTask} from "./@types"
import {Task} from "./components"

function App() {
  const [task, setTask] = React.useState("")
  const [tasks, setTasks] = React.useState<Array<TTask>>([])

  async function fetchData() {
    try {
      const tasks = await API.getTasks()

      setTasks(tasks)
    } catch (error) {
      console.log("failed to get tasks")
    }
  }

  React.useEffect(() => {
    fetchData()
  }, [])

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (!task) return

    try {
      await API.createTask({task})

      setTimeout(fetchData, 0)

      setTask("")
    } catch (error) {
      console.log("failed to create task")
    }
  }

  async function onDelete(id: number) {
    try {
      await API.deleteTaskById(id)

      setTimeout(fetchData, 0)
    } catch (error) {
      console.log("failed to delete task")
    }
  }

  return (
    <div className="h-screen">
      <h1>Tasks</h1>
      <div className="max-w-xl mx-auto">
        <form onSubmit={onSubmit} className="w-full">
          <input
            value={task}
            onChange={e => setTask(e.target.value)}
            className="w-full mb-3 border bg-black text-white"
          />
        </form>
        <div className="flex flex-col gap-3">
          {tasks.map(t => (
            <Task key={t.id} {...t} onDelete={onDelete} onUpdate={fetchData} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default App
