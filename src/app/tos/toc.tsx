"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface TableOfContentsProps {
  sections: { id: string; title: string }[];
}

export const TableOfContents = ({ sections }: TableOfContentsProps) => {
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "0px 0px -80% 0px" },
    );

    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [sections]);

  return (
    <nav className="space-y-1">
      {sections.map((section) => (
        <a
          key={section.id}
          href={`#${section.id}`}
          className={cn(
            "block rounded-md px-3 py-2 text-sm transition-colors duration-200",
            activeSection === section.id
              ? "bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-gray-100"
              : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800",
          )}
        >
          {section.title}
        </a>
      ))}
    </nav>
  );
};
