import React, { useState } from 'react';

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

export const SimpleChart: React.FC<SimpleChartProps> = ({
  type,
  data,
  xKey,
  series,
  formatValue = (v) => v.toLocaleString('id-ID'),
  formatAxis = (v) => {
    if (v >= 1_000_000) return `Rp ${(v / 1_000_000).toFixed(1)}Jt`;
    if (v >= 1_000) return `Rp ${(v / 1_000).toFixed(0)}Rb`;
    return `Rp ${v}`;
  },
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const W = 800;
  const H = 340;
  const pad = { top: 35, right: 30, bottom: 48, left: 75 };
  const plotW = W - pad.left - pad.right;
  const plotH = H - pad.top - pad.bottom;

  const values = data.flatMap((d) => series.map((s) => Number(d[s.key]) || 0));
  const rawMax = Math.max(1, ...values);
  // Round maxVal up to clean numbers
  const maxVal = Math.ceil(rawMax * 1.15);
  const minVal = 0;

  const x = (i: number) => pad.left + (plotW * (i + 0.5)) / Math.max(1, data.length);
  const y = (v: number) => pad.top + plotH - ((v - minVal) / (maxVal - minVal)) * plotH;

  const ticks = [0, maxVal * 0.25, maxVal * 0.5, maxVal * 0.75, maxVal];

  const formatBarBadge = (v: number) => {
    if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}Jt`;
    if (v >= 1_000) return `${(v / 1_000).toFixed(0)}Rb`;
    return `${v}`;
  };

  const areaPath = (s: SimpleChartSeries) => {
    const line = data
      .map((d, i) => `${i === 0 ? 'M' : 'L'} ${x(i).toFixed(2)} ${y(Number(d[s.key]) || 0).toFixed(2)}`)
      .join(' ');
    const base = (pad.top + plotH).toFixed(2);
    return `${line} L ${x(Math.max(0, data.length - 1)).toFixed(2)} ${base} L ${x(0).toFixed(2)} ${base} Z`;
  };

  const band = plotW / Math.max(1, data.length);
  const groupW = Math.min(band * 0.7, 70);
  const barW = groupW / Math.max(1, series.length);

  return (
    <div className="w-full select-none">
      <div className="relative">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full overflow-visible" style={{ height: 'auto' }} role="img">
          <defs>
            <linearGradient id="emeraldGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#047857" />
            </linearGradient>
            <linearGradient id="roseGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f43f5e" />
              <stop offset="100%" stopColor="#be123c" />
            </linearGradient>
            <linearGradient id="areaEmerald" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.02" />
            </linearGradient>
            <linearGradient id="areaRose" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {/* Background Grid Ticks */}
          {ticks.map((t, i) => (
            <g key={i}>
              <line
                x1={pad.left}
                y1={y(t)}
                x2={W - pad.right}
                y2={y(t)}
                stroke="#cbd5e1"
                strokeDasharray="4 4"
                strokeWidth={1}
                className="opacity-40 dark:opacity-20"
              />
              <text
                x={pad.left - 10}
                y={y(t) + 4}
                textAnchor="end"
                fontSize="11"
                fontWeight="600"
                fill="#64748b"
                className="font-mono"
              >
                {formatAxis(t)}
              </text>
            </g>
          ))}

          {/* Solid Baseline */}
          <line
            x1={pad.left}
            y1={pad.top + plotH}
            x2={W - pad.right}
            y2={pad.top + plotH}
            stroke="#94a3b8"
            strokeWidth={1.5}
            className="opacity-70 dark:opacity-40"
          />

          {/* Hover highlight background column */}
          {hoveredIdx !== null && (
            <rect
              x={x(hoveredIdx) - band / 2}
              y={pad.top}
              width={band}
              height={plotH}
              fill="#f1f5f9"
              className="dark:fill-slate-800/50 opacity-60 rounded-xl"
              rx={8}
            />
          )}

          {/* X Axis Labels & Tick marks */}
          {data.map((d, i) => (
            <g key={i} className="cursor-pointer" onMouseEnter={() => setHoveredIdx(i)} onMouseLeave={() => setHoveredIdx(null)}>
              <line
                x1={x(i)}
                y1={pad.top + plotH}
                x2={x(i)}
                y2={pad.top + plotH + 5}
                stroke="#94a3b8"
                strokeWidth={1.5}
              />
              <text
                x={x(i)}
                y={H - 16}
                textAnchor="middle"
                fontSize="12"
                fontWeight={hoveredIdx === i ? '700' : '600'}
                fill={hoveredIdx === i ? '#0f172a' : '#475569'}
                className="dark:fill-slate-300"
              >
                {String(d[xKey])}
              </text>
            </g>
          ))}

          {/* Area Chart Mode */}
          {type === 'area' &&
            series.map((s) => (
              <g key={s.key}>
                <path
                  d={areaPath(s)}
                  fill={s.key === 'Pemasukan' ? 'url(#areaEmerald)' : 'url(#areaRose)'}
                  stroke={s.color}
                  strokeWidth={2.5}
                  strokeLinejoin="round"
                />
              </g>
            ))}

          {type === 'area' &&
            series.map((s) =>
              data.map((d, i) => {
                const v = Number(d[s.key]) || 0;
                const isHovered = hoveredIdx === i;
                return (
                  <g key={`${s.key}-${i}`}>
                    <circle
                      cx={x(i)}
                      cy={y(v)}
                      r={isHovered ? 6 : 4}
                      fill={s.color}
                      stroke="#ffffff"
                      strokeWidth={2}
                      className="transition-all"
                    />
                    {v > 0 && (
                      <text
                        x={x(i)}
                        y={y(v) - 10}
                        textAnchor="middle"
                        fontSize="10"
                        fontWeight="700"
                        fill={s.color}
                      >
                        {formatBarBadge(v)}
                      </text>
                    )}
                  </g>
                );
              }),
            )}

          {/* Bar Chart Mode */}
          {type === 'bar' &&
            series.map((s, si) =>
              data.map((d, di) => {
                const v = Number(d[s.key]) || 0;
                const bx = x(di) - groupW / 2 + si * barW;
                const by = y(v);
                const bh = Math.max(0, pad.top + plotH - by);
                const isHovered = hoveredIdx === di;

                return (
                  <g
                    key={`${s.key}-${di}`}
                    className="cursor-pointer transition-transform"
                    onMouseEnter={() => setHoveredIdx(di)}
                    onMouseLeave={() => setHoveredIdx(null)}
                  >
                    <rect
                      x={bx}
                      y={v > 0 ? by : pad.top + plotH - 2}
                      width={Math.max(2, barW - 3)}
                      height={v > 0 ? bh : 2}
                      rx={5}
                      fill={s.key === 'Pemasukan' ? 'url(#emeraldGrad)' : 'url(#roseGrad)'}
                      opacity={hoveredIdx !== null && !isHovered ? 0.6 : 1}
                      className="transition-all"
                    />
                    {/* Amount label on top of bar */}
                    {v > 0 && (
                      <text
                        x={bx + (barW - 3) / 2}
                        y={by - 7}
                        textAnchor="middle"
                        fontSize="10"
                        fontWeight="bold"
                        fill={s.color}
                      >
                        {formatBarBadge(v)}
                      </text>
                    )}
                  </g>
                );
              }),
            )}
        </svg>

        {/* Hover Detail Card Overlay */}
        {hoveredIdx !== null && data[hoveredIdx] && (
          <div className="mt-3 p-3 bg-slate-900 text-white rounded-xl shadow-lg flex items-center justify-between text-xs max-w-md mx-auto border border-slate-700">
            <span className="font-bold text-amber-400">{String(data[hoveredIdx][xKey])}</span>
            <div className="flex items-center gap-4">
              {series.map((s) => (
                <div key={s.key} className="flex items-center gap-1.5 font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                  <span className="text-slate-300">{s.label}:</span>
                  <span className="font-mono font-bold text-white">
                    Rp {formatValue(Number(data[hoveredIdx][s.key]) || 0)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Legend Bar */}
      <div className="flex flex-wrap gap-6 justify-center mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80">
        {series.map((s) => {
          const totalSeries = data.reduce((sum, d) => sum + (Number(d[s.key]) || 0), 0);
          return (
            <div key={s.key} className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-200">
              <span className="w-3.5 h-3.5 rounded-md shadow-sm" style={{ backgroundColor: s.color }} />
              <span>{s.label}</span>
              <span className="font-mono text-slate-500 font-semibold">(Total: Rp {totalSeries.toLocaleString('id-ID')})</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
