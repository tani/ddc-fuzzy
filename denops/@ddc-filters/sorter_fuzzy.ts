import { BaseFilter, Candidate } from "https://lib.deno.dev/x/ddc_vim@v0/types.ts"
import { Denops } from "https://lib.deno.dev/x/denops_std@v2/mod.ts"
import memoizy from "https://lib.deno.dev/x/memoizy@v1/mod.ts"
import * as fuzzy from "../../fuzzy.ts"

export class Filter extends BaseFilter<{}> {
  override async filter(args: {completeStr: string, candidates: Candidate[]}): Promise<Candidate[]> {
    const score = memoizy(fuzzy.score)
    return Promise.resolve(
      args.candidates.sort((a, b) => {
        return score(args.completeStr, b.word) - score(args.completeStr, a.word)
      })
    )
  }
  override params(): {} {
    return {}
  }
}
