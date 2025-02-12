import MainChart from '@/Components/dashboardcomp/mainchart';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Card } from "@/components/ui/card";
import RadialChart from '@/Components/dashboardcomp/radialchart';

export default function Dashboard() {
  return (
    <AuthenticatedLayout
      header={
        <h2 className="text-xl font-semibold leading-tight text-dark-800 bg-white:text-dark-200">
          Dashboard
        </h2>
      }
    >
      <Head title="Dashboard" />

      <div className='grid lg:grid-cols-3'>

      </div>

      <div className="py-12 px-6 grid lg:grid-cols-3 sm:grid-cols-1 gap-6">
        <Card className="lg:col-span-2">
          <MainChart />
        </Card>
        <Card>

          <RadialChart />
        </Card>
      </div>
    </AuthenticatedLayout>
  );
}
