import * as Matcher from "./denops/@ddc-filters/matcher_fuzzy.ts";
import * as Sorter from "./denops/@ddc-filters/sorter_fuzzy.ts";
import * as Converter from "./denops/@ddc-filters/converter_fuzzy.ts";
import { assertEquals } from "https://lib.deno.dev/std@0.106.0/testing/asserts.ts";

const matcher = new Matcher.Filter();
const sorter = new Sorter.Filter();
const converter = new Converter.Filter();

Deno.test("matcher", async () => {
  assertEquals(
    await matcher.filter({
      sourceOptions: { ignoreCase: false },
      completeStr: "abc",
      candidates: [{ word: "0a0b0c0" }, { word: "axbc" }, { word: "abc" }, {
        word: "xyz",
      }],
      filterParams: { splitMode: "character" },
    } as any),
    [{ word: "0a0b0c0" }, { word: "axbc" }, { word: "abc" }],
  );
  assertEquals(
    await matcher.filter({
      sourceOptions: { ignoreCase: false },
      completeStr: "aBc",
      candidates: [{ word: "0a0B0c0" }, { word: "axBc" }, { word: "aBxc" }, {
        word: "aBc",
      }, { word: "xyz" }],
      filterParams: { splitMode: "word" },
    } as any),
    [{ word: "0a0B0c0" }, { word: "axBc" }, { word: "aBc" }],
  );
});

Deno.test("sorter", async () => {
  assertEquals(
    await sorter.filter({
      sourceOptions: { ignoreCase: false },
      completeStr: "abc",
      candidates: [{ word: "0a0b0c0" }, { word: "abc" }],
    } as any),
    [{ word: "abc" }, { word: "0a0b0c0" }],
  );
});

function highlight(col: number) {
  return {
    type: "abbr",
    name: "ddc_fuzzy_matched_character",
    col,
    width: 1,
    "hl_group": "SpellBad",
  };
}

Deno.test("converter", async () => {
  assertEquals(
    await converter.filter({
      sourceOptions: { ignoreCase: false },
      completeStr: "abc",
      candidates: [{ word: "0a0b0c0" }, { word: "abc" }, { word: "xyz" }],
    } as any),
    [
      {
        word: "0a0b0c0",
        highlights: [highlight(1), highlight(3), highlight(5)],
      },
      { word: "abc", highlights: [highlight(0), highlight(1), highlight(2)] },
      { word: "xyz", highlights: [] },
    ],
  );
});
