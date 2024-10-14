import {expect, it, describe} from "vitest"
import {autocomplete, buildHash, getLastWord} from "./autocomplete"

describe("build hash", () => {
  it("should return empty hash if the string is empty", () => {
    expect(buildHash([""])).toStrictEqual({})
  })

  it("should return expected hash", () => {
    expect(buildHash(["give dress for laundry"])).toStrictEqual({
      give: [{word: "dress", frequency: 1}],
      dress: [{word: "for", frequency: 1}],
      for: [{frequency: 1, word: "laundry"}],
      laundry: [],
    })
  })

  it("key's value shouldn't contain empty string", () => {
    expect(buildHash(["this  is "])).toStrictEqual({
      this: [{word: "is", frequency: 1}],
      is: [],
    })
  })

  it("should increase the frequency if the same words are grouped together often", () => {
    expect(buildHash(["give dress for laundry", "give dress to mathi"])).toStrictEqual({
      give: [{word: "dress", frequency: 2}],
      dress: [
        {word: "for", frequency: 1},
        {word: "to", frequency: 1},
      ],
      for: [{word: "laundry", frequency: 1}],
      laundry: [],
      to: [{word: "mathi", frequency: 1}],
      mathi: [],
    })
  })
})

describe("autocomplete", () => {
  it("should return no suggestion if there is no word typed", () => {
    expect(
      autocomplete(
        buildHash(["give dress for laundry", "give dress to mathi", "give bottom to manoj"], {}),
        "give",
      ),
    ).toStrictEqual([
      {frequency: 2, word: "dress"},
      {frequency: 1, word: "bottom"},
    ])
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
    ).toStrictEqual([
      {frequency: 1, word: "dress"},
      {frequency: 1, word: "book"},
      {frequency: 1, word: "flowers"},
      {frequency: 1, word: "money"},
    ])
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
