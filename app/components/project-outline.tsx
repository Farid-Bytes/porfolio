"use client";

import type { ReactNode } from "react";

import type { OutlineScreenId } from "@/lib/projects";
import { cn } from "@/lib/utils";

type ProjectOutlineProps = {
  screen: OutlineScreenId;
  className?: string;
};

const C = {
  teal: "rgb(13 148 136)",
  cyan: "rgb(6 182 212)",
  amber: "rgb(245 158 11)",
  ink: "rgb(6 11 20)",
  muted: "rgb(92 103 122)",
  rose: "rgb(244 63 94)",
  emerald: "rgb(16 185 129)",
} as const;

function Pad({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("aspect-[16/11] w-full bg-transparent", className)}>
      <svg
        viewBox="0 0 640 440"
        className="h-full w-full"
        fill="none"
        role="img"
        aria-label="Outline sketch of project screen"
      >
        {children}
      </svg>
    </div>
  );
}

function RoughRect({
  x,
  y,
  w,
  h,
  stroke = C.teal,
  dash = "6 4",
  sw = 1.6,
  rx = 10,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  stroke?: string;
  dash?: string;
  sw?: number;
  rx?: number;
}) {
  return (
    <rect
      x={x}
      y={y}
      width={w}
      height={h}
      rx={rx}
      stroke={stroke}
      strokeWidth={sw}
      strokeDasharray={dash}
    />
  );
}

function Label({
  x,
  y,
  children,
  fill = C.ink,
  size = 11,
}: {
  x: number;
  y: number;
  children: string;
  fill?: string;
  size?: number;
}) {
  return (
    <text
      x={x}
      y={y}
      fill={fill}
      style={{
        fontSize: size,
        fontFamily: "var(--font-mono)",
        letterSpacing: "0.04em",
      }}
    >
      {children}
    </text>
  );
}

function ShellSketch({
  title,
  nav,
  children,
  pageTitle,
}: {
  title: string;
  nav: string[];
  children: ReactNode;
  pageTitle?: string;
}) {
  return (
    <>
      {/* Outer window */}
      <RoughRect x={20} y={20} w={600} h={400} stroke={C.ink} dash="7 4" sw={1.5} rx={14} />
      {/* Title bar */}
      <path d="M20 52 H 620" stroke={C.muted} strokeWidth={1.2} strokeDasharray="4 3" />
      <circle cx={40} cy={36} r={4} stroke={C.rose} strokeWidth={1.4} />
      <circle cx={56} cy={36} r={4} stroke={C.amber} strokeWidth={1.4} />
      <circle cx={72} cy={36} r={4} stroke={C.emerald} strokeWidth={1.4} />
      <Label x={96} y={40} fill={C.muted} size={9}>
        {pageTitle ?? `${title} · app`}
      </Label>
      {/* Sidebar */}
      <RoughRect x={20} y={52} w={128} h={368} stroke={C.teal} dash="5 3" sw={1.4} rx={0} />
      <Label x={36} y={78} fill={C.teal} size={10}>
        {title.toUpperCase()}
      </Label>
      <path d="M36 88 H 128" stroke={C.teal} strokeWidth={1} strokeDasharray="3 2" opacity={0.5} />
      {nav.map((item, i) => (
        <g key={item}>
          <RoughRect
            x={32}
            y={100 + i * 34}
            w={104}
            h={26}
            stroke={i === 0 ? C.cyan : C.muted}
            dash={i === 0 ? "3 2" : "4 3"}
            sw={i === 0 ? 1.6 : 1.1}
            rx={6}
          />
          <Label
            x={42}
            y={117 + i * 34}
            fill={i === 0 ? C.cyan : C.muted}
            size={9}
          >
            {item}
          </Label>
        </g>
      ))}
      {/* Main canvas guide */}
      <path d="M148 64 H 604" stroke={C.muted} strokeWidth={1} strokeDasharray="3 4" opacity={0.4} />
      <g transform="translate(160 64)">{children}</g>
    </>
  );
}

function GridHints({
  x,
  y,
  w,
  h,
  step = 24,
  stroke = C.muted,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  step?: number;
  stroke?: string;
}) {
  const lines: ReactNode[] = [];
  for (let gx = x + step; gx < x + w; gx += step) {
    lines.push(
      <path
        key={`v${gx}`}
        d={`M ${gx} ${y} V ${y + h}`}
        stroke={stroke}
        strokeWidth={0.7}
        opacity={0.25}
      />,
    );
  }
  for (let gy = y + step; gy < y + h; gy += step) {
    lines.push(
      <path
        key={`h${gy}`}
        d={`M ${x} ${gy} H ${x + w}`}
        stroke={stroke}
        strokeWidth={0.7}
        opacity={0.25}
      />,
    );
  }
  return <g>{lines}</g>;
}

function ChartLine({
  d,
  stroke,
  dash,
}: {
  d: string;
  stroke: string;
  dash?: string;
}) {
  return (
    <path
      d={d}
      stroke={stroke}
      strokeWidth={2}
      strokeDasharray={dash}
      strokeLinecap="round"
    />
  );
}

/* —— Screens —— */

