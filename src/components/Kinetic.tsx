/** Two giant lines of everyday phrases that slide in opposite directions as the page scrolls. */
export function Kinetic({ rows }: { rows: string[][] }) {
  return (
    <div className="kinetic" aria-hidden="true">
      {rows.map((row, i) => (
        <p key={i} lang={i === 0 ? "en" : "ru"}>
          {[0, 1, 2].map((k) => (
            <span key={k}>
              {row.map((phrase) => (
                <b key={phrase}>{phrase}</b>
              ))}
            </span>
          ))}
        </p>
      ))}
    </div>
  );
}
