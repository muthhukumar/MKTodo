import clsx from "clsx"
import {twMerge} from "tailwind-merge"

interface DividerProps {
  space?: "none" | "full"
  className?: string
}

export default function Divider({space = "full", className}: DividerProps) {
  return (
    <div
      className={twMerge(
        clsx("w-full h-[1px] bg-border", {
          "my-0": space === "none",
          "my-6": space === "full",
        }),
        className,
      )}
    />
  )
}