function VoicepulseBrand() {
  return (
    <Pad>
      <RoughRect x={40} y={40} w={560} h={360} stroke={C.ink} dash="10 6" />
      <Label x={70} y={100} fill={C.cyan} size={13}>
        VOICEPULSE AI
      </Label>
      <path
        d="M70 130 H 360"
        stroke={C.teal}
        strokeWidth={2}
        strokeDasharray="6 3"
      />
      <Label x={70} y={170} fill={C.ink} size={14}>
        From conversations to insights
      </Label>
      {[
        [70, 220, "Transcription"],
        [220, 220, "Speaker ID"],
        [370, 220, "Sentiment"],
        [70, 280, "Emotion"],
        [220, 280, "Review"],
        [370, 280, "Coaching"],
      ].map(([x, y, t], i) => (
        <g key={t as string}>
          <circle
            cx={(x as number) + 10}
            cy={(y as number) - 4}
            r={8}
            stroke={[C.teal, C.cyan, C.amber, C.emerald, C.rose, C.teal][i]}
            strokeWidth={1.5}
            strokeDasharray="3 2"
          />
          <Label x={(x as number) + 28} y={y as number} size={11}>
            {t as string}
          </Label>
        </g>
      ))}
      <path
        d="M420 120 C 460 90, 520 100, 540 140 S 500 220, 460 200"
        stroke={C.cyan}
        strokeWidth={2}
        strokeDasharray="5 4"
      />
    </Pad>
  );
}

function VoicepulseDashboard() {
  return (
    <Pad>
      <ShellSketch
        title="VoicePulse"
        nav={["Dashboard", "Upload", "Analysis", "Reports", "Settings"]}
        pageTitle="voicepulse · dashboard"
      >
        {[0, 1, 2, 3].map((i) => (
          <g key={i}>
            <RoughRect
              x={i * 108}
              y={0}
              w={100}
              h={72}
              stroke={[C.teal, C.cyan, C.amber, C.rose][i]}
              dash="5 3"
            />
            <Label x={i * 108 + 12} y={22} fill={C.muted} size={8}>
              {["TOTAL CALLS", "AVG RATING", "POSITIVE", "ESCALATIONS"][i]}
            </Label>
            <Label x={i * 108 + 12} y={46} size={16}>
              {["248", "4.2/5", "76%", "6"][i]}
            </Label>
            <path
              d={`M${i * 108 + 12} ${58} h 40`}
              stroke={[C.emerald, C.emerald, C.emerald, C.rose][i]}
              strokeWidth={2}
              strokeLinecap="round"
            />
            <Label x={i * 108 + 58} y={62} fill={C.muted} size={8}>
              {["+12%", "+0.3", "+4%", "-2"][i]}
            </Label>
          </g>
        ))}
        <RoughRect x={0} y={90} w={250} h={160} stroke={C.teal} dash="6 4" />
        <Label x={12} y={110} fill={C.teal} size={9}>
          CALL PERFORMANCE TREND
        </Label>
        <GridHints x={16} y={120} w={220} h={110} step={28} />
        <ChartLine
          d="M24 210 C 60 190, 90 160, 130 165 S 190 130, 240 140"
          stroke={C.cyan}
        />
        <ChartLine
          d="M24 220 C 70 200, 110 185, 160 190 S 210 170, 240 175"
          stroke={C.amber}
          dash="4 3"
        />
        <circle cx={130} cy={165} r={4} stroke={C.cyan} strokeWidth={1.5} />
        <circle cx={240} cy={140} r={4} stroke={C.amber} strokeWidth={1.5} />
        <Label x={20} y={238} fill={C.muted} size={8}>
          Mon
        </Label>
        <Label x={210} y={238} fill={C.muted} size={8}>
          Sun
        </Label>
        <RoughRect x={266} y={90} w={180} h={160} stroke={C.ink} dash="5 4" />
        <Label x={278} y={110} fill={C.muted} size={9}>
          RECENT CALLS
        </Label>
        {["CP-122  Sara  ★4.8", "CP-121  Ali   ★4.1", "CP-120  Noor  ★3.6", "CP-119  Zain  ★4.4"].map(
          (row, i) => (
            <g key={row}>
              <path
                d={`M278 ${128 + i * 28} H 430`}
                stroke={C.muted}
                strokeWidth={1}
                strokeDasharray="3 3"
                opacity={0.5}
              />
              <Label x={278} y={140 + i * 28} size={9}>
                {row}
              </Label>
              <circle
                cx={420}
                cy={136 + i * 28}
                r={4}
                stroke={[C.emerald, C.amber, C.rose, C.emerald][i]}
                strokeWidth={1.3}
              />
            </g>
          ),
        )}
      </ShellSketch>
    </Pad>
  );
}

