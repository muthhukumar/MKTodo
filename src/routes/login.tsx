import * as React from "react"
import {createFileRoute, redirect, useNavigate} from "@tanstack/react-router"
import {useAuth} from "~/auth-context"
import {z} from "zod"
import {ErrorMessage} from "~/components/screens"
import toast from "react-hot-toast"
import {Loader} from "~/components"
import axios from "axios"
import {removeTrailingSlash} from "~/utils/url"
import {handleError} from "~/utils/error"
import Logo from "../assets/logo.png"

export const Route = createFileRoute("/login")({
  validateSearch: z.object({
    redirect: z.string().optional().catch(""),
  }),
  beforeLoad: ({context, search}) => {
    if (context.auth.isAuthenticated) {
      throw redirect({to: search.redirect || "/"})
    }
  },
  component: LoginForm,
  errorComponent: ErrorMessage,
})

function LoginForm() {
  const hostRef = React.useRef<HTMLInputElement>(null)
  const apiKeyRef = React.useRef<HTMLInputElement>(null)
  const [loading, setLoading] = React.useState(false)

  const navigate = useNavigate()
  const {login} = useAuth()

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()

    const host = removeTrailingSlash(hostRef.current?.value ?? "")
    const apiKey = apiKeyRef.current?.value

    if (!host || !apiKey) return

    setLoading(true)

    try {
      await axios.get(`${host}/api/v1/tasks`, {headers: {"x-api-key": apiKey}, timeout: 30000})

      toast.success("Login successful")

      login({host, apiKey})

      setTimeout(() => {
        navigate({to: "/tasks/all", search: {query: "", random: false}})
      }, 1500)
    } catch (error) {
      handleError({error, defaultMessage: "Login failed!"})
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-screen w-full flex items-center justify-center px-3">
      <form className="mb-3 w-full max-w-sm mx-auto rounded-md px-3 py-2" onSubmit={onSubmit}>
        <img src={Logo} />
        <div className="mt-5">
          <h3>Connect to Server</h3>
          <input
            ref={hostRef}
            className="mt-2 border rounded-md border-border px-3 py-2 w-full"
            placeholder="Host"
            name="host"
          />
        </div>
        <div className="mt-3">
          <h3>API Key</h3>
          <input
            ref={apiKeyRef}
            className="mt-2 border-border border rounded-md px-3 py-2 w-full"
            placeholder="API key"
          />
        </div>
        <button className="flex items-center justify-center border-border mt-8 px-3 py-2 w-full border rounded-md">
          {!loading ? (
            <span>Connect</span>
          ) : (
            <span className="py-1">
              <Loader loaderClass="dark-loader" />
            </span>
          )}
        </button>
      </form>
    </div>
  )
}
