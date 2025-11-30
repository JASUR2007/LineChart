import React, { useMemo, useRef } from "react";
import {
    ResponsiveContainer,
    LineChart as ReLineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    Legend,
    ReferenceLine,
    Brush,
    Area,
    AreaChart
} from "recharts";
import styles from "./../css/Chart.module.css";
import { PreparedRow } from "../types";
import { format } from "date-fns";
import html2canvas from "html2canvas";

type Props = {
    data: PreparedRow[];
    variations: { key: string; name: string; color: string }[];
    selectedKeys: string[];
    lineStyle: "line" | "smooth" | "area";
    yDomain: [number, number];
    onExport?: () => void;
    zoom: number
};

const formatDate = (iso: string) => {
    try {
        return format(new Date(iso), "MMM d");
    } catch {
        return iso;
    }
};

export default function Chart(props: Props) {
    const { data, variations, selectedKeys, lineStyle, yDomain, zoom } = props;
    const chartRef = useRef<HTMLDivElement | null>(null);

    const colors = new Map(variations.map((v) => [v.key, v.color]));

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (!active || !payload) return null;
        const row = data.find((r) => r.date === label);
        if (!row) return null;
        return (
            <div className={styles.tooltip}>
                <div className={styles.tooltipDate}>{formatDate(label)}</div>
                {variations
                    .filter((v) => selectedKeys.includes(v.key))
                    .map((v) => (
                        <div key={v.key} className={styles.tooltipRow}>
                            <span className={styles.dot} style={{ background: colors.get(v.key) }} />
                            <strong>{v.name}</strong>
                            <span className={styles.value}>{(Number(row[v.key] ?? 0)).toFixed(2)}%</span>
                        </div>
                    ))}
            </div>
        );
    };

    return (
        <div className={styles.chartWrap}
             ref={chartRef}
             id="chart-root"
             style={{ transform: `
             scale(${zoom / 100})`,
             transformOrigin: 'top left' }}>
            <ResponsiveContainer width="100%" height={420}>
                {lineStyle === "area" ? (
                    <AreaChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 60 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" tickFormatter={formatDate} />
                        <YAxis domain={yDomain} tickFormatter={(v) => `${Number(v).toFixed(1)}%`} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        {variations.filter((v) => selectedKeys.includes(v.key)).map((v) => (
                            <Area
                                key={v.key}
                                type="monotone"
                                dataKey={v.key}
                                name={v.name}
                                stroke={v.color}
                                fill={v.color}
                                strokeWidth={2}
                                dot={false}
                            />
                        ))}
                        <Brush dataKey="date" height={30} stroke="#8884d8" />
                    </AreaChart>
                ) : (
                    <ReLineChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 60 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" tickFormatter={formatDate} />
                        <YAxis domain={yDomain} tickFormatter={(v) => `${Number(v).toFixed(1)}%`} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        {variations.filter((v) => selectedKeys.includes(v.key)).map((v) => (
                            <Line
                                key={v.key}
                                type={lineStyle === "smooth" ? "monotone" : "linear"}
                                dataKey={v.key}
                                stroke={v.color}
                                name={v.name}
                                dot={false}
                                strokeWidth={2}
                                isAnimationActive={false}
                            />
                        ))}
                        <Brush dataKey="date" height={30} stroke="#8884d8" />
                    </ReLineChart>
                )}
            </ResponsiveContainer>
        </div>
    );
}
