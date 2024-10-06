import {API} from "~/service"
import {logQueue} from "./log-queue"

enum LogLevel {
  DEBUG = "DEBUG",
  INFO = "INFO",
  WARN = "WARN",
  ERROR = "ERROR",
}

class Logger {
  private level: LogLevel
  private logs: Array<{level: string; log: string}> = []

  constructor(level: LogLevel = LogLevel.INFO) {
    this.level = level
  }

  private log(level: LogLevel, message: string, ...args: any[]): void {
    const timestamp = new Date().toISOString()

    console.log(`[${timestamp}] [${level || this.level}] ${message} `, ...args)

    this.logs.push({
      level,
      log: `${message}. ${args
        .map(d => {
          try {
            return JSON.stringify(d)
          } catch {
            return "Parsing faild"
          }
        })
        .join(", ")}`,
    })

    if (this.logs.length > 100) {
      const logs = this.logs

      logQueue.enqueue(() =>
        // @ts-ignore
        API.log(logs),
      )

      this.logs = []
    }
  }

  debug(message: string, ...args: any[]): void {
    this.log(LogLevel.DEBUG, message, ...args)
  }

  info(message: string, ...args: any[]): void {
    this.log(LogLevel.INFO, message, ...args)
  }

  warn(message: string, ...args: any[]): void {
    this.log(LogLevel.WARN, message, ...args)
  }

  error(message: string, ...args: any[]): void {
    this.log(LogLevel.ERROR, message, ...args)
  }

  setLevel(level: LogLevel): void {
    this.level = level
  }
}

const logger = new Logger()

export {logger, LogLevel}
