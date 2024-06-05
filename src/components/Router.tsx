import React, {useEffect, useState} from "react"

type RouteComponent = () => JSX.Element

interface Route {
  path: string
  component: RouteComponent
}

const Router: React.FC<{routes: Route[]}> = ({routes}) => {
  const [currentRoute, setCurrentRoute] = useState<Route | null>(null)

  useEffect(() => {
    const handleRouteChange = () => {
      const currentPath = window.location.pathname
      const route = routes.find(r => r.path === currentPath)

      if (route) {
        setCurrentRoute(route)
      } else {
        setCurrentRoute(null)
      }
    }

    handleRouteChange()

    window.addEventListener("popstate", handleRouteChange)

    return () => {
      window.removeEventListener("popstate", handleRouteChange)
    }
  }, [routes])

  return currentRoute ? currentRoute.component() : <div>Not Found</div>
}

export default Router
