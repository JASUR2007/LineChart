# AB Test — Interactive Conversion Rate Chart

Demo: 

## Technologies
- React + TypeScript
- Recharts (visualization)
- date-fns (date handling)
- html2canvas (export to PNG)
- CSS Modules for component styling

## Functions
- Conversion rate (%) per variation (Original + Variations)
- Day / Week aggregation
- Variations selector (at least one variation must be selected)
- Tooltip with vertical line + daily values
- Axes auto-adapt to visible series
- Responsive layout for 671px — 1300px and beyond
- Zoom (Brush) + Reset zoom
- Line style selector: Line / Smooth / Area
- Light / Dark theme
- Export chart to PNG
- Save the state after update: zoom, theme, aggregation, rate
## Installation
```bash
git clone https://github.com/JASUR2007/LineChart.git
cd LineChart
npm install
npm start
