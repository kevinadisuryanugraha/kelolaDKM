import React from 'react';

export interface SimpleChartSeries {
  key: string;
  label: string;
  color: string;
}

interface SimpleChartProps {
  type: 'area' | 'bar';
  data: Record<string, any>[];
  xKey: string;
  series: SimpleChartSeries[];
  formatValue?: (v: number) => string;
  formatAxis?: (v: number) => string;
}

/**
 * Lightweight dependency-free SVG chart (replaces Recharts to keep the
 * production bundle small). Supports multi-series area and bar charts.
 */
export const SimpleChart: React.FC<SimpleChartProps> = ({
  type,
  data,
  xKey,
  series,
  formatValue = (v) => v.toLocaleString('id-ID'),
  formatAxis = (v) => `${(v / 1_000_000).toFixed(1)}Jt`,
}) => {
  const W = 800;
  const H = 320;
  const pad = { top: 16, right: 12, bottom: 36, left: 52 };
  const plotW = W - pad.left - pad.right;
  const plotH = H - pad.top - pad.bottom;

  const values = data.flatMap((d) => series.map((s) => Number(d[s.key]) || 0));
  const maxVal = Math.max(1, ...values);
  const minVal = 0;

  const x = (i: number) => pad.left + (plotW * (i + 0.5)) / Math.max(1, data.length);
  const y = (v: number) => pad.top + plotH - ((v - minVal) / (maxVal - minVal)) * plotH;

  const ticks = Array.from({ length: 5 }, (_, i) => minVal + ((maxVal - minVal) * i) / 4);

  const areaPath = (s: SimpleChartSeries) => {
    const line = data
      .map((d, i) => `${i === 0 ? 'M' : 'L'} ${x(i).toFixed(2)} ${y(Number(d[s.key]) || 0).toFixed(2)}`)
      .join(' ');
    const base = (pad.top + plotH).toFixed(2);
    return `${line} L ${x(Math.max(0, data.length - 1)).toFixed(2)} ${base} L ${x(0).toFixed(2)} ${base} Z`;
  };

  const band = plotW / Math.max(1, data.length);
  const groupW = band * 0.6;
  const barW = groupW / Math.max(1, series.length);

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 'auto' }} role="img">
        {ticks.map((t, i) => (
          <g key={i}>
            <line
              x1={pad.left}
              y1={y(t)}
              x2={W - pad.right}
              y2={y(t)}
              stroke="#cbd5e1"
              strokeDasharray="3 3"
              opacity={0.4}
            />
            <text x={pad.left - 8} y={y(t) + 4} textAnchor="end" fontSize="11" fill="#94a3b8">
              {formatAxis(t)}
            </text>
          </g>
        ))}

        {data.map((d, i) => (
          <text key={i} x={x(i)} y={H - 12} textAnchor="middle" fontSize="11" fill="#94a3b8">
            {String(d[xKey])}
          </text>
        ))}

        {type === 'area' &&
          series.map((s) => (
            <path
              key={s.key}
              d={areaPath(s)}
              fill={s.color}
              fillOpacity={0.22}
              stroke={s.color}
              strokeWidth={2}
              strokeLinejoin="round"
            />
          ))}

        {type === 'area' &&
          series.map((s) =>
            data.map((d, i) => {
              const v = Number(d[s.key]) || 0;
              return (
                <circle key={`${s.key}-${i}`} cx={x(i)} cy={y(v)} r={3} fill={s.color}>
                  <title>{`${s.label}: Rp ${formatValue(v)}`}</title>
                </circle>
              );
            }),
          )}

        {type === 'bar' &&
          series.map((s, si) =>
            data.map((d, di) => {
              const v = Number(d[s.key]) || 0;
              const bx = x(di) - groupW / 2 + si * barW;
              const by = y(v);
              const bh = pad.top + plotH - by;
              return (
                <rect
                  key={`${s.key}-${di}`}
                  x={bx}
                  y={by}
                  width={Math.max(1, barW - 2)}
                  height={Math.max(0, bh)}
                  rx={3}
                  fill={s.color}
                >
                  <title>{`${s.label}: Rp ${formatValue(v)}`}</title>
                </rect>
              );
            }),
          )}
      </svg>

      <div className="flex flex-wrap gap-4 justify-center mt-3">
        {series.map((s) => (
          <span key={s.key} className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: s.color }} />
            {s.label}
          </span>
        ))}
      </div>
    </div>
  );
};
