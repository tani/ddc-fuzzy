import type { Denops } from "jsr:@denops/std@7.2.0";
import type {
  Item,
  PumHighlight,
} from "jsr:@shougo/ddc-vim@7.0.0/types";
import {
  BaseFilter,
  FilterArguments,
  OnInitArguments,
} from "jsr:@shougo/ddc-vim@7.0.0/filter";
import * as fuzzy from "../../fuzzy.ts";

type Params = { hlGroup: string };

export class Filter extends BaseFilter<Params> {
  override async onInit(args: OnInitArguments<Params>): Promise<void> {
    await args.denops.cmd(`highlight link FuzzyAccent Number`);
  }
  override async filter(args: FilterArguments<Params>): Promise<Item[]> {
    const normalize = (s: string) =>
      args.sourceOptions.ignoreCase ? s.toLowerCase() : s;
    const completeStr = normalize(args.completeStr);
    const item_slices = args.items.map((item) => {
      // concatate abbr and word, because abbr may not contain pattern.
      const text_for_match = (item.abbr ?? "") + item.word;
      const text = item.abbr ?? item.word;
      const pos = fuzzy.match(completeStr, normalize(text_for_match));
      const slices = pos
        .filter((col) => col < text.length)
        .map((col, idx) => text.slice(pos[idx - 1] ?? 0, col));
      return [item, slices] as const;
    });
    const slice_bytes = await _internals.bulk_strlen(
      args.denops,
      item_slices.map(([_, slices]) => slices).flat(),
    );
    let slice_index = 0;
    return item_slices.map(([item, slices]): Item => {
      if (slices.length === 0) {
        return item;
      }
      let col = 1;
      const highlights = slices.map((): PumHighlight => {
        col += slice_bytes[slice_index++];
        return {
          col,
          type: "abbr",
          name: "ddc_fuzzy_matched_character",
          hl_group: args.filterParams.hlGroup,
          width: 1,
        };
      });
      return {
        ...item,
        highlights: [
          ...(item.highlights ?? []).filter((hl) =>
            hl.name !== "ddc_fuzzy_matched_character"
          ),
          ...highlights,
        ],
      };
    });
  }
  override params(): Params {
    return {
      hlGroup: "FuzzyAccent",
    };
  }
}

function bulk_strlen(denops: Denops, slist: string[]): Promise<number[]> {
  return denops.eval(
    "map(l:slist, {_, s -> strlen(s)})",
    { slist },
  ) as Promise<number[]>;
}

export const _internals = { bulk_strlen };
