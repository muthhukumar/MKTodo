import * as React from "react"
import {GoBack} from "."

interface StandAlonePageProps {
  title: string
  header?: React.ReactNode
  children: React.ReactNode
}

function HeaderWrapper({children}: {children: React.ReactNode}) {
  return (
    <div className="z-10 border-border border-b p-3 bg-background sticky top-0 left-0 right-0 flex items-center gap-3">
      {children}
    </div>
  )
}

function StandAlonePage(props: StandAlonePageProps) {
  const {title, children, header} = props

  return (
    <div className="pb-3">
      {header ? (
        header
      ) : (
        <HeaderWrapper>
          <GoBack />
          <h3 className="ml-1 font-bold text-xl">{title}</h3>
        </HeaderWrapper>
      )}
      <div className="p-3">{children}</div>
    </div>
  )
}

StandAlonePage.HeaderWrapper = HeaderWrapper

export default StandAlonePage
