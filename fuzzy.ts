// Trivial fuzzy sorter written by TANIGUCHI Masaya
// Public Domain

export interface Match {
  pos: number[];
  score: number;
}

export function scoreMatch(source: string, pos: number[]): number {
  if (pos.length === 0) {
    return 0;
  }
  const length = pos.length > 1 ? pos.at(-1)! - pos[0] : 1;
  let ngroup = 1;
  for (let i = 1; i < pos.length; i++) {
    if (pos[i - 1] + 1 !== pos[i]) {
      ngroup += 1;
    }
  }
  let score = 0;
  score += 1 / ngroup;
  score += 1 / (pos[0] + 1) / 10;
  score += 1 / length / 100;
  score += 1 / source.length / 1000;
  return score;
}

export function findAllMatches(pattern: string, source: string): Match[] {
  const h = new Map<string, number[]>();
  for (let i = 0; i < source.length; i++) {
    const c = source[i];
    h.has(c) || h.set(c, []);
    h.get(c)?.push(i);
  }
  const matches: Match[] = [];
  let oldPosList = h.get(pattern[0])?.map((c) => [c]) ?? [];
  for (let i = 1; i < pattern.length; i++) {
    const newPosList = [];
    for (const oldPos of oldPosList) {
      for (const j of h.get(pattern[i]) ?? []) {
        if (oldPos[oldPos.length - 1] < j) {
          const pos = oldPos.concat(j);
          if (i === pattern.length - 1) {
            const score = scoreMatch(source, pos);
            matches.push({ pos, score });
          } else {
            newPosList.push(pos);
          }
        }
      }
    }
    oldPosList = newPosList;
  }
  return matches;
}

export function findBestMatch(pattern: string, source: string): Match {
  let bestMatch: Match = { pos: [], score: -Infinity };
  for (const m of findAllMatches(pattern, source)) {
    if (m.score > bestMatch.score) {
      bestMatch = m;
    }
  }
  return bestMatch;
}

export function score(pattern: string, source: string): number {
  return findBestMatch(pattern, source).score;
}

export function match(pattern: string, source: string): number[] {
  return findBestMatch(pattern, source).pos;
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
    const w = m ||
      /[^a-zA-Z]/.test(source[s - 1]) ||
      /[a-z][A-Z]/.test(source.slice(s - 1, s + 1));
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
