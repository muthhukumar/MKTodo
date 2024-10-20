import {describe, it, expect} from "vitest"
import {isWithInRange} from "./ui"

describe("isWithInRange", () => {
  it("in range", () => {
    expect(
      isWithInRange({
        range: {start: 200, end: 800},
        curr: {start: 250, end: 750},
      }),
    ).toBeTruthy()
  })

  it("out of bounds", () => {
    expect(
      isWithInRange({
        range: {start: 200, end: 800},
        curr: {start: 150, end: 750},
      }),
    ).toBeFalsy()
  })

  it("in range", () => {
    expect(
      isWithInRange({
        range: {start: 200, end: 800},
        curr: {start: 200, end: 800},
      }),
    ).toBeTruthy()
  })

  it("out of bounds", () => {
    expect(
      isWithInRange({
        range: {start: 200, end: 800},
        curr: {start: 250, end: 801},
      }),
    ).toBeFalsy()
  })
})
