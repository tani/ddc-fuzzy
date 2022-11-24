// Trivial fuzzy sorter written by TANIGUCHI Masaya
// Public Domain

export interface Match {
  pos: number[];
  score: number;
}

export function scoreMatch(source: string, pos: number[]): number {
  const length = (pos.at(-1) ?? 0) - pos[0];
  let ngroup = 1;
  for (let i = 0; i < pos.length; i++) {
    if ((pos.at(i - 1) ?? -1) + 1 !== pos[i]) {
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

export function findAllMatches(
  pattern: string,
  source: string,
  threshold = 100,
): Match[] {
  const h = new Map<string, number[]>();
  for (let i = 0; i < source.length; i++) {
    const c = source[i];
    h.has(c) || h.set(c, []);
    h.get(c)!.push(i);
  }
  const thresholdFilter = (posList: number[][]): number[][] => {
    if (threshold === 0 || posList.length <= threshold) {
      return posList;
    }
    // filter by last pos is more lower
    return posList.sort((a, b) => {
      for (let i = a.length - 1; i >= 0; --i) {
        const d = a[i] - b[i];
        if (d) return d;
      }
      return 0;
    }).slice(0, threshold);
  };
  const posList = Array.from(pattern).slice(1).reduce(
    (oldPosList, c): number[][] => {
      const newPosList = [];
      const patPosList = h.get(c)!;
      for (const oldPos of oldPosList) {
        const last = oldPos.at(-1)!;
        for (const j of patPosList) {
          if (last < j) {
            newPosList.push(oldPos.concat(j));
          }
        }
      }
      return thresholdFilter(newPosList);
    },
    thresholdFilter(h.get(pattern[0])!.map((c) => [c])),
  );
  return posList.map((pos): Match => ({
    pos,
    score: scoreMatch(source, pos),
  }));
}

export function findBestMatch(
  pattern: string,
  source: string,
  threshold?: number,
): Match {
  let bestMatch: Match = { pos: [], score: -Infinity };
  for (const m of findAllMatches(pattern, source, threshold)) {
    if (m.score > bestMatch.score) {
      bestMatch = m;
    }
  }
  return bestMatch;
}

export function score(
  pattern: string,
  source: string,
  threshold?: number,
): number {
  return findBestMatch(pattern, source, threshold).score;
}

export function match(
  pattern: string,
  source: string,
  threshold?: number,
): number[] {
  return findBestMatch(pattern, source, threshold).pos;
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
