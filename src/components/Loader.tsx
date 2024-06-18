import clsx from "clsx"

export default function Loader({loaderClass}: {loaderClass?: string}) {
  return (
    <div
      className={clsx("loader", {
        "dark-loader": loaderClass,
      })}
    ></div>
  )
}
