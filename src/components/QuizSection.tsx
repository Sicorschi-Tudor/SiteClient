import type { Dict } from "@/dictionaries";
import { LevelQuiz } from "./LevelQuiz";

export function QuizSection({ dict }: { dict: Dict }) {
  const q = dict.quiz;
  return (
    <section id="uroven" className="quizsec" aria-labelledby="uroven-title">
      <div className="wrap quizsec__grid">
        <header className="quizsec__head">
          <p className="tag">{q.eyebrow}</p>
          <h2 id="uroven-title" className="h2">
            {q.title}
          </h2>
          <p>{q.lead}</p>
        </header>
        <LevelQuiz t={q} />
      </div>
    </section>
  );
}
