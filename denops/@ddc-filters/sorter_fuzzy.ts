import { Candidate } from "https://lib.deno.dev/x/ddc_vim@v0/types.ts";
import {
  BaseFilter,
  FilterArguments,
} from "https://lib.deno.dev/x/ddc_vim@v0/base/filter.ts";
import memoizy from "https://lib.deno.dev/x/memoizy@v1/mod.ts";
import * as fuzzy from "../../fuzzy.ts";

type Params = Record<string, never>;

export class Filter extends BaseFilter<Params> {
  override filter(args: FilterArguments<Params>): Promise<Candidate[]> {
    const score = memoizy(fuzzy.score);
    const normalize = (s: string) =>
      args.sourceOptions.ignoreCase ? s.toLowerCase() : s;
    return Promise.resolve(
      args.candidates.sort((a, b) => {
        const x = score(normalize(args.completeStr), normalize(b.word));
        const y = score(normalize(args.completeStr), normalize(a.word));
        return x - y;
      }),
    );
  }
  override params(): Params {
    return {};
  }
}
