import { Candidate } from "https://lib.deno.dev/x/ddc_vim@v0/types.ts";
import {
  BaseFilter,
  FilterArguments,
} from "https://lib.deno.dev/x/ddc_vim@v0/base/filter.ts";
import * as fuzzy from "../../fuzzy.ts";

type Params = {
  splitMode: "character" | "word";
};

export class Filter extends BaseFilter<Params> {
  override filter(args: FilterArguments<Params>): Promise<Candidate[]> {
    const normalize = (s: string) =>
      args.sourceOptions.ignoreCase ? s.toLowerCase() : s;
    return Promise.resolve(args.candidates.filter((candidate) => {
      if (args.filterParams.splitMode === "word") {
        return fuzzy.wtest(
          normalize(args.completeStr),
          normalize(candidate.word),
        );
      } else {
        return fuzzy.ctest(
          normalize(args.completeStr),
          normalize(candidate.word),
        );
      }
    }));
  }
  override params(): Params {
    return {
      splitMode: "character",
    };
  }
}
