import { Candidate } from "https://lib.deno.dev/x/ddc_vim@v1/types.ts";
import {
  BaseFilter,
  FilterArguments,
  OnInitArguments,
} from "https://lib.deno.dev/x/ddc_vim@v1/base/filter.ts";
import * as fuzzy from "../../fuzzy.ts";

type Params = { hlGroup: string };

export class Filter extends BaseFilter<Params> {
  override async onInit(args: OnInitArguments<Params>): Promise<void> {
    await args.denops.cmd(`highlight link FuzzyAccent Number`);
  }
  override filter(args: FilterArguments<Params>): Promise<Candidate[]> {
    const normalize = (s: string) =>
      args.sourceOptions.ignoreCase ? s.toLowerCase() : s;
    return Promise.resolve(
      args.candidates.map((candidate) => {
        const match = fuzzy.findBestMatch(
          normalize(args.completeStr),
          normalize(candidate.word),
        )
        return {
          ...candidate,
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
