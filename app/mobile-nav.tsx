"use client";

import { useState } from "react";
import Link from "next/link";

export default function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        className="rounded-full border border-zinc-200 bg-white px-3 py-2 text-xs uppercase tracking-[0.2em] text-zinc-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/30"
        aria-expanded={open}
        aria-controls="mobile-nav"
        onClick={() => setOpen((value) => !value)}
      >
        Menu
      </button>
      {open && (
        <div
          id="mobile-nav"
          className="absolute left-0 right-0 top-[76px] z-40 border-b border-zinc-200/80 bg-white/95 px-6 py-4 shadow-lg backdrop-blur"
        >
          <nav className="grid gap-3 text-sm font-medium text-zinc-700">
            <Link className="hover:text-zinc-900" href="/" onClick={() => setOpen(false)}>
              Home
            </Link>
            <Link
              className="hover:text-zinc-900"
              href="/elections"
              onClick={() => setOpen(false)}
            >
              Elections
            </Link>
            <Link
              className="hover:text-zinc-900"
              href="/methodology"
              onClick={() => setOpen(false)}
            >
              Methodology
            </Link>
            <Link
              className="hover:text-zinc-900"
              href="/sources"
              onClick={() => setOpen(false)}
            >
              Sources
            </Link>
            <Link
              className="hover:text-zinc-900"
              href="/disclaimer"
              onClick={() => setOpen(false)}
            >
              Disclaimer
            </Link>
            <Link
              className="hover:text-zinc-900"
              href="/privacy"
              onClick={() => setOpen(false)}
            >
              Privacy
            </Link>
            <Link
              className="hover:text-zinc-900"
              href="/terms"
              onClick={() => setOpen(false)}
            >
              Terms
            </Link>
            <Link
              className="hover:text-zinc-900"
              href="/changelog"
              onClick={() => setOpen(false)}
            >
              Changelog
            </Link>
          </nav>
        </div>
      )}
    </div>
  );
}
