import { Item } from "https://deno.land/x/ddc_vim@v3.0.0/types.ts";
import {
  BaseFilter,
  FilterArguments,
} from "https://deno.land/x/ddc_vim@v3.0.0/base/filter.ts";
import * as fuzzy from "../../fuzzy.ts";

type Params = {
  splitMode: "character" | "word";
};

export class Filter extends BaseFilter<Params> {
  override filter(args: FilterArguments<Params>): Promise<Item[]> {
    const normalize = (s: string) =>
      args.sourceOptions.ignoreCase ? s.toLowerCase() : s;
    return Promise.resolve(args.items.filter((item) => {
      if (args.filterParams.splitMode === "word") {
        return fuzzy.wtest(
          normalize(args.completeStr),
          normalize(item.word),
        );
      } else {
        return fuzzy.ctest(
          normalize(args.completeStr),
          normalize(item.word),
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
