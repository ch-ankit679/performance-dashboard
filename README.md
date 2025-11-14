# Project README

## Overview

This project is built using **Next.js**, featuring interactive dashboards, canvas-based charts, and performance‑optimized rendering. The application ensures smooth rendering even with heavy chart workloads and supports modern browsers.

---

## 🚀 Setup Instructions

### **1. Clone the Repository**

```bash
git clone https://github.com/ch-ankit679/performance-dashboard.git
cd performance-dashboard
```

### **2. Install Dependencies**

```bash
npm install
```

### **3. Start Development Server**

```bash
npm run dev
```

Your app will now run at `http://localhost:3000`.

---

## 🧪 Performance Testing Instructions

### **1. Enable React Profiler**

Open React DevTools → **Profiler** → record interactions while navigating charts.

### **2. Inspect FPS (Frames Per Second)**

Use Chrome DevTools → **Performance** tab → enable FPS meter.

### **3. Memory Usage**

Chrome DevTools → **Memory** → Take heap snapshots while interacting with different charts.

### **4. Canvas Stress Test**

Perform:

* continuous zooming
* panning
* rendering large datasets

Monitor:

* Re‑render counts
* Frame drops
* GC cycles

---

## 🌐 Browser Compatibility

Fully tested on:

* **Chrome (Recommended)**
* **Edge**
* **Firefox (Canvas performance may slightly differ)**

Not supported:

* Internet Explorer

---

## 📊 Feature Overview (With Screenshots Placeholder)

### **✔ Interactive Line Chart**

* Canvas-rendered for performance
* Smooth animations

### **✔ Bar & Scatter Charts**

* React + Canvas hybrid approach

### **✔ Heatmap Visualization**

* Optimized color‑mapping
* Intelligent canvas batching

### Screenshots

![Landing Page](./public/screenshots/landing-page.jpg)
![Dashboard](./public/screenshots/dashboard.jpg)
![Line Chart](./public/screenshots/line-chart.jpg)
![Bar Chart](./public/screenshots/bar-chart.jpg)
![Scatterplot](./public/screenshots/scatterplot.jpg)
![Heatmap](./public/screenshots/heatmap.jpg)


---

## ⚡ Next.js Performance Optimizations Used

### **1. Server-Side Rendering (SSR)**

Used for fast initial paint and SEO.

### **2. Dynamic Imports**

Large chart components lazy‑loaded:

```ts
const LineChart = dynamic(() => import("../charts/LineChart"), { ssr: false });
```

### **3. Image Optimization**

Using `next/image` for responsive and cached image delivery.

### **4. API Routes Optimization**

All expensive calculations moved to server when required.

### **5. Caching Strategies**

* Browser caching
* Server caching of static assets

---

## 📦 Project Structure

```
performance-dashboard/
├── app/
│   ├── dashboard/
│   │   ├── page.tsx              
│   │   └── layout.tsx
│   ├── api/
│   │   └── data/
│   │       └── route.ts          
│   ├── globals.css
│   └── layout.tsx
│   └── page.tsx
├── components/
│   ├── charts/
│   │   ├── LineChart.tsx
│   │   ├── BarChart.tsx
│   │   ├── ScatterPlot.tsx
│   │   └── Heatmap.tsx
│   ├── controls/
│   │   ├── FilterPanel.tsx
│   │   └── TimeRangeSelector.tsx
│   │   └── ZoomPanControls.tsx
│   ├── ui/
│   │   ├── DataTable.tsx
│   │   └── PerformanceMonitor.tsx
│   │   └── DashboardShell.tsx
│   └── providers/
│       └── DataProvider.tsx
├── hooks/
│   ├── useDataStream.ts
│   ├── useChartRenderer.ts
│   ├── usePerformanceMonitor.ts
│   └── useVirtualization.ts
├── lib/
│   ├── dataGenerator.ts
│   ├── performanceUtils.ts
│   ├── canvasUtils.ts
│   └── types.ts
├── public/
├── package.json
├── next.config.js
├── tsconfig.json
├── README.md
└── PERFORMANCE.md             
```

---

## 📬 Contact

Feel free to reach out for improvements or issues.
