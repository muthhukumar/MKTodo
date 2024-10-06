import {API} from "~/service"
import {Batcher} from "./batcher"

enum LogLevel {
  DEBUG = "DEBUG",
  INFO = "INFO",
  WARN = "WARN",
  ERROR = "ERROR",
}

class Logger {
  private level: LogLevel
  private batcher: Batcher<{level: string; log: string}> = new Batcher({
    size: 50,
    onFull: (logs: Array<{level: string; log: string}>) => API.log(logs),
  })

  constructor(level: LogLevel = LogLevel.INFO) {
    this.level = level
  }

  private log(level: LogLevel, message: string, ...args: any[]): void {
    const timestamp = new Date().toISOString()

    console.log(`[${timestamp}] [${level || this.level}] ${message} `, ...args)

    this.batcher.add({
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

const logger = new Logger(LogLevel.INFO)

export {logger, LogLevel}
