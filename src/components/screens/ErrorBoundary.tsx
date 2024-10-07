// TODO: refactor this later
import * as React from "react"
import ErrorMessage from "./ErrorMessage"
import {logger} from "~/utils/logger"

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
    logger.error(`Error Boundary: ${error.message}. ${JSON.stringify(error)}`)

    return {hasError: true, error}
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    this.setState({error})

    logger.error(`ErrorBoundary: ${error.message}. ${JSON.stringify({errorInfo, error})}`)
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
