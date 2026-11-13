import { useState } from 'react';
import { View } from 'react-native';
import Svg, { Circle, Defs, Line, LinearGradient, Path, Stop, Text as SvgText } from 'react-native-svg';

type Point = { label: string; value: number };

const H = 170;                  // chart height
const PAD_L = 30, PAD_R = 16;   // room for the 0/50/100 labels on the left
const PAD_T = 22, PAD_B = 22;   // room for the dot label on top, dates at the bottom

// Turns points into one smooth curve (Catmull-Rom spline as Bézier curves)
function smoothPath(pts: { x: number; y: number }[]) {
  if (pts.length < 2) return '';
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1x = p1.x + (p2.x - p0.x) / 6, c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6, c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2.x} ${p2.y}`;
  }
  return d;
}

export default function ProgressChart({ data }: { data: Point[] }) {
  const [width, setWidth] = useState(0); // measured once the chart is on screen

  const plotW = width - PAD_L - PAD_R;
  const plotH = H - PAD_T - PAD_B;
  const bottom = PAD_T + plotH;

  // Day number → x position, percentage → y position (100% at the top)
  const x = (i: number) => PAD_L + (data.length === 1 ? plotW / 2 : (i / (data.length - 1)) * plotW);
  const y = (v: number) => PAD_T + (1 - v / 100) * plotH;

  const pts = data.map((d, i) => ({ x: x(i), y: y(d.value) }));
  const line = smoothPath(pts);
  const last = pts[pts.length - 1];
  // The fade: the same curve, closed down to the bottom edge
  const area = line ? `${line} L ${last.x} ${bottom} L ${pts[0].x} ${bottom} Z` : '';

  // Show about 5 date labels, so they don't overlap
  const step = Math.max(1, Math.ceil(data.length / 5));
  const showLabel = (i: number) =>
    i === data.length - 1 || (i % step === 0 && data.length - 1 - i >= step / 2);

  return (
    <View onLayout={(e) => setWidth(e.nativeEvent.layout.width)} style={{ height: H }}>
      {width > 0 && (
        <Svg width={width} height={H}>
          <Defs>
            <LinearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor="#7F39A6" stopOpacity="0.25" />
              <Stop offset="1" stopColor="#7F39A6" stopOpacity="0" />
            </LinearGradient>
          </Defs>

          {/* Dashed guide lines at 0, 50 and 100% */}
          {[0, 50, 100].map((v) => (
            <Line key={v} x1={PAD_L} x2={width - PAD_R} y1={y(v)} y2={y(v)} stroke="#EBD5F7" strokeDasharray="4 4" />
          ))}
          {[0, 50, 100].map((v) => (
            <SvgText key={`t${v}`} x={PAD_L - 6} y={y(v) + 4} fontSize="10" fill="#875BA1" textAnchor="end">{v}</SvgText>
          ))}

          {/* The fade, then the line on top */}
          {area ? <Path d={area} fill="url(#fade)" /> : null}
          {line ? <Path d={line} stroke="#7F39A6" strokeWidth={3} fill="none" /> : null}

          {/* Latest day: a dot and its value */}
          {last && <Circle cx={last.x} cy={last.y} r={5} fill="#7F39A6" />}
          {last && (
            <SvgText x={last.x} y={last.y - 10} fontSize="12" fontWeight="bold" fill="#7F39A6" textAnchor="end">
              {data[data.length - 1].value}%
            </SvgText>
          )}

          {/* Dates along the bottom */}
          {data.map((d, i) =>
            showLabel(i) ? (
              <SvgText key={`x${i}`} x={x(i)} y={H - 4} fontSize="10" fill="#875BA1" textAnchor="middle">{d.label}</SvgText>
            ) : null,
          )}
        </Svg>
      )}
    </View>
  );
}