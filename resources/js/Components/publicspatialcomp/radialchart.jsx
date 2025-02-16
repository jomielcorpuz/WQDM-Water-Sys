"use client";

import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip } from "chart.js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

ChartJS.register(ArcElement, Tooltip);

const MAX_PH = 14;

const getColor = (ph) => {
  if (ph < 4) return "red";
  if (ph < 7) return "yellow";
  return "green";
};


export function RadialChart({ currentPh = 0 }) {

  const formatPh = parseFloat(currentPh).toFixed(2);

  const data = {
    labels: ["pH Level", "Remaining"],
    datasets: [
      {
        data: [formatPh, MAX_PH - formatPh],
        backgroundColor: [getColor(formatPh), "#e0e0e0"],
        borderWidth: 0,
        cutout: "70%",
        circumference: 180,
        rotation: 270,
      },
    ],
  };

  return (
    <Card className="flex-wrap justify-center items-center ">
      <CardHeader className="flex justify-center items-center">
        <CardTitle className="text-gray-600">pH Level</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center">
        <div className="  w-[150px]">

          <Doughnut data={data} options={{ plugins: { tooltip: { enabled: false } } }} />
          <div className="relative bottom-16">

            <div className="flex items-center justify-center text-2xl font-bold text-foreground">
              {formatPh}
            </div>
            <div className="flex justify-between">

              <div className="text-sm font-bold text-muted-foreground">0</div>
              <div className="text-sm font-bold text-muted-foreground">14</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
