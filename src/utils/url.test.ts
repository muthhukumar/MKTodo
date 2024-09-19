import {describe, it, expect} from "vitest"
import {getDomain} from "./url"

describe("getDomain", () => {
  it("should return domain of a valid url, https://www.muthukumar.dev/apps", () => {
    expect(getDomain("https://www.muthukumar.dev/apps")).toBe("https://www.muthukumar.dev")
  })
  it("should return the same value if the url is invalid, muthukumar.dev/apps", () => {
    expect(getDomain("muthukumar.dev/apps")).toBe("muthukumar.dev/apps")
  })
})
