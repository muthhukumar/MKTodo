import * as React from "react"
import {IoArrowBackSharp} from "react-icons/io5"
import {useGoBack} from "~/utils/navigation"

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
  const goBack = useGoBack()

  return (
    <div className="pb-3">
      {header ? (
        header
      ) : (
        <HeaderWrapper>
          <button className="p-3 rounded-full" onClick={goBack}>
            <IoArrowBackSharp size={20} />
          </button>
          <h3 className="ml-3 font-bold text-xl">{title}</h3>
        </HeaderWrapper>
      )}
      <div className="p-3">{children}</div>
    </div>
  )
}

StandAlonePage.HeaderWrapper = HeaderWrapper

StandAlonePage.GoBack = function GoBack() {
  const goBack = useGoBack()

  return (
    <button onClick={goBack} className="p-3">
      <IoArrowBackSharp />
    </button>
  )
}

export default StandAlonePage
