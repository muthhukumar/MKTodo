import * as React from "react"
import * as Dialog from "@radix-ui/react-dialog"

import clsx from "clsx"
import {
  MdRepeat,
  MdOutlineDeleteForever,
  MdSunny,
  MdClose,
  MdOutlineArrowForwardIos,
} from "react-icons/md"
import {AiOutlinePlus} from "react-icons/ai"
import {MdDelete} from "react-icons/md"

import {List, SubTask, TTask} from "~/@types"
import {timeAgo, isDateSameAsToday, getTodayDate, isDateInPast} from "~/utils/date"
import {useDelay, useOnKeyPress} from "~/utils/hooks"
import DueDateInput from "./DueDateInput"
import {SubTaskInfo, TaskToggleIcon} from "./Task"
import {API} from "~/service"
import {useRouter} from "@tanstack/react-router"
import {AutoResizeTextarea, CopyToClipboardButton, Divider, FeatureFlag, Select} from ".."
import {extractLinks} from "~/utils/url"
import {useAudioPlayer} from "~/utils/hooks"
import doneAudio from "~/assets/audio/ting.mp3"
import {handleError} from "~/utils/error"
import {options} from "../Select/data"
import {taskQueue} from "~/utils/task-queue"
import {useGoBack} from "~/utils/navigation"
import {isValidNumber} from "~/utils/validate"
import toast from "react-hot-toast"

interface DrawerProps extends TTask {
  onDismiss: () => void
  ignoreRef?: React.RefObject<HTMLDivElement>
  lists: Array<List>
}

