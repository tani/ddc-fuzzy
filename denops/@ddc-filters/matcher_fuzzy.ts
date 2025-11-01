import { Item } from "jsr:@shougo/ddc-vim@10.1.0/types";
import {
  BaseFilter,
  FilterArguments,
} from "jsr:@shougo/ddc-vim@10.1.0/filter";
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
