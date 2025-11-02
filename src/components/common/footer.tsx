import Link from "next/link";
import { format } from "date-fns";

import { Github } from "lucide-react";
import { IconBrandX, IconMail } from "@tabler/icons-react";
import QueryNex from "./querynex";

export function Footer() {
  const todayDate = new Date();

  const socialLinks: Record<string, { icon: any; url: string }> = {
    Twitter: {
      icon: IconBrandX,
      url: "https://x.com/kansagra_keval",
    },
    Email: {
      icon: IconMail,
      url: "mailto:kevalm144@gmail.com",
    },
    GitHub: {
      icon: Github,
      url: "https://github.com/keval144/querynex",
    },
  };

  const sections = [
    {
      title: "Product",
      items: [
        { name: "Features", href: "#features" },
        { name: "Documentation", href: "https://github.com/keval144/querynex" },
        { name: "Pricing", href: "#pricing" },
        {
          name: "API",
          href: "https://github.com/Keval144/QueryNex/tree/main/src/app/api",
        },
      ],
    },
    {
      title: "Company",
      items: [
        { name: "About", href: "#home" },
        { name: "Contact", href: "mailto:kevalm144@gmail.com" },
      ],
    },
    {
      title: "Support",
      items: [{ name: "Help Center", href: "/help" }],
    },
  ];

  return (
    <footer className="border-t border-(--color-border) bg-(--color-card) px-5 pt-20 pb-10">
      <div className="mx-auto mb-10 grid max-w-6xl grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="mb-3 gap-3 tracking-tight">
            <QueryNex className="text-2xl" />
          </div>

          <p className="text-sm text-(--color-text-secondary)">
            QueryNex is an intelligent SQL playground that lets users securely
            connect their own databases and query them through a sleek,
            ChatGPT-style interface.
          </p>

          <div className="mt-4 flex gap-4">
            {Object.entries(socialLinks).map(([name, { icon: Icon, url }]) => (
              <Link
                key={name}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-(--color-accent) hover:bg-(--color-primary) hover:text-white"
                title={name}
              >
                <Icon className="h-5 w-5" />
              </Link>
            ))}
          </div>
        </div>

        {sections.map((section) => (
          <div key={section.title}>
            <h3 className="mb-4 text-lg font-semibold text-(--color-text)">
              {section.title}
            </h3>
            <ul className="space-y-2 text-(--color-text-secondary)">
              {section.items.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="transition-colors hover:text-(--color-primary)"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="pt-6 text-center text-(--color-text-secondary)">
        &copy; {format(todayDate, "yyyy")} QueryNex. All rights reserved.
      </div>
    </footer>
  );
}
