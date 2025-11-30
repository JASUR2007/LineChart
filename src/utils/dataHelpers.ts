import { DataJson, PreparedRow } from "../types";
import { parseISO, startOfISOWeek, formatISO, format } from "date-fns";

export function prepareDaily(dataJson: DataJson): PreparedRow[] {
    const rows: PreparedRow[] = dataJson.data.map((r) => {
        const out: PreparedRow = { date: r.date };
        for (const variation of dataJson.variations) {
            const key = variation.id ? String(variation.id) : "0"; // Original uses "0"
            const visits = r.visits[key] ?? 0;
            const conv = r.conversions[key] ?? 0;
            const rate = visits > 0 ? (conv / visits) * 100 : 0;
            out[key] = Number(rate.toFixed(3)); // percent with 3 decimal precision
        }
        return out;
    });
    return rows;
}

export function aggregateByWeek(daily: PreparedRow[]): PreparedRow[] {
    // group by ISO week start
    const groups: Record<string, { count: number; sums: Record<string, number> }> = {};
    for (const row of daily) {
        const dt = parseISO(row.date as string);
        const weekStart = startOfISOWeek(dt); // Monday
        const key = formatISO(weekStart, { representation: "date" });
        if (!groups[key]) groups[key] = { count: 0, sums: {} };
        groups[key].count++;
        for (const k of Object.keys(row)) {
            if (k === "date") continue;
            groups[key].sums[k] = (groups[key].sums[k] || 0) + Number(row[k] as number);
        }
    }
    const out: PreparedRow[] = Object.entries(groups).map(([weekStart, v]) => {
        const row: PreparedRow = { date: weekStart };
        for (const k of Object.keys(v.sums)) {
            row[k] = Number((v.sums[k] / v.count).toFixed(3)); // average conversion rate for the week
        }
        return row;
    });
    out.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    return out;
}

export function computeYDomain(rows: PreparedRow[], selectedKeys: string[]): [number, number] {
    let min = Infinity, max = -Infinity;
    for (const r of rows) {
        for (const k of selectedKeys) {
            const v = Number(r[k] ?? NaN);
            if (isFinite(v)) {
                if (v < min) min = v;
                if (v > max) max = v;
            }
        }
    }
    if (!isFinite(min)) min = 0;
    if (!isFinite(max)) max = 1;
    // add some padding
    const padding = (max - min) * 0.1 || max * 0.1 || 1;
    return [Math.max(0, min - padding), max + padding];
}
