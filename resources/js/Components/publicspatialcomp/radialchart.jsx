"use client";

import { RadialBar, RadialBarChart, PolarRadiusAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const MAX_PH = 10;
const currentPh = 2; // Example value, can be dynamic

const getColor = (ph) => {
  if (ph < 4) return "red";
  if (ph < 7) return "yellow";
  return "green";
};

const chartData = [{ name: "pH Level", value: (currentPh / MAX_PH) * 100 }];

export function RadialChart() {
  return (
    <Card className="flex flex-col items-center p-6">
      <CardHeader className="items-center pb-4">
        <CardTitle>pH Level</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 items-center">
        <RadialBarChart
          width={250}
          height={250}
          cx={125}
          cy={125}
          innerRadius={80}
          outerRadius={120}
          barSize={15}
          data={chartData}
          startAngle={180}
          endAngle={180 - (180 * (currentPh / MAX_PH))}
        >
          <PolarRadiusAxis domain={[1, 100]} tick={false} axisLine={false} />
          <RadialBar
            dataKey="value"
            fill={getColor(currentPh)}
            background={{ fill: "#e0e0e0" }}
          />
          <text x={125} y={125} textAnchor="middle" className="fill-foreground text-2xl font-bold">
            {currentPh}
          </text>
        </RadialBarChart>
      </CardContent>
    </Card>
  );
}
