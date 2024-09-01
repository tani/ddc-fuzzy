import { Item } from "jsr:@shougo/ddc-vim@7.0.0/types";
import {
  BaseFilter,
  FilterArguments,
} from "jsr:@shougo/ddc-vim@7.0.0/filter";
import * as fuzzy from "../../fuzzy.ts";

type Params = Record<string, never>;

export class Filter extends BaseFilter<Params> {
  override filter(args: FilterArguments<Params>): Promise<Item[]> {
    const normalize = (s: string) =>
      args.sourceOptions.ignoreCase ? s.toLowerCase() : s;
    const matches = new Map<Item, fuzzy.Match>(
      args.items.map((item) => [
        item,
        fuzzy.findBestMatch(
          normalize(args.completeStr),
          normalize(item.word),
        ),
      ]),
    );
    return Promise.resolve(
      args.items.sort((a, b) => {
        const x = matches.get(b)?.score ?? 0;
        const y = matches.get(a)?.score ?? 0;
        return x - y;
      }),
    );
  }
  override params(): Params {
    return {};
  }
}
