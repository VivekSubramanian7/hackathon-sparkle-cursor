type Props = { levels: number[]; active: boolean };

export function Waveform({ levels, active }: Props) {
  const bars = 48;
  const data = Array.from({ length: bars }, (_, i) => levels[i] ?? 0);
  return (
    <div className={`nc-wave ${active ? "is-active" : ""}`} aria-hidden="true">
      {data.map((v, i) => (
        <span key={i} style={{ height: `${Math.max(4, Math.min(100, v * 180))}%` }} />
      ))}
    </div>
  );
}