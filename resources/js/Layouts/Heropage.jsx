
import { Button } from '@/Components/ui/button';
import { Link, router } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import React, { useState } from 'react';

export default function Hero(auth) {
  return (
    <div className="bg-gray-50">
      <header className="py-4 md:py-6">
        <div className="container px-4 mx-auto sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex-shrink-0">
              <a href="/welcome" title="" className="flex rounded items-center ">
                <img className="w-10 h-10 rounded-xl mr-2" src="/images/water_128px.png" alt="" />
                <span className='font-bold text-xl text-blue-600'></span>
              </a>
            </div>

            <div className="flex lg:hidden">
              <button type="button" className="text-gray-900">
                <svg className="w-7 h-7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
              </button>
            </div>

            <div className="hidden lg:flex lg:ml-10 xl:ml-16 lg:items-center lg:justify-center lg:space-x-8 xl:space-x-16">
              <a href="#" title="" className="text-base font-medium text-gray-900 transition-all duration-200 rounded focus:outline-none hover:text-opacity-50 focus:ring-1 focus:ring-gray-900 focus:ring-offset-2"> Home </a>

              <a href="#" title="" className="text-base font-medium text-gray-900 transition-all duration-200 rounded focus:outline-none hover:text-opacity-50 focus:ring-1 focus:ring-gray-900 focus:ring-offset-2"> About </a>

              <a href="#" title="" className="text-base font-medium text-gray-900 transition-all duration-200 rounded focus:outline-none hover:text-opacity-50 focus:ring-1 focus:ring-gray-900 focus:ring-offset-2"> Contact </a>

              <a href="#" title="" className="text-base font-medium text-gray-900 transition-all duration-200 rounded focus:outline-none hover:text-opacity-50 focus:ring-1 focus:ring-gray-900 focus:ring-offset-2"> About Water Quality </a>
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
          </div>
        </div>
      </header>

      <section className="pt-12 pb-12 sm:pb-16 lg:pt-8">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="grid max-w-lg grid-cols-1 mx-auto lg:max-w-full lg:items-center lg:grid-cols-2 gap-y-12 lg:gap-x-16">
            <div>
              <div className="text-center lg:text-left">
                <h1 className="text-4xl font-bold leading-tight text-gray-900 sm:text-5xl sm:leading-tight lg:leading-tight lg:text-6xl">A Monitored water sites and quality</h1>
                <p className="mt-2 text-lg text-gray-600 sm:mt-8">The integration of GIS functionalities into the system will enable the mapping of water quality data, providing users with the ability to observe the spatial distribution of parameters such as turbidity and pH at various monitored water sites. </p>

                <Button onClick={() => router.get('/spatial')} className="bg-blue-500 lg:p-8 lg:text-xl sm:text-sm mt-6 focus:outline-none focus:bg-blue-600 hover:bg-blue-600">
                  View Sites
                  <ArrowRight />
                </Button>

              </div>

              <div className="flex items-center justify-center mt-10 space-x-6 lg:justify-start sm:space-x-8">
                <div className="flex items-center">
                  <p className="text-3xl font-medium text-gray-900 sm:text-4xl">2943</p>
                  <p className="ml-3 text-sm text-gray-900">Cards<br />Delivered</p>
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

                <div className="flex items-center">
                  <p className="text-3xl font-medium text-gray-900 sm:text-4xl">$1M+</p>
                  <p className="ml-3 text-sm text-gray-900">Transaction<br />Completed</p>
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
