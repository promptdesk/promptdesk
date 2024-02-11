import React from "react";
import Link from "next/link";
import { ChevronRightIcon, HomeIcon } from "@heroicons/react/20/solid";

const Breadcrumbs = ({ path }: { path: string }) => {
  // Assuming 'path' is a string like 'projects/project-nero'
  // Split into segments and create a pages array for rendering
  const segments = path ? path.split("/") : [];
  const pages = segments.map((segment: any, index: any) => ({
    name: segment.charAt(0).toUpperCase() + segment.slice(1).replace("-", " "), // Format the segment name
    href: `/prompts/${segments.slice(0, index + 1).join("/")}`, // Construct the URL
    current: index === segments.length - 1, // Mark the last segment as current
  }));

  // Add the home page at the beginning
  pages.unshift({ name: "Home", href: "/", current: false });

  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol role="list" className="flex items-center space-x-4">
        {pages.map((page: any, index: any) => (
          <li key={page.name}>
            {index === 0 ? (
              <div>
                <Link
                  href={page.href}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <HomeIcon
                    className="h-5 w-5 flex-shrink-0"
                    aria-hidden="true"
                  />
                  <span className="sr-only">{page.name}</span>
                </Link>
              </div>
            ) : (
              <div className="flex items-center">
                <ChevronRightIcon
                  className="h-5 w-5 flex-shrink-0 text-gray-400"
                  aria-hidden="true"
                />
                <Link href={page.href}>
                  <span
                    className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700"
                    aria-current={page.current ? "page" : undefined}
                  >
                    {page.name}
                  </span>
                </Link>
              </div>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
