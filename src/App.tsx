import { useEffect, useMemo, useState } from "react";
import dataJson from "./data/data.json";
import { DataJson } from "./types";
import { prepareDaily, aggregateByWeek, computeYDomain } from "./utils/dataHelpers";
import Chart from "./components/Chart";
import Controls from "./components/Controls";
import styles from "./App.module.css";

const palette = [
    "#FF6B6B",
    "#4D96FF",
    "#FFD166",
    "#8E44AD",
    "#2ECC71",
    "#FF7AB6"
];

function mapVariations(variations: any[]) {
    return variations.map((v: any, i: number) => ({
        key: v.id ? String(v.id) : "0",
        name: v.name,
        color: palette[i % palette.length]
    }));
}

function App() {
    const dj = dataJson as DataJson;
    const variations = useMemo(() => mapVariations(dj.variations), [dj.variations]);
    const defaultSelected = variations.map((v: any) => v.key);

    // Initialize state from localStorage
    const [granularity, setGranularity] = useState<"day" | "week">(() => {
        const saved = localStorage.getItem("granularity");
        return (saved as "day" | "week") || "day";
    });
    
    const [selectedKeys, setSelectedKeys] = useState<string[]>(() => {
        const saved = localStorage.getItem("selectedKeys");
        return saved ? JSON.parse(saved) : defaultSelected;
    });
    
    const [zoom, setZoom] = useState<number>(() => {
        const saved = localStorage.getItem("zoom");
        return saved ? parseInt(saved, 10) : 100;
    });
    
    const [lineStyle, setLineStyle] = useState<"line" | "smooth" | "area">(() => {
        const saved = localStorage.getItem("lineStyle");
        return (saved as "line" | "smooth" | "area") || "smooth";
    });
    
    const [theme, setTheme] = useState<"light" | "dark">(() => {
        const saved = localStorage.getItem("theme");
        return (saved as "light" | "dark") || "light";
    });

    // Save state to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem("granularity", granularity);
    }, [granularity]);

    useEffect(() => {
        localStorage.setItem("selectedKeys", JSON.stringify(selectedKeys));
    }, [selectedKeys]);

    useEffect(() => {
        localStorage.setItem("zoom", zoom.toString());
    }, [zoom]);

    useEffect(() => {
        localStorage.setItem("lineStyle", lineStyle);
    }, [lineStyle]);

    useEffect(() => {
        localStorage.setItem("theme", theme);
        document.documentElement.setAttribute("data-theme", theme);
    }, [theme]);

    const daily = useMemo(() => prepareDaily(dj), [dj]);
    const weekly = useMemo(() => aggregateByWeek(daily), [daily]);
    const rows = granularity === "day" ? daily : weekly;

    useEffect(() => {
        if (selectedKeys.length === 0) setSelectedKeys([variations[0].key]);
    }, [variations]);

    const toggle = (key: string) => {
        if (selectedKeys.includes(key)) {
            if (selectedKeys.length === 1) return;
            setSelectedKeys(selectedKeys.filter((k) => k !== key));
        } else {
            setSelectedKeys([...selectedKeys, key]);
        }
    };

    const yDomain = useMemo(() => computeYDomain(rows, selectedKeys), [rows, selectedKeys]);

    // export handler passed to Controls
    const handleExport = async () => {
        const el = document.getElementById("chart-root");
        if (!el) return;
        const canvas = await import("html2canvas");
        const c = await canvas.default(el);
        const url = c.toDataURL("image/png");
        const a = document.createElement("a");
        a.href = url;
        a.download = "ab-chart.png";
        a.click();
    };
    const handleZoomChange = (delta: number) => {
        setZoom(() => Math.min(300, Math.max(10, delta)));
    };
    const resetZoom = () => {
        setZoom(100);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <div className={styles.app}>
            <h1>AB Test — Conversion Rate</h1>
            <Controls
                variations={dj.variations}
                selected={selectedKeys}
                onToggle={toggle}
                granularity={granularity}
                onGranularityChange={(g) => setGranularity(g)}
                lineStyle={lineStyle}
                setLineStyle={setLineStyle}
                theme={theme}
                setTheme={setTheme}
                onExport={handleExport}
                onResetZoom={resetZoom}
                onZoomChange={handleZoomChange}
                zoom={zoom}
            />

            <Chart
                data={rows}
                variations={variations}
                selectedKeys={selectedKeys}
                lineStyle={lineStyle}
                yDomain={yDomain}
                zoom={zoom}
            />

            <footer className={styles.footer}>
                <small>Values displayed as percentages. Data source: local data.json</small>
            </footer>
        </div>
    );
}

export default App;
