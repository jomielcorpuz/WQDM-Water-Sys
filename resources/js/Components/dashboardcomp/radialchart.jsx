
import * as React from "react"
import { Pie, PieChart, Sector, Label } from "recharts";


import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
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
import { Separator } from "../ui/separator";
import { CircleSmall, Dot } from "lucide-react";
import { RadialChartSkeletonCard } from "./radialchartskeleton";

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

export default function RadialChart({ isCapturing }) {
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

  if (loading) return <div className=" w-[100%] h-full justify-center"><RadialChartSkeletonCard /></div>
  if (error) return <p>Error: {error}</p>
  if (!filteredData.length) return <p>No data available</p>

  return (
    <Card className="">
      <ChartStyle id="pie-interactive" config={chartConfig} />
      <CardHeader className="flex-row items-start space-y-0 pb-0 border-b py-5">
        <div className="grid gap-1">

          <CardTitle>Potable vs Non Potable</CardTitle>
          <CardDescription>Shows monitored sites</CardDescription>
        </div>
        {isCapturing ? (
          <h2 className="ml-auto pl-2.5 text-md ">{activeMonth || "Overall"}</h2>
        ) : (
          <Select value={activeMonth} onValueChange={setActiveMonth}>
            <SelectTrigger className="ml-auto h-10 w-[130px] rounded-lg pl-2.5" aria-label="Overall">
              <span>{activeMonth || "Overall"}</span>
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
        )}

      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          id="pie-interactive"
          config={chartConfig}
          className="aspect-0 w-full h-full md:h-[250px] lg:h-[270px] "
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
                          Total Sites
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
      <Separator />
      <CardFooter className="">

        <div className="flex flex-col w-full">

          <div className="flex justify-between  mt-2  ">
            <div className="flex items-center mb-2">
              {/* Use inline-block to prevent expansion */}
              <CircleSmall className="h-5 w-5 inline-block" style={{ color: chartConfig.potable.color }} />
              <span className="text-sm ml-2">{chartConfig.potable.label}</span>
            </div>
            <div><p className="text-sm">{totalPotable}</p></div>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center">
              {/* Use inline-block to prevent expansion */}
              <CircleSmall className="h-5 w-5 inline-block" style={{ color: chartConfig.nonpotable.color }} />
              <span className="text-sm ml-2">{chartConfig.nonpotable.label}</span>
            </div>
            <div><p className="text-sm">{totalNonPotable}</p></div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
