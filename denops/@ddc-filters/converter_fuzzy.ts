import { BaseFilter, Candidate, PumHighlight } from "https://lib.deno.dev/x/ddc_vim@v0/types.ts"
import { Denops } from "https://lib.deno.dev/x/denops_std@v2/mod.ts"
import * as fuzzy from "../../fuzzy.ts"

export class Filter extends BaseFilter<{}> {
  override async filter(args: {completeStr: string, candidates: Candidate[]}): Promise<Candidate[]> {
    return Promise.resolve(
      args.candidates.map((candidate) => {
        const match = fuzzy.match(args.completeStr, candidate.word)
        candidate.highlights = match.map(col => ({
          col: col,
          type: "abbr",
          name: "ddc_fuzzy_matched_character",
          "hl_group": "SpellBad",
          width: 1
        }))
        return candidate
      })
    )
  }
  override params(): {} {
    return {}
  }
}
