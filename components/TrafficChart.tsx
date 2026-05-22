"use client";

import { useEffect, useRef } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
  Colors,
  ChartData,
  ChartOptions
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
  Colors
);

interface TrafficItem {
  date: string;
  views: number;
  clicks: number;
}

interface TrafficChartProps {
  data: any; // Or your specific data type
  className?: string;
}

export default function TrafficChart({ data }: TrafficChartProps) {
  const chartRef = useRef<any>(null);

  // Format labels from YYYY-MM-DD to "MMM DD" (e.g. "May 20")
  const labels = data.map((item: any) => {
    try {
      const dateParts = item.date.split("-");
      if (dateParts.length === 3) {
        const d = new Date(Number(dateParts[0]), Number(dateParts[1]) - 1, Number(dateParts[2]));
        return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      }
    } catch (e) {}
    return item.date;
  });

  const viewsData = data.map((item) => item.views);
  const clicksData = data.map((item) => item.clicks);

  // ChartJS Data settings
  const chartData: ChartData<"line"> = {
    labels,
    datasets: [
      {
        label: "Page Views",
        data: viewsData,
        borderColor: "#06b6d4", // Brand cyan/teal
        borderWidth: 3,
        pointBackgroundColor: "#06b6d4",
        pointBorderColor: "rgba(255,255,255,0.8)",
        pointHoverRadius: 8,
        pointRadius: 4,
        tension: 0.4, // smooth bezier curves
        fill: true,
        backgroundColor: "rgba(6, 182, 212, 0.05)",
      },
      {
        label: "Clicks & Interactions",
        data: clicksData,
        borderColor: "#a855f7", // Purple
        borderWidth: 3,
        pointBackgroundColor: "#a855f7",
        pointBorderColor: "rgba(255,255,255,0.8)",
        pointHoverRadius: 8,
        pointRadius: 4,
        tension: 0.4,
        fill: true,
        backgroundColor: "rgba(168, 85, 247, 0.05)",
      },
    ],
  };

  // ChartJS Options with advanced premium configurations
  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "rgba(255, 255, 255, 0.6)",
          font: {
            family: "var(--font-outfit), sans-serif",
            weight: "bold",
            size: 11
          },
          padding: 20,
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
      tooltip: {
        backgroundColor: "rgba(15, 23, 42, 0.8)",
        titleColor: "#ffffff",
        titleFont: {
          family: "var(--font-outfit), sans-serif",
          weight: "bold",
          size: 13
        },
        bodyColor: "rgba(255, 255, 255, 0.8)",
        bodyFont: {
          family: "var(--font-inter), sans-serif",
          size: 12
        },
        borderColor: "rgba(255, 255, 255, 0.1)",
        borderWidth: 1,
        padding: 14,
        cornerRadius: 16,
        displayColors: true,
        usePointStyle: true,
      },
    },
    scales: {
      x: {
        grid: {
          color: "rgba(255, 255, 255, 0.03)",
        },
        ticks: {
          color: "rgba(255, 255, 255, 0.4)",
          font: {
            family: "var(--font-inter), sans-serif",
            size: 10,
            weight: "bold"
          },
        },
      },
      y: {
        grid: {
          color: "rgba(255, 255, 255, 0.03)",
        },
        ticks: {
          color: "rgba(255, 255, 255, 0.4)",
          font: {
            family: "var(--font-inter), sans-serif",
            size: 10,
            weight: "bold"
          },
        },
      },
    },
  };

  return (
    <div className="w-full h-full min-h-[300px]">
      <Line ref={chartRef} data={chartData} options={options} />
    </div>
  );
}
