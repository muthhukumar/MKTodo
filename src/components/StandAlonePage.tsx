import * as React from "react"
import {Link} from "@tanstack/react-router"
import {IoArrowBackSharp} from "react-icons/io5"

interface StandAlonePageProps {
  title: string
  header?: React.ReactNode
  goBackTo?: string
  children: React.ReactNode
}

function StandAlonePage(props: StandAlonePageProps) {
  const {title, children, goBackTo, header} = props

  return (
    <div className="pb-3">
      {header ? (
        header
      ) : (
        <div className="border-border border-b p-5 bg-background sticky top-0 left-0 right-0 flex items-center gap-3">
          <Link to={goBackTo}>
            <IoArrowBackSharp />
          </Link>
          <h3 className="ml-3 font-bold text-xl">{title}</h3>
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  )
}

StandAlonePage.GoBack = function GoBack({goBackTo}: {goBackTo: string}) {
  return (
    <Link to={goBackTo}>
      <IoArrowBackSharp />
    </Link>
  )
}

export default StandAlonePage
