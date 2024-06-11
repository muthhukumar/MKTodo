import * as React from "react"
import {createFileRoute, redirect} from "@tanstack/react-router"
import {useAuth} from "~/auth-context"
import {z} from "zod"

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
})

function LoginForm() {
  const hostRef = React.useRef<HTMLInputElement>(null)
  const apiKeyRef = React.useRef<HTMLInputElement>(null)

  const {login} = useAuth()

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const host = hostRef.current?.value
    const apiKey = apiKeyRef.current?.value

    if (!host || !apiKey) return

    try {
      login({host, apiKey})
    } catch (err) {
      console.log("faild to save details", err)
    }
  }

  return (
    <div className="h-screen w-full flex items-center justify-center px-3">
      <form className="w-full max-w-sm mx-auto rounded-md px-3 py-2" onSubmit={onSubmit}>
        <h2 className="mt-3 font-bold text-5xl text-center">mktodo</h2>
        <div className="mt-5">
          <h3>Connect to Server</h3>
          <input
            ref={hostRef}
            className="mt-2 border rounded-md border-light-black px-3 py-2 w-full"
            placeholder="Host"
            name="host"
          />
        </div>
        <div className="mt-3">
          <h3>API Key</h3>
          <input
            ref={apiKeyRef}
            className="mt-2 border-light-black border rounded-md px-3 py-2 w-full"
            placeholder="API key"
          />
        </div>
        <button className="border-light-black mt-8 px-3 py-2 w-full border rounded-md">
          Connect
        </button>
      </form>
    </div>
  )
}
