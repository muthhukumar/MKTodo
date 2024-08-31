// TODO: refactor this later
import * as React from "react"
import ErrorMessage from "./ErrorMessage"
import toast from "react-hot-toast"

interface ErrorBoundaryProps {
  children: React.ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {hasError: false, error: null}
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI.
    toast.error(`Something unexpected happened: ${error.message}`)

    return {hasError: true, error}
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // You can also log the error to an error reporting service
    this.setState({error})

    toast.error(`Something unexpected happened: ${error.message}. ${JSON.stringify(errorInfo)}`)
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorMessage
          error={this.state.error || new Error("Something went wrong")}
          reset={() => null}
        />
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
