import * as React from "react"
import {Link} from "@tanstack/react-router"
import {IoArrowBackSharp} from "react-icons/io5"

interface StandAlonePageProps {
  title: string
  header?: React.ReactNode
  goBackTo?: string
  children: React.ReactNode
}

function HeaderWrapper({children}: {children: React.ReactNode}) {
  return (
    <div className="z-10 border-border border-b px-6 py-3 bg-background sticky top-0 left-0 right-0 flex items-center gap-3">
      {children}
    </div>
  )
}

function StandAlonePage(props: StandAlonePageProps) {
  const {title, children, goBackTo, header} = props

  return (
    <div className="pb-3">
      {header ? (
        header
      ) : (
        <HeaderWrapper>
          <Link to={goBackTo}>
            <IoArrowBackSharp />
          </Link>
          <h3 className="ml-3 font-bold text-xl">{title}</h3>
        </HeaderWrapper>
      )}
      <div className="p-3">{children}</div>
    </div>
  )
}

StandAlonePage.HeaderWrapper = HeaderWrapper

StandAlonePage.GoBack = function GoBack({goBackTo}: {goBackTo: string}) {
  return (
    <Link to={goBackTo}>
      <IoArrowBackSharp />
    </Link>
  )
}

export default StandAlonePage
