import type { Dict } from "@/dictionaries";
import { TimeZones } from "./TimeZones";

/** Full-bleed band: the school really does work across eleven time zones — show it live. */
export function Clocks({ zones }: { zones: Dict["zones"] }) {
  return (
    <section className="clocks brand" aria-labelledby="clocks-title">
      <div className="wrap">
        <header className="clocks__head">
          <h2 id="clocks-title" className="clocks__title">
            {zones.title}
          </h2>
          <p>{zones.lead}</p>
        </header>
        <TimeZones zones={zones} />
      </div>
    </section>
  );
}