function VoicepulseAnalysis() {
  return (
    <Pad>
      <ShellSketch
        title="VoicePulse"
        nav={["Dashboard", "Upload", "Analysis", "Reports"]}
        pageTitle="voicepulse · call CP-00122"
      >
        <Label x={0} y={12} fill={C.muted} size={9}>
          CP-00122 · 8m 42s · Agent Sara
        </Label>
        <RoughRect x={280} y={0} w={70} h={20} stroke={C.amber} dash="3 2" rx={8} />
        <Label x={290} y={14} fill={C.amber} size={9}>
          4.8 / 5
        </Label>
        <RoughRect x={0} y={28} w={440} h={44} stroke={C.cyan} dash="4 3" rx={8} />
        {[18, 28, 42, 30, 50, 34, 46, 22, 55, 36, 28, 48, 32, 40, 20, 38, 44, 26].map(
          (h, i) => (
            <line
              key={i}
              x1={16 + i * 22}
              y1={50 - h / 2}
              x2={16 + i * 22}
              y2={50 + h / 2}
              stroke={C.cyan}
              strokeWidth={2}
              strokeLinecap="round"
            />
          ),
        )}
        <circle cx={140} cy={50} r={5} stroke={C.teal} strokeWidth={1.5} />
        {["Transcript", "Speakers", "Emotion", "Sentiment", "Summary"].map(
          (t, i) => (
            <g key={t}>
              <RoughRect
                x={i * 88}
                y={84}
                w={80}
                h={22}
                stroke={i === 0 ? C.teal : C.muted}
                dash="3 2"
                rx={6}
              />
              <Label
                x={i * 88 + 10}
                y={99}
                fill={i === 0 ? C.teal : C.muted}
                size={8}
              >
                {t}
              </Label>
            </g>
          ),
        )}
        <RoughRect x={0} y={118} w={230} h={140} stroke={C.teal} dash="5 3" />
        <RoughRect x={14} y={134} w={160} h={40} stroke={C.teal} dash="4 2" rx={10} />
        <Label x={24} y={150} fill={C.teal} size={8}>
          AGENT · 0:12
        </Label>
        <Label x={24} y={164} size={9}>
          How can I help today?
        </Label>
        <RoughRect x={50} y={186} w={160} h={40} stroke={C.cyan} dash="4 2" rx={10} />
        <Label x={60} y={202} fill={C.cyan} size={8}>
          CUSTOMER · 0:18
        </Label>
        <Label x={60} y={216} size={9}>
          Update my billing address
        </Label>
        <RoughRect x={250} y={118} w={190} h={64} stroke={C.amber} dash="5 3" />
        <Label x={262} y={138} fill={C.amber} size={8}>
          EMOTION
        </Label>
        {[
          ["Happy", 0.62, C.emerald],
          ["Neutral", 0.28, C.muted],
          ["Frustrated", 0.1, C.rose],
        ].map(([label, pct, stroke], i) => (
          <g key={label as string}>
            <Label x={262} y={154 + i * 10} size={7} fill={C.muted}>
              {label as string}
            </Label>
            <path
              d={`M310 ${150 + i * 10} h ${(pct as number) * 110}`}
              stroke={stroke as string}
              strokeWidth={3}
              strokeLinecap="round"
            />
          </g>
        ))}
        <RoughRect x={250} y={192} w={190} h={66} stroke={C.emerald} dash="5 3" />
        <Label x={262} y={212} fill={C.emerald} size={8}>
          COACHING TIP
        </Label>
        <Label x={262} y={230} size={9}>
          Confirm address + recap
        </Label>
        <Label x={262} y={244} size={9}>
          next steps before close
        </Label>
      </ShellSketch>
    </Pad>
  );
}

function VoicepulseFeatures() {
  return (
    <Pad>
      <RoughRect x={40} y={50} w={260} h={320} stroke={C.teal} dash="7 4" />
      <Label x={60} y={84} fill={C.teal} size={11}>
        KEY FEATURES
      </Label>
      {[
        "Upload",
        "Speaker ID",
        "Sentiment",
        "Emotion",
        "AI review",
        "Coaching",
      ].map((f, i) => (
        <g key={f}>
          <circle
            cx={70}
            cy={120 + i * 36}
            r={5}
            stroke={C.cyan}
            strokeWidth={1.5}
          />
          <Label x={90} y={124 + i * 36} size={12}>
            {f}
          </Label>
        </g>
      ))}
      <RoughRect x={340} y={50} w={260} h={320} stroke={C.amber} dash="7 4" />
      <Label x={360} y={84} fill={C.amber} size={11}>
        TECH STACK
      </Label>
      {["FastAPI", "WhisperX", "pyannote", "Librosa", "VADER", "Groq"].map(
        (s, i) => (
          <RoughRect
            key={s}
            x={360 + (i % 2) * 110}
            y={110 + Math.floor(i / 2) * 70}
            w={100}
            h={48}
            stroke={[C.teal, C.cyan, C.amber, C.emerald, C.rose, C.teal][i]}
            dash="4 3"
          />
        ),
      )}
      {[
        [380, 140, "FastAPI"],
        [490, 140, "WhisperX"],
        [380, 210, "pyannote"],
        [490, 210, "Librosa"],
        [380, 280, "VADER"],
        [490, 280, "Groq"],
      ].map(([x, y, t]) => (
        <Label key={t as string} x={x as number} y={y as number} size={11}>
          {t as string}
        </Label>
      ))}
    </Pad>
  );
}

