import type { ReactElement, ReactNode } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const tooltipStyle = {
  borderRadius: 12,
  border: "1px solid hsl(var(--border))",
  background: "hsl(var(--popover))",
  fontSize: 13,
} as const;

interface ChartCardProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  height?: number;
  children?: ReactElement;
  className?: string;
}

export function ChartCard({ title, description, actions, height, children, className }: ChartCardProps) {
  return (
    <Card className={`glass-card ${className ?? ""}`}>
      <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
        <div className="space-y-1">
          <CardTitle className="text-base">{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </div>
        {actions}
      </CardHeader>
      <CardContent>
        <div style={{ height: height ?? 300 }} className="w-full">
          {children ? (
            <ResponsiveContainer width="100%" height="100%">
              {children}
            </ResponsiveContainer>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}

interface SeriesConfig {
  key: string;
  name: string;
  color?: string;
}

interface AxisChartProps {
  data: Array<Record<string, unknown>>;
  xKey: string;
  series: SeriesConfig[];
  height?: number;
  stacked?: boolean;
}

function axisProps() {
  return {
    tick: { fontSize: 12 },
    tickLine: false as const,
    axisLine: false as const,
    stroke: "hsl(var(--muted-foreground))",
  };
}

export function LineChartCard({ data, xKey, series, height, ...props }: AxisChartProps & ChartCardProps) {
  return (
    <ChartCard height={height} {...props}>
      <LineChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
        <XAxis dataKey={xKey} {...axisProps()} />
        <YAxis {...axisProps()} />
        <Tooltip contentStyle={tooltipStyle} />
        {series.map((s) => (
          <Line
            key={s.key}
            type="monotone"
            dataKey={s.key}
            name={s.name}
            stroke={s.color ?? "hsl(var(--primary))"}
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 5 }}
          />
        ))}
      </LineChart>
    </ChartCard>
  );
}

export function AreaChartCard({ data, xKey, series, height, stacked, ...props }: AxisChartProps & ChartCardProps) {
  return (
    <ChartCard height={height} {...props}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
        <defs>
          {series.map((s, index) => (
            <linearGradient key={s.key} id={`grad-${index}`} x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor={s.color ?? "hsl(var(--primary))"}
                stopOpacity={0.4}
              />
              <stop
                offset="95%"
                stopColor={s.color ?? "hsl(var(--primary))"}
                stopOpacity={0}
              />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
        <XAxis dataKey={xKey} {...axisProps()} />
        <YAxis {...axisProps()} />
        <Tooltip contentStyle={tooltipStyle} />
        {stacked && <Legend />}
        {series.map((s, index) => (
          <Area
            key={s.key}
            type="monotone"
            dataKey={s.key}
            name={s.name}
            stackId={stacked ? "stack" : undefined}
            stroke={s.color ?? "hsl(var(--primary))"}
            strokeWidth={2}
            fill={`url(#grad-${index})`}
          />
        ))}
      </AreaChart>
    </ChartCard>
  );
}

export function BarChartCard({ data, xKey, series, height, stacked, ...props }: AxisChartProps & ChartCardProps) {
  return (
    <ChartCard height={height} {...props}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
        <XAxis dataKey={xKey} {...axisProps()} />
        <YAxis {...axisProps()} />
        <Tooltip contentStyle={tooltipStyle} />
        {stacked && <Legend />}
        {series.map((s, index) => (
          <Bar
            key={s.key}
            dataKey={s.key}
            name={s.name}
            stackId={stacked ? "stack" : undefined}
            fill={s.color ?? `hsl(var(--chart-${(index % 5) + 1}))`}
            radius={stacked ? [0, 0, 4, 4] : [6, 6, 0, 0]}
            maxBarSize={stacked ? 32 : 44}
          />
        ))}
      </BarChart>
    </ChartCard>
  );
}

const PIE_COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

interface PieSlice {
  name: string;
  value: number;
}

export function DonutChartCard({
  data,
  height,
  ...props
}: { data: PieSlice[]; height?: number } & ChartCardProps) {
  return (
    <ChartCard height={height} {...props}>
      <PieChart>
        <Tooltip contentStyle={tooltipStyle} />
        <Legend />
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius="55%"
          outerRadius="85%"
          paddingAngle={3}
        >
          {data.map((_, index) => (
            <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    </ChartCard>
  );
}

export function PieChartCard({
  data,
  height,
  ...props
}: { data: PieSlice[]; height?: number } & ChartCardProps) {
  return (
    <ChartCard height={height} {...props}>
      <PieChart>
        <Tooltip contentStyle={tooltipStyle} />
        <Legend />
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius="85%"
        >
          {data.map((_, index) => (
            <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    </ChartCard>
  );
}

export { PIE_COLORS };
