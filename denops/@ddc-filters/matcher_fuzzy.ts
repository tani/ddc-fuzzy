import { BaseFilter, Candidate } from "https://lib.deno.dev/x/ddc_vim@v0/types.ts"
import { Denops } from "https://lib.deno.dev/x/denops_std@v2/mod.ts"
import * as fuzzy from "https://cdn.skypack.dev/fuzzyjs@5?dts"

export class Filter extends BaseFilter<{}> {
  override async filter(args: {completeStr: string, candidates: Candidate[]}): Promise<Candidate[]> {
    return Promise.resolve(
      args.candidates.filter(
        fuzzy.filter(args.completeStr, {
          iterator(candidate) {
            return candidate.word
          }
        })
      ))
  }
  override params(): {} {
    return {}
  }
}
