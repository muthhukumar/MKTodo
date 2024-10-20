export default function Notifier({elementId}: {elementId: string}) {
  return (
    <span
      id={elementId}
      className={`bg-black w-fit mx-auto rounded-full px-2 ${elementId} text-zinc-200 fixed top-1 left-1/2 transform -translate-x-1/2 z-[1000] text-center text-xs`}
    ></span>
  )
}
