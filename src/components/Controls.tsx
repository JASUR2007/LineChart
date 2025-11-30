
import styles from "./../css/Controls.module.css";
import { Variation } from "../types";

type Props = {
    variations: Variation[];
    selected: string[];
    onToggle: (key: string) => void;
    onGranularityChange: (g: "day" | "week") => void;
    granularity: "day" | "week";
    lineStyle: "line" | "smooth" | "area";
    setLineStyle: (s: "line" | "smooth" | "area") => void;
    theme: "light" | "dark";
    setTheme: (t: "light" | "dark") => void;
    onExport: () => void;
    onResetZoom: () => void;
    onZoomChange: (value: number) => void;
    zoom: number;
};

export default function Controls(props: Props) {
    const {
        variations,
        selected,
        onToggle,
        granularity,
        onGranularityChange,
        lineStyle,
        setLineStyle,
        theme,
        setTheme,
        onExport,
        onResetZoom,
        onZoomChange,
        zoom
    } = props;
    return (
        <div className={`${styles.controls} ${theme === "dark" ? styles.dark : ""}`}>
            <div className={styles.header}>
                <h3 className={styles.title}>Chart Controls</h3>
            </div>
            <div className={styles.controlsContainer}>
                <div className={styles.section}>
                    <div className={styles.blockLabel}>Variations</div>
                    <div className={styles.variations}>
                        {variations.map((v: any) => {
                            const key = String(v.id);
                            const checked = selected.includes(key);

                            return (
                                <label key={key} className={`${styles.checkbox} ${checked ? styles.checkboxChecked : ""}`}>
                                    <input type="checkbox" checked={checked} onChange={() => onToggle(key)} />

                                    <span className={styles.checkboxCustom}>
                                        <svg className={styles.checkIcon} viewBox="0 0 12 10">
                                            <path d="M1 5L4.5 8.5L11 1.5" stroke="currentColor"
                                                  strokeWidth="2" strokeLinecap="round"
                                                  strokeLinejoin="round" />
                                        </svg>
                                    </span>

                                    <span className={styles.checkboxLabel}>{v.name}</span>
                                </label>
                            );
                        })}
                    </div>
                </div>
                <div className={styles.section}>
                    <div className={styles.blockLabel}>Granularity</div>
                    <div className={styles.segment}>
                        <button className={`${styles.segmentBtn} ${granularity === "day" ? styles.active : ""}`} onClick={() => onGranularityChange("day")}>Day</button>
                        <button className={`${styles.segmentBtn} ${granularity === "week" ? styles.active : ""}`} onClick={() => onGranularityChange("week")}>Week</button>
                    </div>

                    <div className={styles.blockLabel} style={{ marginTop: "12px" }}>Line Style</div>
                    <select className={styles.select} value={lineStyle} onChange={(e) => setLineStyle(e.target.value as any)}>
                        <option value="line">Line</option>
                        <option value="smooth">Smooth</option>
                        <option value="area">Area</option>
                    </select>
                </div>
                <div className={styles.section}>
                    <div className={styles.blockLabel}>Theme</div>
                    <select className={styles.select} value={theme} onChange={(e) => setTheme(e.target.value as any)}>
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                    </select>

                    <div className={styles.blockLabel} style={{ marginTop: "12px" }}>Zoom</div>
                    <div className={styles.zoomControl}>
                        <input
                            type="range"
                            min="10"
                            max="300"
                            step="10"
                            value={zoom}
                            onChange={(e) => onZoomChange(Number(e.target.value))}
                            className={styles.zoomSlider}
                            style={{ "--zoom": `${(zoom - 10) / 290 * 100}%` } as any}
                        />
                        <span className={styles.zoomValue}>{zoom}%</span>
                    </div>
                </div>
            </div>

            <div className={styles.footer}>
                <button className={styles.btn} onClick={onResetZoom}>Reset Zoom</button>
                <button className={`${styles.btn} ${styles.primary}`} onClick={onExport}>Export PNG</button>
            </div>
        </div>
    );

}
