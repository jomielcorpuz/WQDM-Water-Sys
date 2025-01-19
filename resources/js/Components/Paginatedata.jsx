import { Link } from "@inertiajs/react";

export default function Paginatedata({ links = [], paginate, currentPage }) {
  if (!links || links.length === 0) {
    return null; // Return null or a placeholder if links is empty or undefined
  }

  const previousPage = currentPage > 1 ? currentPage - 1 : null;
  const nextPage = currentPage < links.length ? currentPage + 1 : null;

  return (
    <nav className="text-center mt-4">
      <ul className="inline-flex -space-x-px">
        {previousPage && (
          <li>
            <button
              onClick={() => paginate(previousPage)}
              className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              Previous
            </button>
          </li>
        )}
        {links.map((link, index) => (
          <li key={index}>
            <button
              onClick={() => paginate(index + 1)}
              className={`px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${
                currentPage === index + 1 ? "font-bold" : ""
              }`}
            >
              {link.label}
            </button>
          </li>
        ))}
        {nextPage && (
          <li>
            <button
              onClick={() => paginate(nextPage)}
              className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              Next
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
}
