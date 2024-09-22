import {describe, expect, it} from "vitest"
import {extractTags} from "."

describe("extractTags", () => {
  it("should return empty array if the passed string is empty", () => {
    expect(extractTags("")).toStrictEqual({
      modifiedStr: "",
      tags: [],
    })
  })

  it("should return p1 if the string passed is !p1", () => {
    expect(extractTags("!p1")).toStrictEqual({
      modifiedStr: "",
      tags: ["p1"],
    })
  })

  it("should return p1, p2, feature, bug if the string passed is `!p1 !p2, !feature, !bug`", () => {
    expect(extractTags("This is a !p1 and !p2 is of !feature and has !bug")).toStrictEqual({
      modifiedStr: "This is a  and  is of  and has ",
      tags: ["p1", "p2", "feature", "bug"],
    })
  })

  it("should return the same str if the string passed does not have any tag", () => {
    expect(extractTags("This is just a normal string")).toStrictEqual({
      modifiedStr: "This is just a normal string",
      tags: [],
    })
  })
})
