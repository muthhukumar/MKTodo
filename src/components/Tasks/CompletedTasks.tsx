import {TaskTypes, TTask} from "~/@types"
import {Task} from ".."

interface CompletedTasksProps {
  tasks: Array<TTask>
  onTaskToggle: (id: number, completed: boolean) => void
  type: TaskTypes
}

function CompletedTasks(props: CompletedTasksProps) {
  const {tasks, onTaskToggle, type} = props

  return (
    <>
      {tasks.length > 0 && (
        <h2 className="w-fit text-sm bg-hover-background rounded-md px-2 py-1 my-2">
          Completed
          <span className="font-normal text-xs px-2 py-1 rounded-md">{tasks.length}</span>
        </h2>
      )}
      {tasks.map(t => (
        <Task
          onToggle={onTaskToggle}
          {...t}
          key={t.id}
          type={type as "all" | "my-day" | "important" | "planned"}
        />
      ))}
    </>
  )
}

export default CompletedTasks