const Drawer = React.forwardRef<HTMLDivElement, DrawerProps>(function Drawer(
  {
    metadata,
    name,
    completed,
    created_at,
    id,
    onDismiss,
    marked_today,
    due_date,
    sub_tasks,
    recurrence_pattern,
    recurrence_interval,
    start_date,
    list_id,
    lists,
  },
  ref,
) {
  const [showDeleteModal, setShowDeleteModal] = React.useState(false)
  const modalRef = React.useRef<HTMLDivElement>(null)
  const goBack = useGoBack()

  const links = React.useMemo(() => extractLinks(name), [name])

  const router = useRouter()

  const inputRef = React.useRef<HTMLTextAreaElement>(null)

  const {togglePlay} = useAudioPlayer(doneAudio)

  useOnKeyPress({
    callback: onDismiss,
    validateKey: e => e.key === "Escape",
  })

  async function updateTaskName(value: string) {
    if (name === value) return

    try {
      await API.updateTaskById({id: id, task: value})

      router.invalidate()
    } catch (error) {
      handleError({error, defaultMessage: "Updating task name failed"})
    }
  }

  async function toggleTaskAddToMyDay(id: number) {
    try {
      await API.toggleTaskAddToMyDayById(id)

      router.invalidate()
    } catch (error) {
      handleError({error, defaultMessage: "Adding task to My Day failed"})
    }
  }

  async function updateTaskDueDate(id: number, dueDate: string) {
    try {
      await API.updateTaskDueDateById(id, dueDate)

      router.invalidate()
    } catch (error) {
      handleError({error, defaultMessage: "Updating task Due Day failed"})
    }
  }

  async function updateTaskMetadata({id, metadata}: {id: number; metadata: string}) {
    try {
      await API.updateTaskMetadata({id, metadata})

      router.invalidate()
    } catch (error) {
      handleError({error, defaultMessage: "Updating task metadata failed"})
    }
  }

  async function deleteTask(id: number) {
    try {
      await API.deleteTaskById(id)

      onDismiss()
    } catch (error) {
      handleError({error, defaultMessage: "Deleting task failed"})
    }
  }

  async function updateTaskList(listId: string) {
    try {
      await API.updateTaskListId(id, listId)

      router.invalidate()
    } catch (error) {
      handleError({error, defaultMessage: "Deleting task failed"})
    }
  }

  async function toggleTask(id: number) {
    if (!completed) togglePlay()

    try {
      await taskQueue.enqueue(API.toggleTaskCompletedById.bind(null, id))

      router.invalidate()
    } catch (error) {
      handleError({error, defaultMessage: "Toggling Task completion failed"})
    }
  }

  const [onFocusLeave] = useDelay(updateTaskName)
  const [onChange] = useDelay(updateTaskName, 3000)

  async function updateRecurrenceOfTask(props: {
    recurrenceInterval: string | number
    recurrencePattern: string
    startDate: string
  }) {
    try {
      await API.updateTaskRecurrence({...props, taskId: id})

      router.invalidate()
    } catch (error) {
      handleError({error, defaultMessage: "Failed to update task recurrence"})
    }
  }

  return (
    <div
      className="min-h-[100vh] w-full border-l border-zinc-700 slide-in fixed right-0 md:max-w-xs z-[100] min-w-72 h-[100vh] hide-scrollbar px-3 bg-background"
      ref={ref}
    >
      <div className="bg-background flex items-center w-full mb-3 pt-3 sticky top-0 right-0 left-0 z-[200]">
        <div className="mt-3 flex items-start w-full">
          <div className="flex-[0.1] flex items-center">
            <TaskToggleIcon completed={completed} onClick={() => toggleTask(id)} />
          </div>
          <div className="flex-[0.9] w-full max-h-[30vh] overflow-y-auto no-scrollbar bg-background">
            <AutoResizeTextarea
              ref={inputRef}
              className="w-full rounded-md bg-background outline-none"
              onBlur={e => onFocusLeave(e.target.value)}
              key={name}
              onChange={e => onChange(e.target.value)}
              defaultValue={name}
            />
          </div>
        </div>
      </div>
      <FeatureFlag feature="SubTask">
        <FeatureFlag.Feature>
          <Divider space="sm" />
          <SubTasks sub_tasks={sub_tasks} task_id={id} />
        </FeatureFlag.Feature>
      </FeatureFlag>
      <Divider space="sm" />
      <AddToMyDay id={id} markedToday={marked_today} onToggleAddToMyDay={toggleTaskAddToMyDay} />
      <Divider space="sm" />
      <DueDateInput onSelect={dueDate => updateTaskDueDate(id, dueDate)} dueDate={due_date} />

      <Divider space="sm" />
      <FeatureFlag feature="RecurringTask">
        <FeatureFlag.Feature>
          <RecurringTaskInput
            onSubmit={updateRecurrenceOfTask}
            startDate={start_date}
            recurrencePattern={recurrence_pattern}
            recurrenceInterval={recurrence_interval}
          />
        </FeatureFlag.Feature>
      </FeatureFlag>
      <Divider space="sm" />
      <FeatureFlag feature="TaskTagInput">
        <FeatureFlag.Feature>
          <div className="py-2">
            <TaskMetaTag metadata={metadata} id={id} updateMetadata={updateTaskMetadata} key={id} />
          </div>
        </FeatureFlag.Feature>
      </FeatureFlag>

      <Divider space="sm" />
      <FeatureFlag feature="UpdateTaskListInput">
        <FeatureFlag.Feature>
          <SelectTaskListInput lists={lists} onSelect={updateTaskList} defaultValue={list_id} />
          <Divider space="sm" />
        </FeatureFlag.Feature>
      </FeatureFlag>

      <FeatureFlag feature="LinksListDrawer">
        <FeatureFlag.Feature>
          {links.length > 0 && (
            <>
              <Divider space="sm" />
              <Links links={links} />
            </>
          )}
        </FeatureFlag.Feature>
      </FeatureFlag>

      <div className="w-full h-[70vh]" />

      <div className="z-10 bg-inherit p-3 border-t border-border sticky bottom-0 left-0 right-0 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button onClick={goBack}>
            <MdOutlineArrowForwardIos size={18} />
          </button>
          <FeatureFlag feature="CopyTaskTextInDrawer">
            <FeatureFlag.Feature>
              <CopyToClipboardButton content={name} />
            </FeatureFlag.Feature>
          </FeatureFlag>
        </div>
        <p className="text-xs">Created {timeAgo(created_at)}</p>
        <button>
          <MdOutlineDeleteForever size={20} onClick={() => setShowDeleteModal(true)} />
        </button>
      </div>
      <DeleteTaskModel
        name={name}
        id={id}
        modalRef={modalRef}
        onDelete={id => {
          deleteTask(id)
          setShowDeleteModal(false)
        }}
        open={showDeleteModal}
        onDismiss={() => setShowDeleteModal(false)}
      />
    </div>
  )
})

