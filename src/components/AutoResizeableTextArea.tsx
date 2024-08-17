import * as React from "react"

interface AutoResizeTextareaProps extends React.ComponentProps<"textarea"> {}

const AutoResizeTextarea = React.forwardRef<HTMLTextAreaElement, AutoResizeTextareaProps>(
  (props, ref) => {
    const textareaRef = React.useRef<HTMLTextAreaElement | null>(null)

    function combineRef(node: HTMLTextAreaElement) {
      if (ref) {
        if (typeof ref === "function") {
          ref(node)
        } else {
          ;(ref as React.MutableRefObject<HTMLTextAreaElement | null>).current = node
        }
      }

      textareaRef.current = node
    }

    function updateHeight() {
      const textarea = textareaRef.current
      if (textarea) {
        textarea.style.height = "auto"
        textarea.style.height = `${textarea.scrollHeight}px`
      }
    }

    React.useEffect(() => {
      updateHeight()
    }, [props.value, props.defaultValue])

    return (
      <textarea
        {...props}
        ref={combineRef}
        style={{
          overflow: "hidden",
          resize: "none",
        }}
      />
    )
  },
)

export default AutoResizeTextarea
