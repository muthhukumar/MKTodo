import clsx from "clsx"
import {usePing} from "~/utils/hooks"

export default function ErrorMessage() {
  const online = usePing()

  return (
    <div className="flex items-center justify-center flex-col p-3 h-screen w-full">
      {online !== null && (
        <p
          className={clsx("mb-5 px-4 py-1 border border-light-black rounded-full", {
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
      <button
        className="border border-zinc-600 rounded-md px-3 py-1 mt-8"
        onClick={() => window.location.reload()}
      >
        Reload
      </button>
    </div>
  )
}
