import { Link, usePage } from "@inertiajs/react";

export default function Pagination({ links = [] }) {
  const { queryParams } = usePage().props; // Get current query params

  if (!links || links.length === 0) {
    return null;
  }

  return (
    <nav className="text-center mt-4">
      {links.map((link) => {
        if (!link.url) {
          return (
            <span
              key={link.label}
              className="inline-block py-2 px-4 rounded-md text-gray-500 text-sm cursor-not-allowed"
              dangerouslySetInnerHTML={{ __html: link.label }}
            ></span>
          );
        }

        // Preserve existing query parameters when navigating
        const newUrl = new URL(link.url, window.location.origin);
        const currentParams = new URLSearchParams(window.location.search);

        // Add existing query params to new URL
        Object.keys(queryParams || {}).forEach((key) => {
          if (!newUrl.searchParams.has(key) && queryParams[key]) {
            newUrl.searchParams.set(key, queryParams[key]);
          }
        });

        return (
          <Link
            preserveScroll
            preserveState
            href={newUrl.toString()}
            key={link.label}
            className={
              "inline-block py-2 px-4 rounded-md text-gray-980 text-sm " +
              (link.active ? "bg-gray-200 " : " ") +
              "hover:bg-blue-400 duration-150"
            }
            dangerouslySetInnerHTML={{ __html: link.label }}
          ></Link>
        );
      })}
    </nav>
  );
}
