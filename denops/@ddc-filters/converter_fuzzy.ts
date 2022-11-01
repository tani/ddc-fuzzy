import { Item } from "https://lib.deno.dev/x/ddc_vim@v3/types.ts";
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
  override filter(args: FilterArguments<Params>): Promise<Item[]> {
    const normalize = (s: string) =>
      args.sourceOptions.ignoreCase ? s.toLowerCase() : s;
    return Promise.resolve(
      args.items.map((item) => {
        const match = fuzzy.findBestMatch(
          normalize(args.completeStr),
          normalize(item.word),
        )
        return {
          ...item,
          highlights: match?.pos.map((col) => ({
            col: col,
            type: "abbr",
            name: "ddc_fuzzy_matched_character",
            "hl_group": args.filterParams.hlGroup,
            width: 1,
          })),
        };
      }),
    );
  }
  override params(): Params {
    return {
      hlGroup: "FuzzyAccent",
    };
  }
}
