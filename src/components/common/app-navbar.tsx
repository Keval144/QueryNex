"use client";
import Link from "next/link";
import { useState } from "react";
import { Button } from "../shadcn-ui/button";
import {
  MobileNav,
  MobileNavHeader,
  MobileNavMenu,
  MobileNavToggle,
  NavBody,
  Navbar,
  NavbarButton,
  NavbarLogo,
  NavItems,
} from "./navbar";
import { ThemeSwitch } from "./theme-switch";
import { LogIn, UserPlus } from "lucide-react";

export function AppNavbar() {
  const navItems = [
    {
      name: "Features",
      link: "#features",
    },
    {
      name: "Pricing",
      link: "#pricing",
    },
    { name: "Contact", link: "#contact" },
  ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <Navbar>
      {/* Desktop Navigation */}
      <NavBody>
        <NavbarLogo />
        <NavItems items={navItems} />
        <div className="z-10 flex items-center gap-2">
          <ThemeSwitch variant="link" className="pl-4" />
          <Button
            asChild
            className="text-foreground hover:bg-card bg-card h-8 px-3 text-sm font-medium"
          >
            <Link href="/sign-in" className="flex items-center gap-1">
              Login
            </Link>
          </Button>

          <Button
            asChild
            className="text-primary-foreground h-8 rounded-2xl px-3 text-sm font-medium"
          >
            <Link href="/sign-up" className="flex items-center gap-1">
              Sign Up
            </Link>
          </Button>
        </div>
      </NavBody>

      {/* Mobile Navigation */}
      <MobileNav>
        <MobileNavHeader>
          <NavbarLogo />
          <MobileNavToggle
            isOpen={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          />
        </MobileNavHeader>

        <MobileNavMenu
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        >
          {navItems.map((item, idx) => (
            <a
              key={`mobile-link-${idx}`}
              href={item.link}
              onClick={() => setIsMobileMenuOpen(false)}
              className="relative text-neutral-600 dark:text-neutral-300"
            >
              <span className="block">{item.name}</span>
            </a>
          ))}
          <div className="flex w-full flex-col gap-3">
            <ThemeSwitch variant="ghost" />
            <NavbarButton href="/sign-in" variant="primary" className="w-full">
              Login
            </NavbarButton>
            <NavbarButton href="sign-up" variant="primary" className="w-full">
              Sign up
            </NavbarButton>
          </div>
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
  );
}
