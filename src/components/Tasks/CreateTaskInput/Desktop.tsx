import * as React from "react"
import {FaPlus} from "react-icons/fa6"
import {TaskTypes} from "~/@types"
import {useDeviceCallback, useOnKeyDown} from "~/utils/hooks"
import {selectNext, taskTypes} from "~/utils/tasks"
import {isActiveElement} from "~/utils/ui"
import {AutoWordSuggestions, Divider, FeatureFlag} from "~/components"
import {AutoCompleteSuggestion} from "~/utils/autocomplete"

interface CreateTaskInputProps {
  task: string
  setTask: (value: string) => void
  setTaskType: React.Dispatch<React.SetStateAction<TaskTypes>>
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  taskType: TaskTypes
  onWordSelect: (word: string) => void
  wordSuggestions: Array<AutoCompleteSuggestion & {id: number}>
}

const CreateTaskInput = React.forwardRef<HTMLInputElement, CreateTaskInputProps>(
  (
    {taskType, task, setTask: onChange, onSubmit, setTaskType, onWordSelect, wordSuggestions},
    ref,
  ) => {
    const inputRef = React.useRef<HTMLInputElement>(null)

    React.useImperativeHandle(ref, () => {
      return {
        focus() {
          inputRef.current?.focus()
        },
      } as HTMLInputElement
    }, [])

    const onPress = useDeviceCallback<KeyboardEvent>({
      mobile: () => undefined,
      desktop: e => {
        if (isActiveElement(inputRef)) {
          e.preventDefault()

          setTaskType(taskType => {
            return selectNext({
              data: taskTypes,
              current: taskType,
              match: ({iterator, value}) => iterator.value === value,
            }).value
          })
        }
      },
    })

    useOnKeyDown({
      validateKey: e => e.key === "Tab",
      callback: onPress,
    })

    return (
      <div>
        <FeatureFlag feature="TaskNameAutoComplete">
          <FeatureFlag.Feature>
            <div className="mb-3">
              <AutoWordSuggestions wordSuggestions={wordSuggestions} onSelect={onWordSelect} />
            </div>
            {wordSuggestions.length > 0 && <Divider space="none" className="mb-2" />}
          </FeatureFlag.Feature>
        </FeatureFlag>
        <form
          onSubmit={onSubmit}
          className="border border-border focus-within:ring-2 focus-within:ring-blue-500 rounded-md flex items-center w-full bg-item-background"
        >
          <FaPlus className="mx-3" />
          <FeatureFlag feature="TaskTypeInputInCreateTask">
            <FeatureFlag.Feature>
              <select
                className="reset-select rounded-md py-1 text-white"
                value={taskType}
                onChange={e => setTaskType(e.target.value as TaskTypes)}
              >
                {taskTypes.map(t => {
                  return (
                    <option key={t.value} value={t.value}>
                      {t.title}
                    </option>
                  )
                })}
              </select>
            </FeatureFlag.Feature>
          </FeatureFlag>
          <input
            ref={inputRef}
            value={task}
            type="text"
            name="Task"
            title="Task"
            onChange={e => onChange(e.target.value)}
            className="outline-none w-full text-white rounded-md px-2 py-3 bg-item-background"
            placeholder="Add a Task"
          />
        </form>
      </div>
    )
  },
)

export default CreateTaskInput
