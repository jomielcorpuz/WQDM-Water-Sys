"use client";

import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip } from "chart.js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

ChartJS.register(ArcElement, Tooltip);

const MAX_PH = 10;
const currentPh = 2; // Example value, can be dynamic

const getColor = (ph) => {
  if (ph < 4) return "red";
  if (ph < 7) return "yellow";
  return "green";
};

const data = {
  labels: ["pH Level", "Remaining"],
  datasets: [
    {
      data: [currentPh, MAX_PH - currentPh],
      backgroundColor: [getColor(currentPh), "#e0e0e0"],
      borderWidth: 0,
      cutout: "70%",
      circumference: 180,
      rotation: 270,
    },
  ],
};

export function RadialChart() {
  return (
    <Card className="flex-wrap justify-center items-center ">
      <CardHeader className="justify-center  items-center">
        <CardTitle>pH Level</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center items-center max-h-[250px] max-w-[350px]">
        <div className="max-h-[250px] max-w-[350px] w-[150px]">

          <Doughnut data={data} options={{ plugins: { tooltip: { enabled: false } } }} className="flex items-center" />
          <div className="flex items-center justify-center text-2xl font-bold text-foreground">
            {currentPh}
          </div>
          <div className="flex justify-between">

            <div className="text-sm font-bold text-muted-foreground">Min</div>
            <div className="text-sm font-bold text-muted-foreground">Max</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
