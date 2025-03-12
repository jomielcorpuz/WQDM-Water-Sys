import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import useSiteStatus from "@/Hooks/useSiteStatus"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useEffect, useState } from "react"
import { Loader } from "lucide-react"
import { MainchartSkeletonCard } from "./mainchartskeleton"
import { useRef } from "react";
import html2canvas from "html2canvas";
import { PDFDownloadLink } from "@react-pdf/renderer"
import ChartReport from "./ChartReportPDF"

// Define chart configuration
const chartConfig = {
  sites: {
    label: "Visitors",
  },
  potable: {
    label: "Potable",
    color: "hsl(var(--chart-2))",
  },
  nonpotable: {
    label: "Non-potable",
    color: "hsl(var(--chart-1))",
  },
}

export default function MainChart() {
  const { data: chartData, loading, error } = useSiteStatus();
  const [activeFilter, setActiveFilter] = useState("Last 30 days");
  const chartRef = useRef(null);
  const [chartImage, setChartImage] = useState(null);

  // Capture the chart as an image
  const captureChart = async () => {
    if (chartRef.current) {
      const canvas = await html2canvas(chartRef.current, {
        useCORS: true,
        scale: window.devicePixelRatio, // Improve quality
        imageTimeout: 15000, // Allow time for images to load
      });

      const imageData = canvas.toDataURL("image/png");
      setChartImage(imageData);
    }
  };


  // Function to filter chart data based on selected filter
  const filterDataByDate = (data, filter) => {
    const now = new Date()
    let filteredData = []
    switch (filter) {
      case "Last 7 days":
        filteredData = data.filter((item) => {
          const itemDate = new Date(item.date)
          return now - itemDate <= 7 * 24 * 60 * 60 * 1000 // Last 7 days
        })
        break
      case "Last 30 days":
        filteredData = data.filter((item) => {
          const itemDate = new Date(item.date)
          return now - itemDate <= 30 * 24 * 60 * 60 * 1000 // Last 30 days
        })
        break
      case "Last 3 months":
        filteredData = data.filter((item) => {
          const itemDate = new Date(item.date)
          return now - itemDate <= 90 * 24 * 60 * 60 * 1000 // Last 3 months
        })
        break
      default:
        filteredData = data
    }
    return filteredData
  }

  const filteredData = filterDataByDate(chartData, activeFilter)

  // Error and loading state handling
  if (loading) return <div className=" w-[100%] h-full justify-center"><MainchartSkeletonCard /></div>
  if (error) return <p>Error: {error}</p>
  if (!filteredData.length) return <p>No data available</p>

  return (
    <Card className="flex flex-col h-full min-h-[200px]">
      <CardHeader className="flex-row items-start space-y-0 pb-0 border-b py-5">
        <CardTitle>Water Sites Condition</CardTitle>
        <button onClick={captureChart} className="border border-input text-sm font-medium px-4 py-2 rounded-md">
          Capture Chart
        </button>
        {chartImage && (
          <PDFDownloadLink document={<ChartReport chartImage={chartImage} />} fileName="ChartReport.pdf">
            {({ loading }) => (
              <button className="border border-input text-sm font-medium px-4 py-2 rounded-md">
                {loading ? "Generating PDF..." : "Download PDF"}
              </button>
            )}
          </PDFDownloadLink>
        )}
      </CardHeader>

      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {/* Ref wrapper to capture chart */}
        <div ref={chartRef} className="relative">
          <ChartContainer config={chartConfig} className="aspect-0 h-full w-full">
            <AreaChart className="aspect-0 h-full w-full" data={filteredData}>
              {/* Chart Definitions */}
              <defs>
                <linearGradient id="fillnonpotable" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-nonpotable)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="var(--color-nonpotable)" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="fillpotable" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-potable)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="var(--color-potable)" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
                }}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent labelFormatter={(value) => new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })} />}
              />
              <Area dataKey="potable" type="natural" fill="url(#fillpotable)" stroke="var(--color-potable)" stackId="a" />
              <Area dataKey="nonpotable" type="natural" fill="url(#fillnonpotable)" stroke="var(--color-nonpotable)" stackId="a" />
              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  )
}
