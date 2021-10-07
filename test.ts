import * as Matcher from "./denops/@ddc-filters/matcher_fuzzy.ts"
import * as Sorter from "./denops/@ddc-filters/sorter_fuzzy.ts"
import * as Converter from "./denops/@ddc-filters/converter_fuzzy.ts"
import {assertEquals} from "https://lib.deno.dev/std@0.106.0/testing/asserts.ts"

const matcher = new Matcher.Filter()
const sorter = new Sorter.Filter()
const converter = new Converter.Filter()

Deno.test("converter", async () => {
  assertEquals(
    await converter.filter({completeStr: "abc", candidates: [{word: '0a0b0c0'}, {word: 'abc'}, {word: 'xyz'}]}),
    [{word:'0a0b0c0', abbr: '0(a)0(b)0(c)0'}, {word: 'abc', abbr: '(abc)'}, {word: 'xyz', abbr: 'xyz'}]
  )
})

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
