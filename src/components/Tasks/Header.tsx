import * as React from "react"
import {TTask, TaskTypes} from "~/@types"
import {DesktopOnly, FeatureFlag, MobileOnly, SearchBar, Select} from ".."
import {TagFilter, DueDateFilter} from "."
import {Link} from "@tanstack/react-router"
import {IoSearchOutline} from "react-icons/io5"
import {TbSettings} from "react-icons/tb"
import {invariant} from "~/utils/invariants"
import {useDelay} from "~/utils/hooks"
import {DeleteTaskModel} from "./Drawer"
import {MdDelete} from "react-icons/md"

interface TaskHeaderProps {
  title: string
  //source?: string
  pendingTasks: TTask[]
  tasks: TTask[]
  tagFilterOptions: any[]
  setTagFilters: React.Dispatch<React.SetStateAction<string[]>>
  tagFilters: string[]
  showFilters?: boolean
  taskType: Exclude<TaskTypes, "planned:tomorrow" | "planned:today"> | "list"
  onListNameSubmit: (listName: string) => void
  listId: number | null
  deleteList: (listId: number) => void
}

function TaskHeader(props: TaskHeaderProps) {
  const {
    title,
    //source = null,
    tagFilterOptions,
    pendingTasks,
    tasks,
    setTagFilters,
    tagFilters,
    showFilters,
    taskType,
    onListNameSubmit,
    listId,
    deleteList,
  } = props

  const [showDeleteModal, setShowDeleteModal] = React.useState(false)

  invariant((taskType as string) !== "search", "Task type cannot be search. Got ", taskType)

  const isList = taskType === "list"

  const modalRef = React.useRef(null)

  return (
    <div className="sticky top-0 py-1 left-0 right-0 bg-background z-10">
      <div className="flex items-center justify-between py-2 relative">
        <h1 className="flex items-center gap-2 text-2xl font-bold">
          {isList ? (
            <EditListTitle title={title} onSave={onListNameSubmit} />
          ) : (
            <span>
              {title}
              {/* <span className="font-normal text-xs ml-2">{source}</span> */}
            </span>
          )}
          <FeatureFlag feature="TasksCountInTitle">
            <FeatureFlag.Feature>
              <span className="font-normal text-xs px-2 py-1 rounded-md bg-hover-background">
                {pendingTasks.length} / {tasks.length}
              </span>
            </FeatureFlag.Feature>
          </FeatureFlag>
        </h1>
        <div className="flex items-center gap-3">
          <FeatureFlag feature="TagFilter">
            <FeatureFlag.Feature>
              <MobileOnly>
                <TagFilter
                  tags={tagFilterOptions}
                  setSelectedFilters={setTagFilters}
                  selectedFilters={tagFilters}
                />
              </MobileOnly>
            </FeatureFlag.Feature>
          </FeatureFlag>
          <DesktopOnly>
            <button type="button" onClick={() => setShowDeleteModal(true)} className="ml-2">
              <MdDelete size={22} />
            </button>
            <DeleteTaskModel
              name={title}
              id={listId || 0}
              modalRef={modalRef}
              onDelete={id => {
                if (id === 0) {
                  setShowDeleteModal(false)

                  invariant(false, "Trying to delete list with id 0")
                } else {
                  deleteList(id)
                  setShowDeleteModal(false)
                }
              }}
              open={showDeleteModal}
              onDismiss={() => setShowDeleteModal(false)}
            />
            <FeatureFlag feature="TagFilter">
              <FeatureFlag.Feature>
                <Select
                  data={tagFilterOptions}
                  setSelectedOptions={setTagFilters}
                  selectedOptions={tagFilters}
                />
              </FeatureFlag.Feature>
            </FeatureFlag>
          </DesktopOnly>
          <MobileOnly>
            <Link
              to="/search"
              search={{
                query: "",
              }}
            >
              <IoSearchOutline size={20} />
            </Link>
            {/*<MobileSearchBar />
             */}
            <Link to="/settings">
              <TbSettings size={21} />
            </Link>
          </MobileOnly>
        </div>
      </div>

      <DesktopOnly>
        <div className="hidden my-1">
          <SearchBar />
        </div>
      </DesktopOnly>
      {showFilters && <DueDateFilter />}
    </div>
  )
}

function EditListTitle({title, onSave}: {title: string; onSave: (title: string) => void}) {
  const [showInput, setShowInput] = React.useState(false)

  if (!showInput) return <button onClick={() => setShowInput(true)}>{title}</button>

  const [onChange] = useDelay((listName: string) => {
    onSave(listName)
    setShowInput(false)
  }, 3000)

  return (
    <input
      autoFocus
      className="w-fit bg-inherit"
      defaultValue={title}
      onChange={e => onChange(e.target.value)}
      onBlur={e => {
        onSave(e.target.value)

        setShowInput(false)
      }}
    />
  )
}

export default TaskHeader