export function getMetaTags(metadata: string): Array<string> {
  if (metadata === "") return []

  return metadata.split(",")
}

export function removeDuplicates(...args: Array<any>) {
  return [...new Set([...args].flat())]
}

function TaskMetaTag({
  metadata,
  updateMetadata,
  id,
}: {
  metadata: string
  updateMetadata: (props: {id: number; metadata: string}) => void
  id: number
}) {
  const initialOptions = React.useMemo(() => getMetaTags(metadata), [metadata])

  const [selectedOptions, setSelectedOptions] = React.useState<Array<string>>(initialOptions)

  const [update] = useDelay((metadata: string) => {
    updateMetadata({id, metadata})
  }, 1500)

  return (
    <Select
      data={removeDuplicates(options, initialOptions)}
      label="Metadata"
      setSelectedOptions={options => {
        let updatedOptions = null

        if (typeof options === "function") {
          updatedOptions = options(selectedOptions)
        } else {
          updatedOptions = options
        }

        setSelectedOptions(updatedOptions)

        update(updatedOptions.join(",").trim())
      }}
      selectedOptions={selectedOptions}
    />
  )
}

interface ExternalLinkProps extends React.ComponentProps<"a"> {
  href: string
}

function ExternalLink(props: ExternalLinkProps) {
  const [title, setTitle] = React.useState<string | null>(null)

  React.useEffect(() => {
    async function fetchWebPageTitle() {
      try {
        const title = await API.fetchWebPageTitle(props.href)

        if (title) setTitle(title)
      } catch (error) {
        setTitle("")
      }
    }

    if (title === null) {
      fetchWebPageTitle()
    }
  }, [props.href])

  return <a {...props}>{title ? title : props.href}</a>
}