function FleetDashboard() {
  return (
    <Pad>
      <ShellSketch
        title="FleetTrack"
        nav={["Dashboard", "Vehicles", "Routes", "Alerts", "Maintenance"]}
        pageTitle="fleettrack · portal"
      >
        {[0, 1, 2].map((i) => (
          <g key={i}>
            <RoughRect
              x={i * 148}
              y={0}
              w={138}
              h={76}
              stroke={[C.teal, C.cyan, C.amber][i]}
            />
            <Label x={i * 148 + 14} y={24} fill={C.muted} size={8}>
              {["ACTIVE VEHICLES", "FUEL TODAY", "DAILY DISTANCE"][i]}
            </Label>
            <Label x={i * 148 + 14} y={50} size={18}>
              {["4 / 5", "86 L", "312 km"][i]}
            </Label>
            <path
              d={`M${i * 148 + 14} ${62} h 50`}
              stroke={[C.emerald, C.cyan, C.teal][i]}
              strokeWidth={2}
            />
          </g>
        ))}
        <RoughRect x={0} y={96} w={250} h={170} stroke={C.cyan} />
        <Label x={12} y={116} fill={C.cyan} size={9}>
          WEEKLY FUEL UTILIZATION
        </Label>
        <GridHints x={16} y={126} w={220} h={120} step={26} />
        <ChartLine
          d="M28 220 C 70 200, 110 170, 150 185 S 210 150, 235 160"
          stroke={C.teal}
        />
        <circle cx={150} cy={185} r={5} stroke={C.amber} strokeWidth={2} />
        <Label x={20} y={255} fill={C.muted} size={8}>
          W1
        </Label>
        <Label x={210} y={255} fill={C.muted} size={8}>
          W4
        </Label>
        <RoughRect x={268} y={96} w={172} h={170} stroke={C.amber} />
        <Label x={280} y={116} fill={C.amber} size={9}>
          STATUS MIX
        </Label>
        <circle
          cx={354}
          cy={190}
          r={48}
          stroke={C.teal}
          strokeWidth={3}
          strokeDasharray="12 6"
        />
        <path
          d="M354 142 A48 48 0 0 1 390 210"
          stroke={C.cyan}
          strokeWidth={4}
          strokeLinecap="round"
        />
        <path
          d="M390 210 A48 48 0 0 1 330 220"
          stroke={C.amber}
          strokeWidth={4}
          strokeLinecap="round"
        />
        <Label x={280} y={250} fill={C.muted} size={8}>
          Active 80% · Idle 15%
        </Label>
      </ShellSketch>
    </Pad>
  );
}

function FleetVehicle() {
  return (
    <Pad>
      <ShellSketch title="FleetTrack" nav={["My Vehicle", "Dashboard"]}>
        <RoughRect x={0} y={0} w={200} h={240} stroke={C.teal} />
        <path
          d="M40 140 H 160 M40 140 Q 100 70 160 140 M55 140 V 170 H 145 V 140"
          stroke={C.ink}
          strokeWidth={1.8}
          strokeDasharray="5 3"
        />
        <Label x={20} y={40} fill={C.teal} size={10}>
          MODEL S
        </Label>
        <RoughRect x={20} y={180} w={70} h={40} stroke={C.emerald} />
        <RoughRect x={110} y={180} w={70} h={40} stroke={C.cyan} />
        <Label x={30} y={205} size={10}>
          90%
        </Label>
        <Label x={120} y={205} size={10}>
          95%
        </Label>
        <RoughRect x={220} y={0} w={210} h={240} stroke={C.cyan} />
        <path
          d="M250 180 C 290 100, 330 200, 370 120 S 410 80, 420 140"
          stroke={C.teal}
          strokeWidth={2.2}
        />
        <circle cx={370} cy={120} r={6} stroke={C.amber} strokeWidth={2} />
      </ShellSketch>
    </Pad>
  );
}

function FleetRoutes() {
  return (
    <Pad>
      <ShellSketch
        title="FleetTrack"
        nav={["Trip Routes", "Playback", "Dashboard"]}
        pageTitle="fleettrack · trips"
      >
        <RoughRect x={0} y={0} w={260} h={270} stroke={C.cyan} />
        <GridHints x={10} y={10} w={240} h={250} step={20} stroke={C.cyan} />
        <path
          d="M30 220 C 70 80, 120 230, 170 100 S 230 60, 250 160"
          stroke={C.teal}
          strokeWidth={2.6}
        />
        <path
          d="M40 200 C 90 150, 130 200, 190 120"
          stroke={C.amber}
          strokeWidth={2}
          strokeDasharray="5 3"
        />
        <circle cx={170} cy={100} r={6} stroke={C.teal} strokeWidth={2} />
        <circle cx={190} cy={120} r={5} stroke={C.amber} strokeWidth={2} />
        <Label x={16} y={24} fill={C.cyan} size={8}>
          MAP · LIVE PATHS
        </Label>
        <RoughRect x={276} y={0} w={164} h={270} stroke={C.ink} />
        <Label x={290} y={24} fill={C.muted} size={9}>
          TRIP LIST
        </Label>
        {[
          ["Morning loop", "42 km · 08:12"],
          ["Airport run", "28 km · 11:40"],
          ["Depot return", "19 km · 16:05"],
          ["Night shift", "51 km · 21:10"],
        ].map(([name, meta], i) => (
          <g key={name}>
            <RoughRect
              x={288}
              y={40 + i * 54}
              w={140}
              h={46}
              stroke={[C.teal, C.cyan, C.amber, C.emerald][i]}
              dash="4 3"
            />
            <Label x={300} y={58 + i * 54} size={10}>
              {name}
            </Label>
            <Label x={300} y={74 + i * 54} fill={C.muted} size={8}>
              {meta}
            </Label>
          </g>
        ))}
      </ShellSketch>
    </Pad>
  );
}

