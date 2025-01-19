import { Link } from "@inertiajs/react";

export default function Pagination({ links = []}) {
  if (!links || links.length === 0) {
    return null;
  }

  return (
    <nav className="text-center mt-4">
      {links.map((link) => (
        <Link
          preserveScroll
          href={link.url || ""}
          key={link.label}
          className={
            "inline-block py-2 px-4 rounded-md text-gray-980 text-sm " +
            (link.active ? "bg-gray-200 " : " ") +
            (!link.url
              ? "!text-gray-500 cursor-not-allowed "
              : "hover:bg-blue-400 duration-150")
          }
          dangerouslySetInnerHTML={{ __html: link.label }}
        ></Link>
      ))}
    </nav>
  );
}
