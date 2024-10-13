import {useVersion} from "~/utils/hooks"

export default function Version() {
  const version = useVersion()

  return <p>V{version}</p>
}
