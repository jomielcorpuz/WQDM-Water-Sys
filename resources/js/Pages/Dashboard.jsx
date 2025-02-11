import MainChart from '@/Components/dashboardcomp/mainchart';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Card } from "@/components/ui/card";

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

      <div className="py-12 grid lg:grid-cols-2 sm:grid-cols-1">
        <Card>
          <MainChart />
        </Card>
      </div>
    </AuthenticatedLayout>
  );
}
