import type { LevelId } from "./site";

/** Six gap-fill questions, each a step harder (A1 → C1). The sentences stay in English in both locales. */
export const quiz: { before: string; after: string; options: string[]; answer: number }[] = [
  { before: "She", after: "from Kazan.", options: ["is", "are", "am"], answer: 0 },
  { before: "I", after: "to the gym yesterday.", options: ["go", "went", "gone"], answer: 1 },
  { before: "We have lived here", after: "2019.", options: ["for", "since", "from"], answer: 1 },
  { before: "If it rains tomorrow, we", after: "at home.", options: ["stay", "would stay", "will stay"], answer: 2 },
  { before: "I wish I", after: "more time to travel.", options: ["have", "had", "would have"], answer: 1 },
  { before: "Hardly", after: "the meeting started when the alarm went off.", options: ["did", "has", "had"], answer: 2 },
];

/** A rough placement by number of correct answers — a conversation starter, not an exam. */
export function levelFromScore(score: number): Exclude<LevelId, "unknown"> {
  if (score <= 1) return "a1";
  if (score === 2) return "a2";
  if (score <= 4) return "b1";
  if (score === 5) return "b2";
  return "c1";
}
