import { Head, Link } from '@inertiajs/react';

export default function Welcome({ auth, laravelVersion, phpVersion }) {
  const handleImageError = () => {
    document
      .getElementById('screenshot-container')
      ?.classList.add('!hidden');
    document.getElementById('docs-card')?.classList.add('!row-span-1');
    document
      .getElementById('docs-card-content')
      ?.classList.add('!flex-row');
    document.getElementById('background')?.classList.add('!hidden');
  };

  return (
    <> <Head title="Welcome" />
      <div className="absolute bg-cover z-0 inset-0 bg-center min-h-screen" style={{ backgroundImage: "url('/images/img.png')" }}></div>
      <div className="bg-gray-50 text-black/50 dark:bg-black dark:text-white/50">
        <div className="relative flex min-h-screen flex-col items-center justify-center selection:bg-[#FF2D20] selection:text-white">
          <div className="relative w-full max-w-2xl px-6 lg:max-w-7xl">
            <header className="flex items-center justify-between py-10">
              <div className="flex">
                <h1 className="text-3xl font-bold text-black dark:text-white">
                  Water Quality Data System
                </h1>
              </div>
              <nav className="flex">
                {auth.user ? (
                  <Link href={route('dashboard')}
                    className="rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[#FF2D20] dark:text-white dark:hover:text-white/80 dark:focus-visible:ring-white" >
                    Dashboard
                  </Link>) : (
                  <>
                    <Link href={route('login')}
                      className="rounded-md px-3 py-2 text-nowrap text-white ring-1 ring-transparent transition hover:text-white/70 focus:outline-none bg-[#5fb8f1]  hover:bg-[#43a9ef] focus-visible:ring-[#43a9ef] dark:text-white hover:text-white/80 dark:focus-visible:ring-white" >
                      Log in
                    </Link>
                    <Link href={route('register')}
                      className="hidden sm:block ml-4 rounded-md px-3 py-2 text-white ring-1 ring-transparent transition hover:text-white/70  bg-[#5fb8f1]  hover:bg-[#43a9ef] focus:outline-none focus-visible:ring-[#96cff5] text-white dark:hover:text-white/80 dark:focus-visible:ring-white" >
                      Register
                    </Link>
                  </>
                )}
              </nav>
            </header>
            <main className=" flex flex-col justify-center items-center h-screen">
              {/* <img src="/images/background.jpg" alt="Background" className="w-full h-auto mb-4 rounded-md shadow" /> */}
              <p className=" text-lg/relaxed text-left px-20">
                The integration of GIS functionalities into the system will enable the mapping of water quality data, providing users with the ability to observe the spatial distribution of parameters such as turbidity and pH at various locations. This will offer an interactive method for using geotagged data points to track and analyze regional variations in water quality. </p>
              <Link href="/spatial" className="mt-6 inline-flex items-center px-6 py-3 text-lg font-medium text-white bg-[#5fb8f1] rounded-md shadow hover:bg-[#43a9ef]  focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#96cff5]" >
                View Spatial Data
              </Link>
            </main>
            <footer
              className="py-10 text-center text-sm text-black dark:text-white/70">
              UI Development on Progress
            </footer>
          </div>
        </div>
      </div>
    </>
  );
}
