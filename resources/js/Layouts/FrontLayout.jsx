import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { usePage } from '@inertiajs/react';
import { useState } from 'react';


export default function FrontLayout({ header, children }) {

  const [showingNavigationDropdown, setShowingNavigationDropdown] =
    useState(false);

  return (
    <div className="min-h-screen">
      <nav className="sticky z-10 border-b border-gray-100 bg-background/95 supports-[backdrop-filter]:bg-background/60 backdrop-blur top-0  shrink-0  ">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between">
            <div className="flex ">
              <div className="flex shrink-0 items-center">
                <Link href="/spatial">
                  <ApplicationLogo className="block h-9 w-auto fill-current text-gray-800 dark:text-gray-200" />
                </Link>
              </div>

            </div>

            <div className=" hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
              <NavLink
                href={route('welcome')}
                active={route().current('welcome')}
              >
                Home
              </NavLink>
              <NavLink
                href={route('sitesdata.index')}
                active={route().current('sitesdata.index')}
              >
                About
              </NavLink>
              <NavLink
                href={route('spatialviews.index')}
                active={route().current('spatialviews.index')}
              >
                Contact
              </NavLink>

            </div>
            <div className="hidden sm:ms-6 sm:flex sm:items-center">

            </div>

            <div className="-me-2 flex items-center sm:hidden">
              <button
                onClick={() =>
                  setShowingNavigationDropdown(
                    (previousState) => !previousState,
                  )
                }
                className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 transition duration-150 ease-in-out hover:bg-gray-100 hover:text-gray-500 focus:bg-gray-100 focus:text-gray-500 focus:outline-none dark:text-gray-500 dark:hover:bg-gray-900 dark:hover:text-gray-400 dark:focus:bg-gray-900 dark:focus:text-gray-400"
              >
                <svg
                  className="h-6 w-6"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    className={
                      !showingNavigationDropdown
                        ? 'inline-flex'
                        : 'hidden'
                    }
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                  <path
                    className={
                      showingNavigationDropdown
                        ? 'inline-flex'
                        : 'hidden'
                    }
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
        {/* Responsive Nav */}
        <div
          className={
            (showingNavigationDropdown ? 'block' : 'hidden') +
            ' sm:hidden'
          }
        >
          <div className="space-y-1 pb-3 pt-2">
            <ResponsiveNavLink
              href={route('dashboard')}
              active={route().current('dashboard')}
            >
              Home
            </ResponsiveNavLink>
            <ResponsiveNavLink
              href={route('sitesdata.index')}
              active={route().current('sitesdata.index')}
            >
              About
            </ResponsiveNavLink>
            <ResponsiveNavLink
              href={route('spatialviews.index')}
              active={route().current('spatialviews.index')}
            >
              Contact
            </ResponsiveNavLink>
          </div>

        </div>
      </nav>

      {header && (
        <header className="bg-white shadow dark:bg-gray-800">
          <div className="mx-auto ml-4 px-4 py-6 sm:px-6 lg:px-8">

          </div>
        </header>
      )}

      <main>{children}</main>
    </div>
  );

}