function FleetPlayback() {
  return (
    <Pad>
      <ShellSketch
        title="FleetTrack"
        nav={["Live Playback", "Routes", "Alerts"]}
        pageTitle="fleettrack · playback"
      >
        <RoughRect x={0} y={0} w={440} h={190} stroke={C.teal} />
        <GridHints x={12} y={12} w={416} h={166} step={22} />
        <path
          d="M40 150 C 100 60, 180 170, 260 70 S 360 50, 410 120"
          stroke={C.cyan}
          strokeWidth={2.8}
        />
        <circle cx={260} cy={70} r={8} stroke={C.amber} strokeWidth={2} />
        <Label x={270} y={66} fill={C.amber} size={8}>
          t=09:42
        </Label>
        <Label x={16} y={24} fill={C.teal} size={8}>
          UNIT 02 · REPLAY
        </Label>
        <RoughRect x={0} y={210} w={440} h={56} stroke={C.amber} />
        <Label x={16} y={232} fill={C.muted} size={8}>
          0:00
        </Label>
        <path
          d="M50 236 H 390"
          stroke={C.muted}
          strokeWidth={2.5}
          strokeDasharray="3 3"
        />
        <circle cx={190} cy={236} r={9} stroke={C.teal} strokeWidth={2} />
        <path d="M190 227 V 245" stroke={C.teal} strokeWidth={1.5} />
        <Label x={400} y={232} fill={C.muted} size={8}>
          18:40
        </Label>
      </ShellSketch>
    </Pad>
  );
}

function FleetAlerts() {
  return (
    <Pad>
      <ShellSketch
        title="FleetTrack"
        nav={["Alerts", "Dashboard", "Vehicles"]}
        pageTitle="fleettrack · alerts"
      >
        <Label x={0} y={12} fill={C.muted} size={9}>
          LIVE ALERT FEED · last 2h
        </Label>
        {[
          [C.rose, "CRITICAL", "Overheating", "Unit 04", "2m ago"],
          [C.amber, "WARNING", "Low fuel", "Unit 02", "14m ago"],
          [C.amber, "WARNING", "Idle timeout", "Unit 01", "31m ago"],
          [C.cyan, "INFO", "Geofence exit", "Unit 03", "1h ago"],
        ].map(([stroke, sev, title, unit, when], i) => (
          <g key={title as string}>
            <RoughRect
              x={0}
              y={28 + i * 58}
              w={440}
              h={50}
              stroke={stroke as string}
              dash="5 3"
            />
            <RoughRect
              x={12}
              y={40 + i * 58}
              w={70}
              h={18}
              stroke={stroke as string}
              dash="3 2"
              rx={6}
            />
            <Label x={20} y={53 + i * 58} fill={stroke as string} size={8}>
              {sev as string}
            </Label>
            <Label x={96} y={48 + i * 58} size={12}>
              {title as string}
            </Label>
            <Label x={96} y={64 + i * 58} fill={C.muted} size={9}>
              {`${unit} · ${when}`}
            </Label>
            <circle
              cx={410}
              cy={53 + i * 58}
              r={5}
              stroke={stroke as string}
              strokeWidth={1.5}
            />
          </g>
        ))}
      </ShellSketch>
    </Pad>
  );
}

function FleetMaintenance() {
  return (
    <Pad>
      <ShellSketch
        title="FleetTrack"
        nav={["Maintenance", "Baseline", "Reports"]}
        pageTitle="fleettrack · maintenance"
      >
        {[0, 1, 2].map((i) => (
          <g key={i}>
            <RoughRect
              x={i * 148}
              y={0}
              w={138}
              h={68}
              stroke={[C.teal, C.amber, C.rose][i]}
            />
            <Label x={i * 148 + 14} y={24} fill={C.muted} size={8}>
              {["DUE SOON", "EST. COST", "OVERDUE"][i]}
            </Label>
            <Label x={i * 148 + 14} y={48} size={16}>
              {["3 jobs", "$1.2k", "1 unit"][i]}
            </Label>
          </g>
        ))}
        <RoughRect x={0} y={88} w={440} h={180} stroke={C.cyan} />
        <Label x={14} y={110} fill={C.cyan} size={9}>
          MONTHLY MAINTENANCE TREND
        </Label>
        <GridHints x={20} y={120} w={400} h={130} step={40} />
        {[42, 70, 48, 92, 60, 84, 55, 98].map((h, i) => (
          <g key={i}>
            <line
              x1={44 + i * 48}
              y1={240}
              x2={44 + i * 48}
              y2={240 - h}
              stroke={i % 2 ? C.teal : C.amber}
              strokeWidth={8}
              strokeLinecap="round"
            />
            <Label x={36 + i * 48} y={258} fill={C.muted} size={7}>
              {["J", "F", "M", "A", "M", "J", "J", "A"][i]}
            </Label>
          </g>
        ))}
      </ShellSketch>
    </Pad>
  );
}

function FleetPicker() {
  return (
    <Pad>
      <ShellSketch title="FleetTrack" nav={["Vehicles", "Dashboard"]}>
        {["Model S · 01", "Model X · 02", "Van · 03", "Van · 04"].map(
          (name, i) => (
            <g key={name}>
              <RoughRect
                x={0}
                y={i * 58}
                w={430}
                h={48}
                stroke={i < 2 ? C.emerald : C.muted}
              />
              <circle
                cx={28}
                cy={24 + i * 58}
                r={6}
                stroke={i < 2 ? C.emerald : C.muted}
                strokeWidth={2}
              />
              <Label x={50} y={28 + i * 58} size={12}>
                {name}
              </Label>
            </g>
          ),
        )}
      </ShellSketch>
    </Pad>
  );
}

