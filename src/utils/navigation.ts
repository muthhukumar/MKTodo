import {useRouter} from "@tanstack/react-router"

export function useGoBack() {
  const {history} = useRouter()

  return () => history.go(-1)
}
