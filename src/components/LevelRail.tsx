"use client";

import type { Dict } from "@/dictionaries";
import { setSelection, useSelection } from "@/lib/selection";
import type { LevelId } from "@/lib/site";

const LEVELS = ["a1", "a2", "b1", "b2", "c1"] as const;

/**
 * Which answer is visible is decided by CSS (`:has(:checked)`). The radios mirror
 * the shared selection, so the rail, the form's level select and the lead always agree.
 * Nothing is pre-selected: until the visitor picks, the form honestly says "not sure".
 */
export function LevelRail({ entry }: { entry: Dict["hero"]["entry"] }) {
  const { level } = useSelection();
  return (
    <div className="rail">
      <div className="rail__exs">
      {LEVELS.map((lv) => (
        <div className="rail__ex" data-lv={lv} key={lv}>
          <p className="bubble bubble--me">
            <b lang="en">{entry.levels[lv].en}</b>
            <small lang="ru">{entry.levels[lv].tr}</small>
          </p>
          <p className="rail__can">
            {entry.canLabel} · {lv.toUpperCase()}
          </p>
        </div>
      ))}
      </div>
      <div className="rail__foot">
      <p className="rail__legend" id="rail-legend">
        {entry.railLegend}
      </p>
      <div className="rail__opts" role="radiogroup" aria-labelledby="rail-legend">
        {LEVELS.map((lv) => (
          <label className="rail__opt" key={lv}>
            <input
              type="radio"
              name="hero-level"
              value={lv}
              checked={level === lv}
              onChange={() => setSelection({ level: lv as LevelId })}
            />
            <span>{lv.toUpperCase()}</span>
          </label>
        ))}
      </div>
      <p className="rail__hint">{entry.railHint}</p>
      </div>
    </div>
  );
}
