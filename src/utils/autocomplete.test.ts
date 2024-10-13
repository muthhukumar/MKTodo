import {expect, it, describe} from "vitest"
import {autocomplete, buildHash, getLastWord} from "./autocomplete"

describe("build hash", () => {
  it("should return empty hash if the string is empty", () => {
    expect(buildHash([""])).toStrictEqual({})
  })
  it("should return expected hash", () => {
    expect(buildHash(["give dress for laundry"])).toStrictEqual({
      give: ["dress"],
      dress: ["for"],
      for: ["laundry"],
      laundry: [],
    })
  })
  it("key's value shouldn't contain empty string", () => {
    expect(buildHash(["this  is "])).toStrictEqual({
      this: ["is"],
      is: [],
    })
  })
})

describe("autocomplete", () => {
  it("should return no suggestion if there is no word typed", () => {
    expect(
      autocomplete(
        buildHash([
          "give dress for laundary",
          "give book to library",
          "give flowers for birthday",
          "give money for charity",
        ]),
        "",
      ),
    ).toStrictEqual([])
  })

  it("should return suggestion if there is a word", () => {
    expect(
      autocomplete(
        buildHash([
          "give dress for laundary",
          "give book to library",
          "give flowers for birthday",
          "give money for charity",
        ]),
        "give",
      ),
    ).toStrictEqual(["dress", "book", "flowers"])
  })

  it("should return no return if the word doesn't contain any following words", () => {
    expect(
      autocomplete(
        buildHash([
          "give dress for laundary",
          "give book to library",
          "give flowers for birthday",
          "give money for charity",
        ]),
        "laundary",
      ),
    ).toStrictEqual([])
  })
})

describe("getLastWord", () => {
  it("should return the last word of the sentence", () => {
    expect(getLastWord("give dress for laundary")).toBe("laundary")
  })
  it("should return empty string if the sentence is empty", () => {
    expect(getLastWord("")).toBe("")
  })
  it("should return first word if sentence only contains one word", () => {
    expect(getLastWord("give")).toBe("give")
  })
  it("should return last non empty word", () => {
    expect(getLastWord("give ")).toBe("give")
  })
  it("should return last non empty word", () => {
    expect(getLastWord(" give ")).toBe("give")
  })
})
