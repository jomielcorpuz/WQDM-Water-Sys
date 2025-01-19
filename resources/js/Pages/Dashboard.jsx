import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

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

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                  <div className='flex space-x 4 justify-center items-center'>
                  <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg bg-white-800 m-6">
                        <div className="p-6 text-gray-900 text-dark-100">
                            You're logged in!
                        </div>
                    </div>

                      <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg bg-white-800 m-6">
                        <div className="p-6 text-gray-900 text-dark-100">
                            Welcome!
                        </div>
                      </div>
                  </div>


                </div>
            </div>
        </AuthenticatedLayout>
    );
}