function CourseSearch() {
  return (
    <Pad>
      <RoughRect x={80} y={50} w={480} h={40} stroke={C.teal} dash="6 3" rx={20} />
      <Label x={110} y={75} fill={C.muted} size={11}>
        Search institutions, courses…
      </Label>
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <RoughRect
            x={80 + (i % 2) * 250}
            y={120 + Math.floor(i / 2) * 130}
            w={230}
            h={110}
            stroke={[C.teal, C.cyan, C.amber, C.emerald][i]}
          />
          <path
            d={`M${100 + (i % 2) * 250} ${150 + Math.floor(i / 2) * 130} H ${280 + (i % 2) * 250}`}
            stroke={C.muted}
            strokeDasharray="4 3"
          />
        </g>
      ))}
    </Pad>
  );
}

function CourseFilters() {
  return (
    <Pad>
      <RoughRect x={50} y={50} w={180} h={320} stroke={C.amber} />
      <Label x={70} y={80} fill={C.amber} size={10}>
        FILTERS
      </Label>
      {[0, 1, 2, 3].map((i) => (
        <RoughRect
          key={i}
          x={70}
          y={100 + i * 55}
          w={140}
          h={40}
          stroke={C.teal}
          dash="4 3"
        />
      ))}
      <RoughRect x={260} y={50} w={330} h={320} stroke={C.cyan} />
      {[0, 1, 2, 3, 4].map((i) => (
        <path
          key={i}
          d={`M280 ${100 + i * 45} H 560`}
          stroke={C.muted}
          strokeWidth={1.4}
          strokeDasharray="5 4"
        />
      ))}
    </Pad>
  );
}

function CourseDetail() {
  return (
    <Pad>
      <RoughRect x={80} y={50} w={480} h={90} stroke={C.cyan} dash="8 4" />
      <Label x={100} y={100} size={16}>
        Applied Data Science
      </Label>
      {[0, 1, 2].map((i) => (
        <RoughRect
          key={i}
          x={80 + i * 165}
          y={170}
          w={150}
          h={70}
          stroke={[C.teal, C.amber, C.emerald][i]}
        />
      ))}
      <RoughRect x={80} y={270} w={480} h={90} stroke={C.ink} dash="5 4" />
      <Label x={100} y={320} fill={C.muted} size={11}>
        Fields from MySQL via FastAPI
      </Label>
    </Pad>
  );
}

function CampusChat() {
  return (
    <Pad>
      <ShellSketch
        title="Campus Admin"
        nav={["Chat", "Tools", "Knowledge"]}
      >
        <RoughRect x={20} y={20} w={220} h={50} stroke={C.teal} rx={12} />
        <Label x={36} y={50} size={10}>
          Which rooms are free Friday?
        </Label>
        <RoughRect x={120} y={90} w={240} h={50} stroke={C.cyan} rx={12} />
        <Label x={136} y={120} size={10}>
          Checking tools + RAG…
        </Label>
        <RoughRect x={0} y={200} w={430} h={40} stroke={C.amber} rx={20} />
      </ShellSketch>
    </Pad>
  );
}

function CampusTools() {
  return (
    <Pad>
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <circle
            cx={120}
            cy={80 + i * 80}
            r={22}
            stroke={[C.teal, C.cyan, C.amber, C.emerald][i]}
            strokeWidth={2}
            strokeDasharray="4 3"
          />
          {i < 3 ? (
            <path
              d={`M120 ${102 + i * 80} V ${138 + i * 80}`}
              stroke={C.muted}
              strokeDasharray="3 3"
            />
          ) : null}
        </g>
      ))}
      <Label x={160} y={86} size={12}>
        Prompt
      </Label>
      <Label x={160} y={166} size={12}>
        OpenAI tools
      </Label>
      <Label x={160} y={246} size={12}>
        Tool result
      </Label>
      <Label x={160} y={326} size={12}>
        Reply
      </Label>
      <RoughRect x={360} y={80} w={200} h={260} stroke={C.ink} dash="6 4" />
      {["list_rooms", "query_mongo", "rag_search"].map((t, i) => (
        <Label key={t} x={380} y={130 + i * 50} fill={C.cyan} size={11}>
          {`${t}()`}
        </Label>
      ))}
    </Pad>
  );
}

function FlightChat() {
  return (
    <Pad>
      <RoughRect x={60} y={60} w={520} h={320} stroke={C.cyan} dash="9 5" />
      <Label x={90} y={110} fill={C.cyan} size={11}>
        FLIGHTMATE · CHAT
      </Label>
      <RoughRect x={90} y={140} w={280} h={50} stroke={C.teal} rx={12} />
      <Label x={110} y={170} size={10}>
        Check LHE → KHI tomorrow
      </Label>
      <RoughRect x={260} y={220} w={280} h={50} stroke={C.amber} rx={12} />
      <Label x={280} y={250} size={10}>
        Intent → check agent
      </Label>
    </Pad>
  );
}

