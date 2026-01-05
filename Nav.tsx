"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function NavButton({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const active =
    (href === "/" && pathname === "/") ||
    (href !== "/" && pathname.startsWith(href));

  return (
    <Link
      href={href}
      className={[
        "rounded-full px-4 py-2 text-sm font-semibold transition",
        active
          ? "bg-carolina-400 text-deepblue-900"
          : "bg-white/10 text-white hover:bg-white/15",
      ].join(" ")}
    >
      {label}
    </Link>
  );
}

export default function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-deepblue-900/75 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4">
        <div className="flex flex-col leading-tight">
          <div className="text-2xl font-extrabold tracking-tight text-accentorange-400">
            College Match
          </div>
          <div className="text-sm text-white/80">
            In a few clicks, find colleges that match with your academic profile and personal preferences.
          </div>
        </div>
        <nav className="flex items-center gap-2">
          <NavButton href="/" label="Find Colleges" />
          <NavButton href="/compare" label="Compare Schools" />
        </nav>
      </div>
    </header>
  );
}
