import clsx from "clsx"
import * as React from "react"
import {IconType} from "react-icons"

import {BsCalendar4Event, BsCalendar4Week} from "react-icons/bs"
import {IoCalendarOutline, IoCalendarClearOutline} from "react-icons/io5"
import {LuCalendarRange} from "react-icons/lu"
import {MdClose} from "react-icons/md"

import {
  getTodayDate,
  getDayFromDate,
  getTomorrowDate,
  getComingMondayDate,
  isDateInPast,
} from "~/utils/date"
import {getDueDateDisplayStr} from "~/utils/tasks"

interface DueDateInputProps {
  onSelect: (date: string) => void
  dueDate: string
}

export default function DueDateInput({onSelect, dueDate}: DueDateInputProps) {
  const [show, setShow] = React.useState(false)

  const overdue = dueDate ? isDateInPast(dueDate) : false

  return (
    <div className="relative">
      <div className="flex items-center">
        <button
          className={clsx("w-full px-2 text-sm flex my-3 items-center gap-3 text-zinc-400", {
            "text-red-600": overdue,
          })}
          onClick={() => {
            setShow(state => !state)
          }}
        >
          <IoCalendarOutline />
          {dueDate ? <span>Due {getDueDateDisplayStr(dueDate)}</span> : <span>Add Due Date</span>}
        </button>

        {dueDate && (
          <button
            onClick={e => {
              e.stopPropagation()

              setShow(false)
              onSelect("")
            }}
            className="ml-auto text-zinc-400"
          >
            <MdClose size={15} className="" />
          </button>
        )}
      </div>
      {show && <DueDateOptions onSelect={onSelect} setShow={setShow} />}
    </div>
  )
}

interface DueDateOptionsProps {
  onSelect: (value: string) => void
  setShow: (value: boolean) => void
}

function DueDateOptions(props: DueDateOptionsProps) {
  const {onSelect, setShow} = props
  const [date, setDate] = React.useState("")

  return (
    <div className="absolute left-0 right-0 top-full border border-border rounded-md bg-background z-20 p-1">
      <DueDateOption
        Icon={BsCalendar4Event}
        title="Today"
        onSelect={() => onSelect(getTodayDate())}
        info={getDayFromDate(getTodayDate())}
        setShow={setShow}
      />
      <DueDateOption
        Icon={BsCalendar4Week}
        title="Tomorrow"
        onSelect={() => onSelect(getTomorrowDate())}
        info={getDayFromDate(getTomorrowDate())}
        setShow={setShow}
      />
      <DueDateOption
        Icon={LuCalendarRange}
        title="Next Week"
        onSelect={() => onSelect(getComingMondayDate())}
        info={getDayFromDate(getComingMondayDate())}
        setShow={setShow}
      />
      {/* TODO: change the bg color here */}
      <div className="h-[1px] bg-border m-[5px]" />
      <DueDateOption
        Icon={IoCalendarClearOutline}
        title="Pick a Date"
        onSelect={() => undefined}
        autoClose={false}
        setShow={setShow}
        action={
          <div className="flex gap-1 items-center justify-end px-3 py-1">
            <button
              className="bg-item-background border border-border rounded-md px-2"
              onClick={() => setShow(false)}
            >
              Cancel
            </button>
            <button
              className="rounded-md bg-blue-500 px-2"
              onClick={() => {
                setShow(false)

                onSelect(date)
              }}
            >
              Save
            </button>
          </div>
        }
      >
        <input
          type="date"
          placeholder="Pick a Date"
          value={date}
          onChange={e => {
            setDate(e.target.value)
          }}
        />
      </DueDateOption>
    </div>
  )
}

interface DueDateOptionProps {
  Icon: IconType
  title: string
  children?: React.ReactNode
  onSelect: () => void
  autoClose?: boolean
  action?: React.ReactNode
  info?: string
  setShow: (show: boolean) => void
}

function DueDateOption(props: DueDateOptionProps) {
  const {title, Icon, children, onSelect, autoClose = true, action, info, setShow} = props

  return (
    <>
      <button
        onClick={() => {
          onSelect()
          autoClose && setShow(false)
        }}
        className="text-sm w-full py-1 flex items-center gap-3 hover:bg-hover-background px-3"
      >
        <Icon />
        <p className="">{title}</p>
        {children ? children : info ? <span className="inline-block ml-auto">{info}</span> : null}
      </button>
      {action}
    </>
  )
}