function FlightCheck() {
  return (
    <Pad>
      {[0, 1, 2].map((i) => (
        <RoughRect
          key={i}
          x={80}
          y={70 + i * 100}
          w={480}
          h={80}
          stroke={[C.teal, C.cyan, C.amber][i]}
        />
      ))}
      <Label x={110} y={115} size={14}>
        PK-301 · 07:40
      </Label>
      <Label x={110} y={215} size={14}>
        PK-305 · 13:10
      </Label>
      <Label x={110} y={315} size={14}>
        PA-210 · 19:25
      </Label>
    </Pad>
  );
}

function FlightBook() {
  return (
    <Pad>
      <Label x={80} y={70} fill={C.teal} size={12}>
        BOOKING AGENT
      </Label>
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <circle
            cx={100}
            cy={120 + i * 70}
            r={16}
            stroke={C.cyan}
            strokeWidth={1.8}
            strokeDasharray="3 2"
          />
          <Label x={96} y={124 + i * 70} size={11}>
            {String(i + 1)}
          </Label>
          <RoughRect
            x={140}
            y={100 + i * 70}
            w={360}
            h={40}
            stroke={C.teal}
            dash="5 3"
          />
        </g>
      ))}
      <RoughRect x={80} y={340} w={480} h={44} stroke={C.amber} dash="4 2" />
      <Label x={250} y={368} fill={C.amber} size={12}>
        CONFIRM BOOKING
      </Label>
    </Pad>
  );
}

function FlightCli() {
  return (
    <Pad>
      <RoughRect x={50} y={50} w={540} h={340} stroke={C.emerald} dash="8 5" />
      <Label x={80} y={100} fill={C.emerald} size={11}>
        $ poetry run python app/cli_agent.py
      </Label>
      <Label x={80} y={150} fill={C.cyan} size={11}>
        &gt; Book ISB → DXB tomorrow
      </Label>
      <Label x={80} y={200} fill={C.muted} size={11}>
        routing → book agent · groq
      </Label>
      <path
        d="M80 240 H 100"
        stroke={C.amber}
        strokeWidth={2}
        strokeDasharray="4 4"
      />
    </Pad>
  );
}

function UniForm() {
  return (
    <Pad>
      <Label x={80} y={70} size={14}>
        Student registration
      </Label>
      {[0, 1, 2, 3].map((i) => (
        <RoughRect
          key={i}
          x={80}
          y={100 + i * 60}
          w={480}
          h={44}
          stroke={[C.teal, C.cyan, C.amber, C.emerald][i]}
          dash="5 3"
        />
      ))}
    </Pad>
  );
}

function UniApi() {
  return (
    <Pad>
      <RoughRect x={60} y={60} w={520} h={320} stroke={C.ink} dash="7 5" />
      <Label x={90} y={120} fill={C.teal} size={13}>
        POST /register
      </Label>
      <RoughRect x={90} y={140} w={400} h={70} stroke={C.cyan} dash="4 3" />
      <Label x={90} y={260} fill={C.amber} size={13}>
        {`GET /students/{id}`}
      </Label>
      <RoughRect x={90} y={280} w={400} h={60} stroke={C.emerald} dash="4 3" />
    </Pad>
  );
}

function UniConfirm() {
  return (
    <Pad>
      <circle
        cx={320}
        cy={150}
        r={40}
        stroke={C.emerald}
        strokeWidth={2.5}
        strokeDasharray="6 4"
      />
      <path
        d="M300 150 L 314 164 L 345 130"
        stroke={C.emerald}
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Label x={230} y={230} size={14}>
        Registration confirmed
      </Label>
      <RoughRect x={160} y={260} w={320} h={80} stroke={C.teal} dash="5 3" />
      <Label x={190} y={305} fill={C.muted} size={11}>
        {`{ id: stu_1842, status: ok }`}
      </Label>
    </Pad>
  );
}

function ShopCatalog() {
  return (
    <Pad>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <RoughRect
          key={i}
          x={70 + (i % 3) * 170}
          y={60 + Math.floor(i / 3) * 170}
          w={150}
          h={150}
          stroke={[C.teal, C.cyan, C.amber, C.emerald, C.rose, C.teal][i]}
          dash="5 3"
        />
      ))}
    </Pad>
  );
}

function ShopCart() {
  return (
    <Pad>
      {[0, 1, 2].map((i) => (
        <RoughRect
          key={i}
          x={80}
          y={70 + i * 80}
          w={480}
          h={60}
          stroke={[C.teal, C.cyan, C.amber][i]}
        />
      ))}
      <path
        d="M80 330 H 560"
        stroke={C.ink}
        strokeWidth={1.5}
        strokeDasharray="6 4"
      />
      <Label x={100} y={365} size={13}>
        Total
      </Label>
      <Label x={480} y={365} fill={C.teal} size={13}>
        $96
      </Label>
    </Pad>
  );
}

function ShopCheckout() {
  return (
    <Pad>
      {[0, 1, 2].map((i) => (
        <RoughRect
          key={i}
          x={100}
          y={80 + i * 80}
          w={440}
          h={60}
          stroke={i === 0 ? C.teal : C.muted}
          dash={i === 0 ? "4 2" : "6 4"}
          sw={i === 0 ? 2 : 1.4}
        />
      ))}
      <Label x={130} y={115} size={12}>
        1 · Shipping
      </Label>
      <Label x={130} y={195} size={12}>
        2 · Billing
      </Label>
      <Label x={130} y={275} size={12}>
        3 · Review
      </Label>
      <RoughRect x={100} y={340} w={440} h={44} stroke={C.amber} />
    </Pad>
  );
}

