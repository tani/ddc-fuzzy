// Trivial fuzzy sorter written by TANIGUCHI Masaya
// Public Domain

function findAllMatches(pattern: string, source: string) {
  const indicesList: number[][] = pattern.split("").map((char) => {
    return ([] as number[]).concat(
      ...source.split("").map((c, i) => c === char ? [i] : []),
    );
  });
  function recur(acc: number[], i: number): number[][] {
    if (i === indicesList.length) {
      return [acc];
    }
    const candidates = indicesList[i]
      .slice(indicesList[i].findIndex((c) => (acc.at(-1) ?? -1) < c))
      .map((c) => recur(acc.concat([c]), i + 1));
    return ([] as number[][]).concat(...candidates);
  }
  return recur([], 0);
}

function scoreMatch(source: string, match: number[]): number {
  const length = (match.at(-1) ?? 0) - match[0];
  let ngroup = 1;
  for (let i = 0; i < match.length; i++) {
    if ((match.at(i - 1) ?? -1) + 1 !== match[i]) {
      ngroup += 1;
    }
  }
  let score = 0
  score += 1 / ngroup
  score += 1 / (match[0] + 1) / 10
  score += 1 / length / 100
  score += 1 / source.length / 1000
  return score
}

export function score(pattern: string, source: string): number {
  return Math.max(...findAllMatches(pattern, source).map(match => scoreMatch(source, match)));
}

export function test(pattern: string, source: string): boolean {
  let p = 0
  let s = 0
  while(p < pattern.length) {
    if (s >= source.length) {
      return false
    }
    if (pattern[p] === source[s]) {
      p++
    }
    s++
  }
  return true
}
