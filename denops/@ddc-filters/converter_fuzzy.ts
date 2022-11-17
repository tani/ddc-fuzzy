import type { Denops } from "https://lib.deno.dev/x/ddc_vim@v3/deps.ts";
import type {
  Item,
  PumHighlight,
} from "https://lib.deno.dev/x/ddc_vim@v3/types.ts";
import {
  BaseFilter,
  FilterArguments,
  OnInitArguments,
} from "https://lib.deno.dev/x/ddc_vim@v3/base/filter.ts";
import * as fuzzy from "../../fuzzy.ts";

type Params = { hlGroup: string };

export class Filter extends BaseFilter<Params> {
  override async onInit(args: OnInitArguments<Params>): Promise<void> {
    await args.denops.cmd(`highlight link FuzzyAccent Number`);
  }
  override async filter(args: FilterArguments<Params>): Promise<Item[]> {
    const normalize = (s: string) =>
      args.sourceOptions.ignoreCase ? s.toLowerCase() : s;
    const item_matches = args.items.map((item) =>
      [
        item,
        fuzzy.findBestMatch(normalize(args.completeStr), normalize(item.word)),
      ] as const
    );
    const slices = item_matches.map(([{ word }, { pos }]) =>
      pos.map((col, idx) => word.slice(pos[idx - 1] ?? 0, col))
    ).flat();
    const slice_bytes = await _internals.bulk_strlen(args.denops, slices);
    let slice_index = 0;
    return item_matches.map(([item, { pos }]): Item => {
      if (pos.length === 0) {
        return item;
      }
      let col = 0;
      const highlights = pos.map((): PumHighlight => {
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
          ...(item.highlights ?? []),
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
