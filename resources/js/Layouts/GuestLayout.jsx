import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
  return (
    <div className="flex  w-full items-center justify-center p-6 md:p-10">
      <div className="flex justif-center items-center w-full ">

        <div className="w-full max-w-lg mt-6 px-6 py-4 bg-white dark:bg-gray-800 shadow-md overflow-hidden sm:rounded-lg">
          {children}
        </div>
      </div>
    </div>
  );
}
