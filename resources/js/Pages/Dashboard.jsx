import MainChart from '@/Components/dashboardcomp/mainchart';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Card } from "@/components/ui/card";
import RadialChart from '@/Components/dashboardcomp/radialchart';
import { CircleCheck, CircleMinus, Globe } from "lucide-react";
import SummaryCard from '@/Components/dashboardcomp/summarycard';

// Map icon names to actual Lucide icons
const iconMap = {
  CircleCheck,
  CircleMinus,
  Globe,
};

export default function Dashboard({ summaryData }) {
  return (
    <AuthenticatedLayout
      header={
        <h2 className="text-xl font-semibold leading-tight text-dark-800 bg-white:text-dark-200">
          Dashboard
        </h2>
      }
    >
      <Head title="Dashboard" />


      <div className="px-6 grid gap-4 mt-6 sm:grid-cols-2 lg:grid-cols-3">
        {summaryData.map((item) => (
          <SummaryCard
            key={item.title}
            title={item.title}
            value={item.value}
            icon={iconMap[item.icon]}
          />
        ))}
      </div>


      <div className="py-12 px-6 grid lg:grid-cols-3 sm:grid-cols-1 gap-6">
        <Card className="lg:col-span-2 justify center items-center w-full">
          <MainChart />
        </Card>
        <Card>

          <RadialChart />
        </Card>
      </div>
    </AuthenticatedLayout>
  );
}
