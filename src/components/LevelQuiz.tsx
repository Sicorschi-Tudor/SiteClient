"use client";

import { useEffect, useRef, useState } from "react";
import type { Dict } from "@/dictionaries";
import { levelFromScore, quiz } from "@/lib/quiz";
import { setSelection } from "@/lib/selection";
import { Arrow } from "./Icons";

/** How long the right / wrong feedback stays on screen before the next question. */
const FEEDBACK_MS = 750;

/** A one-minute placement check. Its result is carried straight into the sign-up form. */
export function LevelQuiz({ t }: { t: Dict["quiz"] }) {
  const [answers, setAnswers] = useState<number[]>([]);
  const [picked, setPicked] = useState<number | null>(null);
  const [status, setStatus] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  // The question block is re-created on every step, so move focus to the new content
  // ourselves — but only after the visitor has interacted, never on page load.
  const focusRef = useRef<HTMLParagraphElement>(null);
  const interacted = useRef(false);
  useEffect(() => {
    if (interacted.current) focusRef.current?.focus({ preventScroll: true });
  }, [answers.length]);

  const step = answers.length;
  const done = step >= quiz.length;

  if (done) {
    const score = answers.filter((a, i) => a === quiz[i].answer).length;
    const level = levelFromScore(score);
    return (
      <div className="quiz">
        <p className="quiz__meta">{t.resultLabel}</p>
        <p className="quiz__level" ref={focusRef} tabIndex={-1}>
          <b>{level.toUpperCase()}</b>
          <span>{t.levels[level].name}</span>
        </p>
        <p className="quiz__text">{t.levels[level].text}</p>
        <ol className="quiz__dots" aria-label={`${t.score}: ${score} ${t.of} ${quiz.length}`}>
          {quiz.map((q, i) => (
            <li key={i} data-ok={answers[i] === q.answer} />
          ))}
        </ol>
        <p className="quiz__meta">
          {t.score}: {score} {t.of} {quiz.length}
        </p>
        <div className="quiz__act">
          <a className="btn" href="#zapis" onClick={() => setSelection({ level })}>
            {t.cta} {level.toUpperCase()}
            <Arrow />
          </a>
          <button
            type="button"
            className="quiz__again"
            onClick={() => {
              setStatus("");
              setAnswers([]);
            }}
          >
            {t.again}
          </button>
        </div>
        <p className="quiz__note">{t.note}</p>
      </div>
    );
  }

  const q = quiz[step];
  const choose = (i: number) => {
    if (picked !== null) return;
    interacted.current = true;
    setPicked(i);
    setStatus(`${i === q.answer ? t.right : t.wrong}: ${q.options[q.answer]}`);
    timer.current = setTimeout(() => {
      setAnswers((prev) => [...prev, i]);
      setPicked(null);
    }, FEEDBACK_MS);
  };
  const state = (i: number) => {
    if (picked === null) return undefined;
    if (i === q.answer) return "right";
    return i === picked ? "wrong" : "off";
  };

  return (
    <div className="quiz">
      <div className="quiz__top">
        <p className="quiz__meta">
          {t.question} {step + 1} {t.of} {quiz.length}
        </p>
        <ol className="quiz__bar" aria-hidden="true">
          {quiz.map((_, i) => (
            <li key={i} data-on={i <= step} />
          ))}
        </ol>
      </div>
      {/* key restarts the entrance animation for every question */}
      <div className="quiz__q" key={step}>
        <p className="quiz__sentence" lang="en" ref={focusRef} tabIndex={-1}>
          {q.before}{" "}
          {picked === null ? (
            <span className="quiz__gap" role="img" aria-label={t.gap} />
          ) : (
            <mark className="quiz__fill">{q.options[q.answer]}</mark>
          )}{" "}
          {q.after}
        </p>
        <div className="quiz__opts" lang="en">
          {q.options.map((o, i) => (
            <button
              type="button"
              key={o}
              className="quiz__opt"
              data-state={state(i)}
              aria-disabled={picked !== null}
              onClick={() => choose(i)}
            >
              {o}
              {state(i) === "right" && <span aria-hidden="true"> ✓</span>}
              {state(i) === "wrong" && <span aria-hidden="true"> ✕</span>}
            </button>
          ))}
        </div>
      </div>
      {/* Right / wrong is announced, not only shown in colour. */}
      <p className="sr-only" role="status">
        {status}
      </p>
    </div>
  );
}
