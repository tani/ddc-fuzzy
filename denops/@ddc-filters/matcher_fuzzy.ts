import { BaseFilter, Candidate } from "https://lib.deno.dev/x/ddc_vim@v0/types.ts"
import { Denops } from "https://lib.deno.dev/x/denops_std@v2/mod.ts"
import * as fuzzy from "../../fuzzy.ts"

export class Filter extends BaseFilter<{}> {
  override async filter(args: {completeStr: string, candidates: Candidate[]}): Promise<Candidate[]> {
    return Promise.resolve(args.candidates.filter(candidate => fuzzy.test(args.completeStr, candidate.word)))
  }
  override params(): {} {
    return {}
  }
}
