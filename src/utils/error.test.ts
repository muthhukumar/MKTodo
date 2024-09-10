import {describe, it, expect} from "vitest"
import {getErrorMessage} from "./error"

const defaultMessage = "This is a default message"

describe("handleError", () => {
  it("if error is null or undefined it should show default message", () => {
    expect(
      getErrorMessage({
        error: null,
        defaultMessage,
      }),
    ).toBe(defaultMessage)
  })
  it("for 500 status code it should return internal server error + message ", () => {
    const message = "This is a message"

    expect(
      getErrorMessage({
        error: {message, status: 500},
        defaultMessage,
      }),
    ).toBe(`Internal server error: ${message}`)
  })
  it("return invalid fields error message", () => {
    const message = "invalid form"

    expect(
      getErrorMessage({
        error: {
          message,
          status: 400,
          code: "validation_failed",
          invalid_fields: [{error_message: "name is invalid", field: "name", is_invalid: true}],
        },
        defaultMessage,
      }),
    ).toBe("name is invalid")
  })
  it("error_message error code", () => {
    const message = "This is the error message"

    expect(
      getErrorMessage({
        error: {
          message,
          status: 400,
          code: "error_message",
        },
        defaultMessage,
      }),
    ).toBe(message)
  })
})
