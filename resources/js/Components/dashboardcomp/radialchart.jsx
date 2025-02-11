"use client"

import * as React from "react"
import { Pie, PieChart, Sector, Label } from "recharts";


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
  ChartStyle,
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

import useSiteStatus from "@/Hooks/useSiteStatus";// Custom hook to fetch data

const chartConfig = {
  potable: {
    label: "Potable",
    color: "hsl(var(--chart-2))",
  },
  nonpotable: {
    label: "Nonpotable",
    color: "hsl(var(--chart-1))",
  },
}

export default function RadialChart() {
  const { data: siteData, loading, error } = useSiteStatus() // Fetch site data
  const [activeMonth, setActiveMonth] = React.useState("")

  const months = React.useMemo(
    () => Array.from(new Set(siteData.map(item => new Date(item.date).toLocaleString('default', { month: 'long' })))),
    [siteData]
  )

  const filteredData = React.useMemo(() => {
    if (!activeMonth) return siteData
    return siteData.filter(item => new Date(item.date).toLocaleString('default', { month: 'long' }) === activeMonth)
  }, [siteData, activeMonth])

  // Total computation for filtered data
  const totalPotable = filteredData.reduce((acc, curr) => acc + curr.potable, 0)
  const totalNonPotable = filteredData.reduce((acc, curr) => acc + curr.nonpotable, 0)
  const total = totalPotable + totalNonPotable

  return (
    <Card className="flex flex-col">
      <ChartStyle id="pie-interactive" config={chartConfig} />
      <CardHeader className="flex-row items-start space-y-0 pb-0">
        <div className="grid gap-1">
          <CardTitle>Radial Chart - Potable vs Non Potable</CardTitle>
          <CardDescription>Select month to filter data</CardDescription>
        </div>
        <Select value={activeMonth} onValueChange={setActiveMonth}>
          <SelectTrigger className="ml-auto h-7 w-[130px] rounded-lg pl-2.5" aria-label="Select a month">
            <SelectValue placeholder="Select month" />
          </SelectTrigger>
          <SelectContent align="end" className="rounded-xl">
            {months.map((month) => (
              <SelectItem key={month} value={month} className="rounded-lg">
                <div className="flex items-center gap-2 text-xs">
                  {month}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="flex flex-1 justify-center pb-0">
        <ChartContainer
          id="pie-interactive"
          config={chartConfig}
          className="mx-auto aspect-square w-full max-w-[300px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={[
                { name: "Potable", value: totalPotable, fill: chartConfig.potable.color },
                { name: "Nonpotable", value: totalNonPotable, fill: chartConfig.nonpotable.color },
              ]}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalPotable + totalNonPotable}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Total
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
