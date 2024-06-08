import * as React from "react"
import {IconType} from "react-icons"

import {BsCalendar4Event, BsCalendar4Week} from "react-icons/bs"
import {IoCalendarOutline, IoCalendarClearOutline} from "react-icons/io5"
import {LuCalendarRange} from "react-icons/lu"
import {MdClose} from "react-icons/md"

import {getTodayDate, getDayFromDate, getTomorrowDate, getComingMondayDate} from "~/utils/date"
import {getDueDateDisplayStr} from "~/utils/tasks"

interface DueDateInputProps {
  onSelect: (date: string) => void
  dueDate: string
}

export default function DueDateInput({onSelect, dueDate}: DueDateInputProps) {
  const [show, setShow] = React.useState(false)

  return (
    <div>
      <div className="flex items-center">
        <button
          className="w-full px-2 text-sm flex my-3 items-center gap-3 text-zinc-400"
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
            className="ml-auto"
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
    <div className="border border-zinc-700 rounded-md bg-dark-black p-1">
      <DueDateOptionProps
        Icon={BsCalendar4Event}
        title="Today"
        onSelect={() => onSelect(getTodayDate())}
        info={getDayFromDate(getTodayDate())}
        setShow={setShow}
      />
      <DueDateOptionProps
        Icon={BsCalendar4Week}
        title="Tomorrow"
        onSelect={() => onSelect(getTomorrowDate())}
        info={getDayFromDate(getTomorrowDate())}
        setShow={setShow}
      />
      <DueDateOptionProps
        Icon={LuCalendarRange}
        title="Next Week"
        onSelect={() => onSelect(getComingMondayDate())}
        info={getDayFromDate(getComingMondayDate())}
        setShow={setShow}
      />
      <div className="h-[1px] bg-light-black m-[5px]" />
      <DueDateOptionProps
        Icon={IoCalendarClearOutline}
        title="Pick a Date"
        onSelect={() => undefined}
        autoClose={false}
        setShow={setShow}
        action={
          <div className="flex gap-1 items-center justify-end px-3 py-1">
            <button className="bg-dark-black rounded-md px-2" onClick={() => setShow(false)}>
              cancel
            </button>
            <button
              className="rounded-md bg-blue-500 px-2"
              onClick={() => {
                setShow(false)

                onSelect(date)
              }}
            >
              save
            </button>
          </div>
        }
      >
        <input
          type="date"
          placeholder="Pick a Date"
          className="bg-dark-black hover:bg-light-black"
          value={date}
          onChange={e => {
            setDate(e.target.value)
          }}
        />
      </DueDateOptionProps>
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

function DueDateOptionProps(props: DueDateOptionProps) {
  const {title, Icon, children, onSelect, autoClose = true, action, info, setShow} = props

  return (
    <>
      <button
        onClick={() => {
          onSelect()
          autoClose && setShow(false)
        }}
        className="text-sm w-full py-1 flex items-center gap-3 hover:bg-light-black px-3"
      >
        <Icon />
        <p className="">{title}</p>
        {children ? children : info ? <span className="inline-block ml-auto">{info}</span> : null}
      </button>
      {action}
    </>
  )
}
