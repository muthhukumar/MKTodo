import {Link, createFileRoute} from "@tanstack/react-router"
import clsx from "clsx"
import {useAuth} from "~/auth-context"
import {Divider, Logout, StandAlonePage} from "~/components"
import {useFeature} from "~/feature-context"
import {usePing} from "~/utils/hooks"

export const Route = createFileRoute("/_standalone/settings")({
  component: Settings,
})

function Settings() {
  const auth = useAuth()
  const online = usePing()

  const {features, toggleFeature} = useFeature()

  return (
    <StandAlonePage title="Settings" goBackTo="/tasks/all">
      <div className="py-3">
        <div className="flex items-center justify-between">
          <strong>Server</strong>
          {online && (
            <p
              className={clsx("px-4 py-1 border border-border rounded-full", {
                "text-green-400 border-green-400": online.server,
                "text-red-400 border-red-400": !online.server,
              })}
            >
              {online.server ? "Online" : "Offline"}
            </p>
          )}
        </div>
        <div className="mt-3 flex-col flex gap-2">
          <div>
            <p>Host</p>
            <p>{auth.creds?.host}</p>
          </div>
          <div>
            <p>API Key</p>
            <p>{auth.creds?.apiKey}</p>
          </div>
        </div>
      </div>
      <Divider />
      <div>
        <strong>General</strong>
        <div className="mt-3 flex-col flex">
          {features.map(sf => {
            return (
              <div key={sf.id} className="py-1 flex items-center justify-between">
                <label htmlFor={sf.id}>{sf.title}</label>
                <input
                  type="checkbox"
                  id={sf.id}
                  checked={sf.enable}
                  onChange={() => toggleFeature(sf.id)}
                />
              </div>
            )
          })}
        </div>
      </div>
      <Divider />
      <Link
        to="/logs"
        search={{
          from: "/settings",
        }}
        className="px-3 py-1 bg-yellow-600 inline-block rounded-md"
      >
        Show Logs
      </Link>

      <Divider />

      <Logout />
      <Divider />
    </StandAlonePage>
  )
}