function ShopAdmin() {
  return (
    <Pad>
      <ShellSketch title="Store Admin" nav={["Products", "Orders", "Stock"]}>
        {[0, 1, 2, 3].map((i) => (
          <RoughRect
            key={i}
            x={0}
            y={i * 55}
            w={430}
            h={44}
            stroke={[C.teal, C.cyan, C.amber, C.emerald][i]}
            dash="5 3"
          />
        ))}
      </ShellSketch>
    </Pad>
  );
}

function AtmosDashboard() {
  return (
    <Pad>
      <RoughRect x={50} y={50} w={300} h={320} stroke={C.teal} dash="7 4" />
      <Label x={80} y={100} fill={C.teal} size={12}>
        ATMOS
      </Label>
      <Label x={80} y={160} size={36}>
        22°
      </Label>
      <Label x={80} y={200} fill={C.muted} size={11}>
        Lahore · cloudy
      </Label>
      {[0, 1, 2, 3].map((i) => (
        <RoughRect
          key={i}
          x={80 + i * 55}
          y={240}
          w={48}
          h={80}
          stroke={C.cyan}
          dash="3 2"
        />
      ))}
      <RoughRect x={380} y={50} w={210} h={320} stroke={C.amber} dash="7 4" />
      <Label x={400} y={100} fill={C.amber} size={10}>
        ASK ATMOS
      </Label>
      <RoughRect x={400} y={130} w={170} h={100} stroke={C.cyan} rx={12} />
    </Pad>
  );
}

function AtmosForecast() {
  return (
    <Pad>
      <Label x={60} y={60} fill={C.cyan} size={11}>
        7-DAY · OPEN-METEO
      </Label>
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <g key={i}>
          <RoughRect
            x={50 + i * 80}
            y={100}
            w={70}
            h={240}
            stroke={[C.teal, C.cyan, C.amber, C.emerald, C.teal, C.cyan, C.amber][i]}
            dash="4 3"
          />
          <circle
            cx={85 + i * 80}
            cy={220}
            r={10}
            stroke={C.cyan}
            strokeWidth={1.6}
          />
        </g>
      ))}
    </Pad>
  );
}

function AtmosSearch() {
  return (
    <Pad>
      <RoughRect x={100} y={80} w={440} h={50} stroke={C.teal} dash="5 3" rx={24} />
      <Label x={130} y={110} size={13}>
        Kar
      </Label>
      {[0, 1, 2].map((i) => (
        <path
          key={i}
          d={`M120 ${180 + i * 50} H 520`}
          stroke={C.cyan}
          strokeWidth={1.5}
          strokeDasharray="6 4"
        />
      ))}
      <Label x={130} y={175} size={12}>
        Karachi, PK
      </Label>
      <Label x={130} y={225} size={12}>
        Karaj, IR
      </Label>
      <Label x={130} y={275} size={12}>
        Karlstad, SE
      </Label>
    </Pad>
  );
}

function AtmosChat() {
  return (
    <Pad>
      <RoughRect x={70} y={70} w={500} h={280} stroke={C.ink} dash="8 5" />
      <RoughRect x={100} y={110} w={260} h={50} stroke={C.teal} rx={12} />
      <Label x={120} y={140} size={10}>
        Air quality in Lahore?
      </Label>
      <RoughRect x={250} y={190} w={280} h={60} stroke={C.cyan} rx={12} />
      <Label x={270} y={225} size={10}>
        Tool → Open-Meteo AQI
      </Label>
      <Label x={100} y={330} fill={C.amber} size={10}>
        POST /chat · Groq tools
      </Label>
    </Pad>
  );
}

const SCREENS: Record<OutlineScreenId, () => ReactNode> = {
  "voicepulse-brand": VoicepulseBrand,
  "voicepulse-dashboard": VoicepulseDashboard,
  "voicepulse-analysis": VoicepulseAnalysis,
  "voicepulse-features": VoicepulseFeatures,
  "fleet-dashboard": FleetDashboard,
  "fleet-vehicle": FleetVehicle,
  "fleet-routes": FleetRoutes,
  "fleet-playback": FleetPlayback,
  "fleet-alerts": FleetAlerts,
  "fleet-maintenance": FleetMaintenance,
  "fleet-picker": FleetPicker,
  "course-search": CourseSearch,
  "course-filters": CourseFilters,
  "course-detail": CourseDetail,
  "campus-chat": CampusChat,
  "campus-tools": CampusTools,
  "flight-chat": FlightChat,
  "flight-check": FlightCheck,
  "flight-book": FlightBook,
  "flight-cli": FlightCli,
  "uni-form": UniForm,
  "uni-api": UniApi,
  "uni-confirm": UniConfirm,
  "shop-catalog": ShopCatalog,
  "shop-cart": ShopCart,
  "shop-checkout": ShopCheckout,
  "shop-admin": ShopAdmin,
  "atmos-dashboard": AtmosDashboard,
  "atmos-forecast": AtmosForecast,
  "atmos-search": AtmosSearch,
  "atmos-chat": AtmosChat,
};

export function ProjectOutline({ screen, className }: ProjectOutlineProps) {
  const Render = SCREENS[screen];
  return (
    <div className={cn("overflow-hidden", className)}>
      <Render />
    </div>
  );
}
