import clsx from "clsx"
import {useAuth} from "~/auth-context"
import {usePing} from "~/utils/hooks"
import {MobileOnly} from ".."
import {Link} from "@tanstack/react-router"
import {PiHamburger} from "react-icons/pi"

export default function ErrorMessage() {
  const online = usePing()
  const {logout} = useAuth()

  return (
    <div className="relative flex items-center justify-center flex-col p-3 h-screen w-full">
      <MobileOnly>
        <Link to="/mobile-nav" className="top-3 absolute right-3">
          <PiHamburger size={20} />
        </Link>
      </MobileOnly>
      {online !== null && (
        <p
          className={clsx("mb-5 px-4 py-1 border border-border rounded-full", {
            "text-green-400 border-green-400": online,
            "text-red-400 border-red-400": !online,
          })}
        >
          {online ? "Online" : "Server is offline"}
        </p>
      )}
      <h2 className="font-bold text-4xl mb-4">Well, this is awkward</h2>
      <div className="text-zinc-400">
        <p className="mb-2">Looks like MKTodo has crashed unexpectedly...</p>
        <p>We've tracked the error and will get right on it.</p>
      </div>
      <div className="flex items-center gap-3">
        <button
          className="border border-red-300 text-red-300 rounded-md px-3 py-1 mt-8"
          onClick={logout}
        >
          Logout
        </button>
        <button
          className="border border-zinc-600 rounded-md px-3 py-1 mt-8"
          onClick={() => window.location.reload()}
        >
          Reload
        </button>
      </div>
    </div>
  )
}
