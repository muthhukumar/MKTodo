import {Link, createFileRoute} from "@tanstack/react-router"
import clsx from "clsx"
import {useAuth} from "~/auth-context"
import {Divider, FeatureFlag, Logout, StandAlonePage, Version} from "~/components"
import {Feature, allFeaturesByCategory, useFeature, useFeatureValue} from "~/feature-context"
import {usePing} from "~/utils/hooks"

export const Route = createFileRoute("/_standalone/settings")({
  component: Settings,
})

function Settings() {
  const auth = useAuth()
  const online = usePing()

  const {features, toggleFeature, setFeature} = useFeature()
  const fontFeature = useFeatureValue("Font")

  function changeFont(value: string) {
    document.documentElement.style.setProperty("--primary-font", value)
    setFeature({featureId: "Font", value})
  }

  return (
    <StandAlonePage title="Settings">
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
        <strong>Appearance</strong>
        <FeatureFlag feature="Font">
          <FeatureFlag.Feature>
            <div className="flex flex-col mt-3">
              <label>Change Font</label>
              <div>
                <select
                  className="mt-1"
                  value={fontFeature?.value ?? "Inter"}
                  onChange={e => changeFont(e.target.value)}
                  style={{
                    // @ts-ignore
                    "--primary-font": fontFeature?.value || "Inter",
                  }}
                >
                  <option value="Inter">Open Sans</option>
                  <option value="OpenSans">Inter</option>
                </select>
              </div>
            </div>
          </FeatureFlag.Feature>
        </FeatureFlag>
      </div>
      <Divider />
      <div>
        {allFeaturesByCategory.map(f => {
          return (
            <div key={f.category}>
              <strong className="text-xl">{f.category}</strong>
              <div className="mt-3 flex-col flex">
                {f.features.map(sf => {
                  return (
                    <div key={sf.id} className="py-1 flex items-center justify-between">
                      <label htmlFor={sf.id}>{sf.title}</label>
                      <input
                        type="checkbox"
                        id={sf.id}
                        checked={features.find(f => f.id === sf.id)?.enable || false}
                        onChange={() => toggleFeature(sf.id as Feature)}
                      />
                    </div>
                  )
                })}
              </div>
              <Divider />
            </div>
          )
        })}
      </div>
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

      <div>
        <strong>App Info</strong>
        <div className="mt-3">
          <p>App Build Version</p>
          <Version />
        </div>
      </div>
      <Divider />
      <Logout />
      <Divider />
      <div className="min-h-[20vh]" />
    </StandAlonePage>
  )
}
