import {createFileRoute} from "@tanstack/react-router"
import {useAuth} from "~/auth-context"
import {useFeature} from "~/feature-context"

export const Route = createFileRoute("/_auth/settings")({
  component: Settings,
})

function Settings() {
  const auth = useAuth()
  const {features, toggleFeature} = useFeature()

  return (
    <div className="p-6">
      <h2 className="font-bold mb-3 text-xl">Settings</h2>
      <div className="py-3 border-y border-border">
        <strong>Server</strong>
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
      <div className="mt-3 pb-3 border-b border-border">
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
    </div>
  )
}
