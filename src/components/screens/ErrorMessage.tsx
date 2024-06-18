export default function ErrorMessage() {
  return (
    <div className="flex items-center justify-center flex-col p-3 h-screen w-full">
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
