import * as Matcher from "./denops/@ddc-filters/matcher_fuzzy.ts"
import * as Sorter from "./denops/@ddc-filters/sorter_fuzzy.ts"
import {assertEquals} from "https://lib.deno.dev/std@0.106.0/testing/asserts.ts"

const matcher = new Matcher.Filter()
const sorter = new Sorter.Filter()

Deno.test("matcher", async () => {
  assertEquals(
    await matcher.filter({completeStr: "abc", candidates: [{word: '0a0b0c0'}, {word: 'abc'}, {word: 'xyz'}]}),
    [{word:'0a0b0c0'}, {word: 'abc'}]
  )
})

Deno.test("sorter", async () => {
  assertEquals(
    await sorter.filter({completeStr: "abc", candidates:[{word: '0a0b0c0'}, {word: 'abc'}]}),
    [{word: 'abc'}, {word: '0a0b0c0'}]
  )
})
