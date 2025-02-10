"use client";

import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip } from "chart.js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

ChartJS.register(ArcElement, Tooltip);

const MAX_Value = 500;

const getColor = (val) => {
  if (val < 100) return "lightyellow";
  if (val < 300) return "orange";
  return "darkorange";
};


export function TotalHardnessChart({ totalhardness = 0 }) {
  const data = {
    labels: ["pH Level", "Remaining"],
    datasets: [
      {
        data: [totalhardness, MAX_Value - totalhardness],
        backgroundColor: [getColor(totalhardness), "#e0e0e0"],
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
        <CardTitle className="text-gray-600">Total Hardness</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center">
        <div className="  w-[150px]">

          <Doughnut data={data} options={{ plugins: { tooltip: { enabled: false } } }} />
          <dev className="relative bottom-10">

            <div className="flex items-center justify-center text-2xl font-bold text-foreground">
              {totalhardness} mg/L
            </div>
            <div className="flex justify-between">

              <div className="text-sm font-bold text-muted-foreground">0</div>
              <div className="text-sm font-bold text-muted-foreground">500</div>
            </div>
          </dev>
        </div>
      </CardContent>
    </Card>
  );
}
