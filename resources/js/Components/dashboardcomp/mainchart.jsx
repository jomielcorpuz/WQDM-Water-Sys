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
  const { data: chartData, loading, error } = useSiteStatus()
  const [activeFilter, setActiveFilter] = useState("Last 30 days")

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
  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error}</p>
  if (!filteredData.length) return <p>No data available</p>

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Area Chart - Interactive</CardTitle>
          <CardDescription>Showing water quality</CardDescription>
        </div>
        <Select value={activeFilter} onValueChange={setActiveFilter} className="h-10">
          <SelectTrigger className="ml-auto h-7 w-[180px] rounded-lg pl-2.5" aria-label="Select a time range">
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
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillNonpotable" x1="0" y1="0" x2="0" y2="1">
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
              <linearGradient id="fillPotable" x1="0" y1="0" x2="0" y2="1">
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
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="nonpotable"
              type="natural"
              fill="url(#fillPotable)"
              stroke="var(--color-nonpotable)"
              stackId="a"
            />
            <Area
              dataKey="potable"
              type="natural"
              fill="url(#fillNonpotable)"
              stroke="var(--color-potable)"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
