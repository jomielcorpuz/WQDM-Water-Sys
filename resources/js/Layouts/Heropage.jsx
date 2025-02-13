
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Button } from '@/Components/ui/button';
import { Link, router } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { motion, useSpring } from "framer-motion";
import { Loader } from "lucide-react";

export default function Hero(auth) {
  console.log(auth.user);
  const [showingNavigationDropdown, setShowingNavigationDropdown] =
    useState(false);

  const [totalSites, setTotalSites] = useState(null);
  const [activeSites, setActiveSites] = useState(null);
  const [loading, setLoading] = useState(true);

  // Animated values
  const animatedTotalSites = useSpring(0, { stiffness: 100, damping: 10 });
  const animatedActiveSites = useSpring(0, { stiffness: 100, damping: 10 });


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/spatial"); // Fetch data
        const result = await response.json();

        // Ensure data is an array
        const sites = Array.isArray(result.data) ? result.data : [];

        // Count total sites
        const total = sites.length;
        // Count active sites where active_status === "Active"
        const active = sites.filter((site) => site.active_status === "Active").length;

        setTotalSites(total);
        setActiveSites(active);

        // Animate numbers
        animatedTotalSites.set(total);
        animatedActiveSites.set(active);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching spatial data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  return (
    <div className="">
      <header className="sticky top-0 z-10 border-b border-gray-100 bg-background/95 supports-[backdrop-filter]:bg-background/60 backdrop-blur shrink-0">
        <div className="container mx-auto max-w-7xl  px-4 sm:px-6 ">
          <div className="flex h-16 justify-between items-center">
            <div className="flex mr-16 items-center ">
              <a href="/welcome" title="" className="flex items-center rounded">
                <img className="w-10 h-10 rounded-xl mr-2" src="/images/water_128px.png" alt="Water Logo" />
                <span className="font-bold text-xl text-blue-600"></span>
              </a>
            </div>

            <div className="hidden space-x-8 lg:flex">
              <a href="/welcome" className="text-base font-medium text-gray-900 hover:text-opacity-50">Home</a>
              <a href="/welcome" className="text-base font-medium text-gray-900 hover:text-opacity-50">About</a>
              <a href="/welcome" className="text-base font-medium text-gray-900 hover:text-opacity-50">Contact</a>
            </div>

            <nav className="hidden lg:flex ml-auto ">
              {auth.user ? (
                <Link href={route('dashboard')} className="rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70">
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link href={route('login')} className="ml-4 rounded-md px-3 py-2 text-white bg-blue-500 hover:bg-blue-600 transition">Sign in</Link>

                </>
              )}
            </nav>

            <div className="-me-2 flex items-center lg:hidden">
              <button
                onClick={() => setShowingNavigationDropdown((prev) => !prev)}
                className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
              >
                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                  <path className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  <path className={showingNavigationDropdown ? 'inline-flex' : 'hidden'} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Responsive Nav */}
        <div className={(showingNavigationDropdown ? 'block' : 'hidden') + ' sm:hidden'}>
          <div className="space-y-1 pb-3 pt-2">
            <a href="/welcome" className="block px-4 py-2 text-base font-medium text-gray-900 hover:bg-gray-100">Home</a>
            <a href="/welcome" className="block px-4 py-2 text-base font-medium text-gray-900 hover:bg-gray-100">About</a>
            <a href="/welcome" className="block px-4 py-2 text-base font-medium text-gray-900 hover:bg-gray-100">Contact</a>
          </div>
        </div>

      </header>



      <section className="pt-12 pb-12 sm:pb-16 lg:pt-8">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="grid max-w-lg grid-cols-1 mx-auto lg:max-w-full lg:items-center lg:grid-cols-2 gap-y-12 lg:gap-x-16">
            <div>
              <div className="text-center lg:text-left">
                <h1 className="text-4xl font-bold leading-tight text-gray-900 sm:text-5xl sm:leading-tight lg:leading-tight lg:text-6xl">A Monitored Water Sites Quality</h1>
                <p className="mt-2 text-lg text-gray-600 sm:mt-8">The integration of GIS functionalities into the system will enable the mapping of water quality data, providing users with the ability to observe the spatial distribution of parameters such as turbidity and pH at various monitored water sites. </p>

                <Button onClick={() => router.get('/spatial')} className="bg-blue-500 lg:p-8 lg:text-xl sm:text-sm mt-6 focus:outline-none focus:bg-blue-600 hover:bg-blue-600">
                  View Water Sites
                  <ArrowRight />
                </Button>

              </div>

              <div className="flex items-center justify-center mt-10 space-x-6 lg:justify-start sm:space-x-8">

                {/* Total Sites */}
                <div className="flex items-center">
                  {loading ? (
                    <Loader className="animate-spin h-10 w-10 text-gray-500" />
                  ) : (
                    <motion.p className="text-3xl font-medium text-gray-900 sm:text-4xl">
                      {totalSites}
                    </motion.p>
                  )}
                  <p className="ml-3 text-sm text-gray-900">
                    Sites<br />Monitored
                  </p>
                </div>
                <div className="hidden sm:block">
                  <svg className="text-gray-400" width="16" height="39" viewBox="0 0 16 39" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <line x1="0.72265" y1="10.584" x2="15.7226" y2="0.583975"></line>
                    <line x1="0.72265" y1="17.584" x2="15.7226" y2="7.58398"></line>
                    <line x1="0.72265" y1="24.584" x2="15.7226" y2="14.584"></line>
                    <line x1="0.72265" y1="31.584" x2="15.7226" y2="21.584"></line>
                    <line x1="0.72265" y1="38.584" x2="15.7226" y2="28.584"></line>
                  </svg>
                </div>

                {/* Active Sites */}
                <div className="flex items-center">
                  {loading ? (
                    <Loader className="animate-spin h-10 w-10 text-gray-500" />
                  ) : (
                    <motion.p className="text-3xl font-medium text-gray-900 sm:text-4xl">
                      {activeSites}
                    </motion.p>
                  )}
                  <p className="ml-3 text-sm text-gray-900">
                    Active<br />Water Sites
                  </p>
                </div>
              </div>
            </div>

            <div>
              <img className="w-full rounded-xl" src="/images/heroicon.jpg" alt="" />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
