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
import { ArrowDownToLine, Loader } from "lucide-react"
import { MainchartSkeletonCard } from "./mainchartskeleton"
import { useRef } from "react";
import html2canvas from "html2canvas";
import { PDFDownloadLink } from "@react-pdf/renderer"
import ChartReport from "./ChartReportPDF"
import { Loader2 } from "lucide-react";
import jsPDF from "jspdf";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";


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

export default function MainChart({ isCapturing }) {
  const { data: chartData, loading, error } = useSiteStatus();
  const [activeFilter, setActiveFilter] = useState("Last 30 days");
  const chartRef = useRef(null);

  const filterDataByDate = (data, filter) => {
    const now = new Date();
    let filteredData = [];

    switch (filter) {
      case "Last 7 days":
        filteredData = data.filter((item) => {
          const itemDate = new Date(item.date);
          return now - itemDate <= 7 * 24 * 60 * 60 * 1000;
        });
        break;
      case "Last 30 days":
        filteredData = data.filter((item) => {
          const itemDate = new Date(item.date);
          return now - itemDate <= 30 * 24 * 60 * 60 * 1000;
        });
        break;
      case "Last 3 months":
        filteredData = data.filter((item) => {
          const itemDate = new Date(item.date);
          return now - itemDate <= 90 * 24 * 60 * 60 * 1000;
        });
        break;
      default:
        filteredData = data;
    }

    return filteredData;
  };

  const filteredData = filterDataByDate(chartData, activeFilter);

  // Fallback data with 0 values (to keep chart layout visible)
  const fallbackData = [
    { date: new Date().toISOString(), potable: 0, nonpotable: 0 },
  ];

  const finalChartData = filteredData.length ? filteredData : fallbackData;

  // Error and loading states
  if (loading) return <div className="w-full h-full justify-center"><MainchartSkeletonCard /></div>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <Card className="flex flex-col">
        <CardHeader className="flex-row justify-between items-center space-y-0 pb-0 border-b py-5">
          <div className="grid gap-1">
            <CardTitle>Water Sites Condition</CardTitle>
            <CardDescription>
              Showing monitored sites water condition
            </CardDescription>
          </div>
          <div>
            {isCapturing ? (
              <h2 className="ml-auto pl-2.5 text-md">{activeFilter || ""}</h2>
            ) : (
              <Select value={activeFilter} onValueChange={setActiveFilter}>
                <SelectTrigger className="ml-auto h-10 rounded-lg">
                  <SelectValue placeholder="Select time range" />
                </SelectTrigger>
                <SelectContent align="end" className="rounded-xl">
                  <SelectItem value="Last 7 days" className="rounded-lg">
                    Last 7 days
                  </SelectItem>
                  <SelectItem value="Last 30 days" className="rounded-lg">
                    Last 30 days
                  </SelectItem>
                  <SelectItem value="Last 3 months" className="rounded-lg">
                    Last 3 months
                  </SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
        </CardHeader>
        <CardContent ref={chartRef} className="relative px-2 pt-4 sm:px-6 sm:pt-6">
          {!filteredData.length && (
            <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
              <p className="text-sm text-muted-foreground">No data available</p>
            </div>
          )}
          <ChartContainer
            config={chartConfig}
            className="aspect-0 h-full md:h-[250px] lg:h-[350px] w-full"
          >
            <AreaChart
              data={finalChartData}
              className="aspect-0 h-full md:h-[250px] lg:h-[300px] w-full"
            >
              <defs>
                <linearGradient id="fillnonpotable" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-nonpotable)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-nonpotable)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient id="fillpotable" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-potable)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-potable)"
                    stopOpacity={0.1}
                  />
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
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  });
                }}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) =>
                      new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })
                    }
                  />
                }
              />
              <Area
                dataKey="potable"
                type="natural"
                fill="url(#fillpotable)"
                stroke="var(--color-potable)"
                stackId="a"
              />
              <Area
                dataKey="nonpotable"
                type="natural"
                fill="url(#fillnonpotable)"
                stroke="var(--color-nonpotable)"
                stackId="a"
              />
              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>


    </div>
  );
}
