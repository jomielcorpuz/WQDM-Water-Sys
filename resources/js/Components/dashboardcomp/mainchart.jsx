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
  const [chartImage, setChartImage] = useState(null);
  const [isExporting, setIsExporting] = useState(false);

  const exportReport = async () => {
    setIsExporting(true);
    try {
      if (chartRef.current) {
        const canvas = await html2canvas(chartRef.current, { scale: 3 });
        const imageData = canvas.toDataURL("image/png", 1.0);

        // Initialize PDF in Portrait mode
        const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

        // Add Title
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(16);
        pdf.text("Visual Report of Water Sites", 105, 20, { align: "center" });

        // Add Date Generated
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(12);
        const date = new Date().toLocaleDateString();
        pdf.text(`Date Generated: ${date}`, 105, 30, { align: "center" });

        // Adjust image dimensions while maintaining aspect ratio
        const imgWidth = 180;
        const imgHeight = (canvas.height / canvas.width) * imgWidth;

        // Add Image Below the Title & Date
        pdf.addImage(imageData, "PNG", 15, 40, imgWidth, imgHeight);

        // Save PDF
        pdf.save(`Water_Sites_Report_${date}.pdf`);
      }
    } catch (error) {
      console.error("Error exporting report:", error);
    } finally {
      setIsExporting(false);
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
    <div>
      <Card className="flex flex-col ">
        <CardHeader className="flex-row justify-between items-center space-y-0 pb-0 border-b py-5">
          <div className="grid gap-1">
            <CardTitle>Water Sites Condition</CardTitle>
            <CardDescription>Showing monitored sites water condition</CardDescription>
          </div>
          <div>
            {isCapturing ? (
              <h2 className="ml-auto pl-2.5 text-md ">{activeFilter || ""}</h2>
            ) : (
              <Select value={activeFilter} onValueChange={setActiveFilter}>
                <SelectTrigger className="ml-auto h-10 rounded-lg ">
                  <SelectValue placeholder="Select time range" />
                </SelectTrigger>
                <SelectContent align="end" className="rounded-xl">
                  <SelectItem value="Last 7 days" className="rounded-lg">Last 7 days</SelectItem>
                  <SelectItem value="Last 30 days" className="rounded-lg">Last 30 days</SelectItem>
                  <SelectItem value="Last 3 months" className="rounded-lg">Last 3 months</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>

        </CardHeader>
        <CardContent ref={chartRef} className="px-2 pt-4 sm:px-6 sm:pt-6">
          <ChartContainer config={chartConfig} className="aspect-0 h-full md:h-[250px] lg:h-[350px] w-full">
            <AreaChart data={filteredData} className="aspect-0 h-full md:h-[250px] lg:h-[300px] w-full">
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
        </CardContent>
      </Card>

      <Dialog open={isExporting}>
        <DialogContent className="flex flex-col items-center gap-4 p-6">
          <Loader2 className="animate-spin text-blue-600" size={40} />
          <p>Generating report, please wait...</p>
        </DialogContent>
      </Dialog>
    </div>
  );
}
