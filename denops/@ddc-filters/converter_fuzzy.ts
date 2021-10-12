import { Candidate } from "https://lib.deno.dev/x/ddc_vim@v0/types.ts";
import {
  BaseFilter,
  FilterArguments,
} from "https://lib.deno.dev/x/ddc_vim@v0/base/filter.ts";
import * as fuzzy from "../../fuzzy.ts";

type Params = { hlGroup: string };

type UserData = { fuzzyMatch?: fuzzy.Match } | undefined;

export class Filter extends BaseFilter<Params> {
  override filter(args: FilterArguments<Params>): Promise<Candidate[]> {
    const normalize = (s: string) =>
      args.sourceOptions.ignoreCase ? s.toLowerCase() : s;
    const candidates = args.candidates.map((candidate) => {
      const fuzzyMatch: fuzzy.Match =
        (candidate.user_data as UserData)?.fuzzyMatch ??
          fuzzy.findBestMatch(
            normalize(args.completeStr),
            normalize(candidate.word),
          );
      return {
        ...candidate,
        user_data: { fuzzyMatch },
      };
    });
    return Promise.resolve(
      candidates.map((candidate) => {
        const fuzzyMatch = (candidate.user_data as UserData)?.fuzzyMatch;
        return {
          ...candidate,
          highlights: fuzzyMatch?.pos.map((col) => ({
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
      hlGroup: "SpellBad",
    };
  }
}
