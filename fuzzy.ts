// Trivial fuzzy sorter written by TANIGUCHI Masaya
// Public Domain

export function findAllMatches(pattern: string, source: string) {
  const indicesList: number[][] = pattern.split("").map((char) => {
    return ([] as number[]).concat(
      ...source.split("").map((c, i) => c === char ? [i] : []),
    );
  });
  function recur(acc: number[], i: number): number[][] {
    if (i === indicesList.length) {
      return [acc];
    }
    const j = indicesList[i].findIndex((c) => (acc.at(-1) ?? -1) < c);
    return j < 0 ? [] : ([] as number[][]).concat(
      ...indicesList[i].slice(j).map((c) => recur(acc.concat([c]), i + 1)),
    );
  }
  return recur([], 0);
}

export function scoreMatch(source: string, match: number[]): number {
  const length = (match.at(-1) ?? 0) - match[0];
  let ngroup = 1;
  for (let i = 0; i < match.length; i++) {
    if ((match.at(i - 1) ?? -1) + 1 !== match[i]) {
      ngroup += 1;
    }
  }
  let score = 0;
  score += 1 / ngroup;
  score += 1 / (match[0] + 1) / 10;
  score += 1 / length / 100;
  score += 1 / source.length / 1000;
  return score;
}

export function findBestMatch(
  pattern: string,
  source: string,
): [number, number[]] {
  let bestScore = -Infinity;
  let bestMatch: number[] = [];
  for (const m of findAllMatches(pattern, source)) {
    const s = scoreMatch(source, m);
    if (s > bestScore) {
      bestScore = s;
      bestMatch = m;
    }
  }
  return [bestScore, bestMatch];
}

export function score(pattern: string, source: string): number {
  return findBestMatch(pattern, source)[0];
}

export function match(pattern: string, source: string): number[] {
  return findBestMatch(pattern, source)[1];
}

export function ctest(pattern: string, source: string): boolean {
  let p = 0;
  let s = 0;
  while (p < pattern.length) {
    if (s >= source.length) {
      return false;
    }
    if (pattern[p] === source[s]) {
      p++;
    }
    s++;
  }
  return true;
}

export function wtest(pattern: string, source: string): boolean {
  let p = 0;
  let s = 0;
  let m = true;
  while (p < pattern.length) {
    if (s >= source.length) {
      return false;
    }
    let w = m;
    w ||= /[^a-zA-Z]/.test(source[s - 1]);
    w ||= /[a-z]/.test(source[s - 1]) && /[A-Z]/.test(source[s]);
    if (w && pattern[p] === source[s]) {
      p++;
      m = true;
    } else {
      m = false;
    }
    s++;
  }
  return true;
}
