import { Candidate } from "https://lib.deno.dev/x/ddc_vim@v0/types.ts";
import {
  BaseFilter,
  FilterArguments,
} from "https://lib.deno.dev/x/ddc_vim@v0/base/filter.ts";
import * as fuzzy from "../../fuzzy.ts";

type Params = Record<string, never>;

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
      candidates.sort((a, b) => {
        const x = (b.user_data as UserData)?.fuzzyMatch?.score ?? 0;
        const y = (a.user_data as UserData)?.fuzzyMatch?.score ?? 0;
        return x - y;
      }),
    );
  }
  override params(): Params {
    return {};
  }
}