function Links({links}: {links: Array<string>}) {
  return (
    <div className="border-border py-3 my-3 p-3 border rounded-md">
      <div className="flex flex-col gap-1">
        {links.map(link => {
          return (
            <div className="justify-between flex items-center gap-3">
              <ExternalLink
                href={link}
                key={link}
                target="_blank"
                className="text-blue-400 truncate flex-[0.9]"
              >
                {link}
              </ExternalLink>
              <div className="flex-[0.1]">
                <CopyToClipboardButton content={link} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function AddToMyDay(props: {
  id: number
  onToggleAddToMyDay: (id: number) => void
  markedToday: string
}) {
  return (
    <button
      className={clsx("w-full py-3 text-zinc-400 pl-2 flex items-center gap-4 text-sm")}
      onClick={e => {
        props.onToggleAddToMyDay(props.id)

        e.stopPropagation()
      }}
    >
      <MdSunny size={12} />
      <span>{isDateSameAsToday(props.markedToday) ? "Added to my day" : "Add to my day"}</span>
      {isDateSameAsToday(props.markedToday) && <MdClose className="ml-auto" />}
    </button>
  )
}

export function DeleteTaskModel({
  name,
  id,
  onDelete,
  onDismiss,
  open,
  modalRef,
}: {
  open: boolean
  onDismiss: () => void
  name: string
  id: number
  onDelete: (id: number) => void
  modalRef: React.RefObject<HTMLDivElement>
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onDismiss}>
      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay" />
        <Dialog.Content className="dialog-content border rounded-md border-border bg-background">
          <Dialog.Title className="dialog-title text-center">Delete Task</Dialog.Title>
          <Dialog.Description className="font-bold dialog-description">{name}</Dialog.Description>
          <p className="text-sm mb-4">You won't be able to undo this action.</p>
          <div ref={modalRef} className="flex justify-center items-center gap-3">
            <Dialog.Close className="dialog-close">Cancel</Dialog.Close>
            <button
              className="border rounded-md px-3 py-1"
              type="button"
              onClick={() => onDelete(id)}
            >
              Delete Task
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

function SubTasks({sub_tasks = [], task_id}: {task_id: number; sub_tasks: TTask["sub_tasks"]}) {
  const [showCreateSubTaskInput, setShowCreateSubTaskInput] = React.useState(false)

  const subTasks = sub_tasks || []

  const router = useRouter()

  const updateSubTaskName = async (subTaskId: number, task: string) => {
    try {
      await API.updateSubTaskById({id: subTaskId, task})

      router.invalidate()
    } catch (error) {
      handleError({error, defaultMessage: "Failed to update subtask"})
    }
  }

  const createSubTask = async (name: string) => {
    try {
      await API.createSubTask({task_id, name})

      router.invalidate()
    } catch (error) {
      handleError({error, defaultMessage: "Failed to create subtask"})
    }
  }

  const deleteSubTask = async (id: number) => {
    try {
      await API.deleteSubTaskById(id)

      router.invalidate()
    } catch (error) {
      handleError({error, defaultMessage: "Failed to delete subtask"})
    }
  }

  const toggleSubTaskCompletedById = async (id: number) => {
    try {
      await API.toggleSubTaskCompletedById(id)

      router.invalidate()
    } catch (error) {
      handleError({error, defaultMessage: "Failed to toggle subtask"})
    }
  }

  const [onChangeName] = useDelay(({subTaskId, value}: {subTaskId: number; value: string}) => {
    updateSubTaskName(subTaskId, value)
  }, 3000)

  const totalCompletedSubTasks = React.useMemo(
    () =>
      subTasks.reduce((prev, curr) => {
        if (curr.completed) return prev + 1
        return prev
      }, 0),
    [subTasks],
  )

  return (
    <div className="my-5 px-2">
      <div className="max-h-[30vh] hide-scrollbar flex flex-col gap-3">
        {subTasks.map((st, idx) => {
          return (
            <SubTaskItem
              index={idx + 1}
              onSubmit={() => undefined}
              onBlur={() => undefined}
              {...st}
              key={st.id}
              onToggle={() => toggleSubTaskCompletedById(st.id)}
              onChange={name => onChangeName({value: name, subTaskId: st.id})}
              deleteTask={() => deleteSubTask(st.id)}
            />
          )
        })}
        {showCreateSubTaskInput && (
          <CreateSubTaskInput
            index={(sub_tasks?.length || 0) + 1}
            onCancel={() => setShowCreateSubTaskInput(false)}
            onCreate={createSubTask}
          />
        )}
      </div>
      {subTasks.length > 0 && (
        <div className="flex items-center justify-center mt-2">
          <SubTaskInfo
            totalSubTasks={subTasks.length}
            totalCompletedSubTasks={totalCompletedSubTasks}
          />
        </div>
      )}
      <button
        className={clsx("flex items-center gap-4 text-sm text-zinc-400", {
          "mt-5": subTasks.length !== 0 || showCreateSubTaskInput,
        })}
        onClick={() => setShowCreateSubTaskInput(true)}
      >
        <AiOutlinePlus /> <span>{subTasks.length === 0 ? "Add Step" : "Next Step"}</span>
      </button>
    </div>
  )
}

function CreateSubTaskInput({
  onCreate,
  onCancel,
  index,
}: {
  onCreate: (name: string) => void
  onCancel: () => void
  index: number
}) {
  const [onChange, cancel] = useDelay(({name, reset}: {name: string; reset: () => void}) => {
    onCreate(name)
    reset()
  }, 3000)

  return (
    <SubTaskItem
      onSubmit={(name: string) => {
        onCreate(name)
        cancel()
      }}
      onBlur={onCancel}
      index={index}
      autoFocus={true}
      onToggle={() => undefined}
      completed={false}
      onChange={(name: string, reset) => {
        if (name.length >= 3) onChange({name, reset})
      }}
      deleteTask={onCancel}
    />
  )
}

interface SubTaskItemProps extends Pick<SubTask, "completed"> {
  onToggle: () => void
  id?: number
  onChange: (name: string, reset: () => void) => void
  onSubmit: (name: string) => void
  name?: string
  autoFocus?: boolean
  deleteTask: () => void
  onBlur: () => void
  index?: number
}

function SubTaskItem({
  id,
  name,
  completed,
  onToggle,
  onChange,
  deleteTask,
  autoFocus = false,
  onBlur,
  onSubmit,
  index,
}: SubTaskItemProps) {
  const modalRef = React.useRef<HTMLDivElement>(null)
  const [showDeleteModal, setShowDeleteModal] = React.useState(false)

  const inputRef = React.useRef<HTMLInputElement>(null)

  const resetInput = () => {
    /* Note: If there is default value, then there is not need to reset the value */
    if (inputRef.current && !name) inputRef.current.value = ""
  }

  const onFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(inputRef.current?.value ?? "")

    resetInput()
  }

  return (
    <>
      <form className="relative flex items-center" onSubmit={onFormSubmit}>
        <TaskToggleIcon completed={completed} onClick={onToggle} />
        <div className="ml-2 w-full flex items-center">
          <FeatureFlag feature="SubTasksOrderListIndex">
            <FeatureFlag.Feature>
              <span className="text-zinc-300 text-sm">{index}. </span>
            </FeatureFlag.Feature>
          </FeatureFlag>
          <input
            ref={inputRef}
            className="w-full bg-inherit outline-none ml-2"
            onChange={e => onChange(e.target.value, resetInput)}
            defaultValue={name}
            autoFocus={autoFocus}
            onBlur={onBlur}
          />
        </div>
        <button type="button" onClick={() => setShowDeleteModal(true)} className="ml-1">
          <MdDelete size={22} />
        </button>
      </form>
      <DeleteTaskModel
        name={name ?? ""}
        id={id || 0}
        modalRef={modalRef}
        onDelete={() => {
          deleteTask()
          setShowDeleteModal(false)
        }}
        open={showDeleteModal}
        onDismiss={() => setShowDeleteModal(false)}
      />
    </>
  )
}

interface RecurringTaskInputProps {
  recurrenceInterval: string | number
  recurrencePattern: string
  startDate: string
  onSubmit: (props: {
    recurrenceInterval: string | number
    recurrencePattern: string
    startDate: string
  }) => {}
}

function recurrencePatternReverseMap(pattern: string, interval: string | number) {
  let result = ""

  switch (pattern) {
    case "daily":
      result = "day"
      break
    case "weekly":
      result = "week"
      break
    case "monthly":
      result = "month"
      break
    case "yearly":
      result = "year"
      break
    default:
  }

  return interval === "1" || interval === 1 ? result : result + "s"
}

function RecurringTaskInput(props: RecurringTaskInputProps) {
  const [recurrenceInterval, setRecurrenceInterval] = React.useState(
    props.recurrenceInterval === 0 ? "" : props.recurrenceInterval,
  )
  const [recurrencePattern, setRecurrencePattern] = React.useState(props.recurrencePattern)
  const [startDate, setStartDate] = React.useState(props.startDate || getTodayDate())
  const [showInput, setShowInput] = React.useState(false)

  function onRecurrencePatternChange(value: string) {
    setRecurrencePattern(value)

    if (!recurrenceInterval) return
  }

  return (
    <div className="relative">
      {props.recurrencePattern === "" && (
        <button
          className="text-zinc-400 text-sm w-full flex items-center py-3 gap-3 px-2"
          onClick={() => setShowInput(state => !state)}
        >
          <MdRepeat />
          <p>Repeat</p>
        </button>
      )}
      {props.recurrencePattern !== "" && Boolean(props.recurrencePattern) && (
        <div
          className="text-zinc-400 py-3 w-full flex items-center justify-between mb-3 pl-2"
          onClick={() => setShowInput(state => !state)}
        >
          <p>
            <h2 className="font-bold">
              Repeats every {props.recurrenceInterval}{" "}
              {recurrencePatternReverseMap(props.recurrencePattern, props.recurrenceInterval)}
            </h2>
          </p>
          <button
            onClick={e => {
              e.stopPropagation()

              props.onSubmit({
                recurrenceInterval: 0,
                recurrencePattern: "",
                startDate: "",
              })

              setShowInput(false)
            }}
          >
            <MdClose size={15} />
          </button>
        </div>
      )}
      {showInput && (
        <div className="bg-background z-20 absolute top-full left-0 right-0 mt-3 border border-border p-3 rounded-md">
          <h2 className="font-bold mb-3">Repeats</h2>
          <div>
            <input
              maxLength={2}
              value={recurrenceInterval}
              onChange={e => {
                const value = e.target.value

                if (!value || isValidNumber(value)) {
                  setRecurrenceInterval(value)
                }
              }}
              type="text"
              className="px-1 w-16 border border-border rounded-md mr-3"
            />
            <select
              value={recurrencePattern}
              onChange={e => onRecurrencePatternChange(e.target.value)}
            >
              <option disabled value="">
                Select
              </option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
          <div className="flex flex-col mt-3 gap-1">
            <label htmlFor="startDate">Start date</label>
            <input
              type="date"
              id="startDate"
              placeholder="Start date"
              min={getTodayDate()}
              value={startDate}
              onChange={e => {
                if (isDateInPast(new Date())) {
                  toast.error("Cannot select past date")
                } else {
                  setStartDate(e.target.value)
                }
              }}
              className="w-fit px-3 rounded-md"
            />
          </div>
          <div className="mt-3 flex items-center gap-1 justify-end">
            <button
              className="bg-item-background text-sm px-3 py-1 rounded-md"
              onClick={() => setShowInput(false)}
            >
              Cancel
            </button>
            <button
              className="bg-blue-500 text-sm px-3 py-1 rounded-md"
              onClick={() => {
                props.onSubmit({
                  recurrenceInterval,
                  recurrencePattern,
                  startDate,
                })
                setShowInput(false)
              }}
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

interface SelectTaskListInputProps {
  lists: Array<List>
  defaultValue: number | null
  onSelect: (id: string) => void
}

function SelectTaskListInput(props: SelectTaskListInputProps) {
  return (
    <div className="py-2 w-full flex items-center gap-3 text-zinc-400">
      <select
        className="w-full px-3 py-1 bg-inherit rounded-md border-none"
        value={props.defaultValue || ""}
        onChange={e => props.onSelect(e.target.value)}
      >
        <option disabled value="">
          Select List
        </option>
        {props.lists.map(l => {
          return (
            <option value={String(l.id)} key={l.id}>
              {l.name}
            </option>
          )
        })}
      </select>
      {Boolean(props.defaultValue) && (
        <button type="button" onClick={() => props.onSelect("")}>
          <MdClose className="ml-auto" />
        </button>
      )}
    </div>
  )
}

export default Drawer
