export default function Syncing() {
  return (
    <span
      id="syncing"
      className="bg-black w-fit mx-auto rounded-full px-2 syncing text-zinc-200 fixed top-1 left-1/2 transform -translate-x-1/2 z-40 text-center text-xs"
    >
      Syncing
      <span className="text-zinc-200 ml-1" id="tasksCount"></span>
    </span>
  )
}
