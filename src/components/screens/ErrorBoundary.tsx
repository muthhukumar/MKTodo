import * as React from "react"
import ErrorMessage from "./ErrorMessage"
import toast from "react-hot-toast"

interface ErrorBoundaryProps {
  children: React.ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {hasError: false}
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI.
    toast.error(`Something unexpected happened: ${error.message}`)

    return {hasError: true}
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // You can also log the error to an error reporting service
    console.error("ErrorBoundary caught an error", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return <ErrorMessage />
    }

    return this.props.children
  }
}

export default ErrorBoundary
