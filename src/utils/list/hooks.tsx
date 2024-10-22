import * as React from "react"
import {API} from "~/service"
import {handleError} from "../error"
import {List} from "~/@types"
import {invariant} from "../invariants"

const ListContext = React.createContext<{lists: Array<List>; invalidate: () => void}>({
  lists: [] as Array<List>,
  invalidate: () => undefined,
})

export function ListContextProvider({children}: {children: React.ReactNode}) {
  const [lists, setLists] = React.useState<Array<List>>([])

  async function getLists() {
    try {
      setLists(await API.getLists())
    } catch (error) {
      handleError({error, defaultMessage: "Failed to get lists"})
    }
  }

  React.useEffect(() => {
    getLists()
  }, [])

  return (
    <ListContext.Provider value={{lists, invalidate: getLists}}>{children}</ListContext.Provider>
  )
}

export function useLists() {
  const context = React.useContext(ListContext)

  if (!context) {
    invariant(false, "useLists cannot be used outside of ListContextProvider")
  }

  return context
}
