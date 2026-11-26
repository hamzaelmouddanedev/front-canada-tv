"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LOCALES, switchLocalePath, type Locale } from "@/lib/i18n";
import type { NavItem } from "@/lib/site";
import { Logo } from "./Logo";

const navCta =
  "inline-block rounded-full bg-cta transition-[background-position,translate] duration-300 hover:-translate-y-px hover:bg-right";

type Props = {
  items: NavItem[];
  locale: Locale;
  homeHref: string;
  ctaHref: string;
  ctaLabel: string;
  menuLabel: string;
  languageLabel: string;
};

function LanguageSwitch({
  locale,
  pathname,
  label,
  mobile = false,
}: {
  locale: Locale;
  pathname: string;
  label: string;
  mobile?: boolean;
}) {
  return (
    <div
      className={`inline-flex rounded-full border border-lagoon/20 bg-white/4 p-[3px]`}
      role="group"
      aria-label={label}
    >
      {LOCALES.map((l) => (
        <Link
          key={l}
          href={switchLocalePath(pathname, l)}
          className={`rounded-full font-bold tracking-[0.04em] text-muted transition duration-200 hover:text-white aria-[current=true]:bg-cta aria-[current=true]:text-white ${
            mobile ? "px-[0.9rem] py-[0.35rem] text-[0.85rem]" : "px-[0.7rem] py-[0.3rem] text-[0.78rem]"
          }`}
          hrefLang={l}
          lang={l}
          aria-current={l === locale ? "true" : undefined}
        >
          {l.toUpperCase()}
        </Link>
      ))}
    </div>
  );
}

export function Navbar({ items, locale, homeHref, ctaHref, ctaLabel, menuLabel, languageLabel }: Props) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu on navigation.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  const isActive = (href: string) =>
    href === homeHref ? pathname === homeHref : pathname.startsWith(href);

  return (
    <header className="relative z-100">
      <nav
        className={`relative z-100 flex h-[calc(var(--nav-h)+env(safe-area-inset-top,0px))] items-center justify-between px-8 pt-[env(safe-area-inset-top,0px)] backdrop-blur-lg transition-colors duration-300 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-vivid after:opacity-50 max-md:px-[1.2rem] ${
          scrolled ? "bg-flow-0/97" : "bg-flow-0/85"
        }`}
      >
        <Logo href={homeHref} />

        <div className="max-md:hidden">
          <ul className="flex items-center gap-8">
            {items.map((item) => (
              <li key={item.href + item.label}>
                <Link
                  href={item.href}
                  className="relative py-1 text-[0.95rem] font-medium text-muted transition-colors duration-200 after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:origin-left after:scale-x-0 after:rounded-full after:bg-vivid after:transition-transform after:duration-300 hover:text-white hover:after:scale-x-100 aria-[current=page]:text-white aria-[current=page]:after:scale-x-100"
                  aria-current={isActive(item.href) ? "page" : undefined}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center gap-4 max-md:hidden">
          <LanguageSwitch locale={locale} pathname={pathname} label={languageLabel} />
          <Link href={ctaHref} className={`${navCta} px-[1.4rem] py-2 font-bold text-white`}>
            {ctaLabel}
          </Link>
        </div>

        <div className="hidden items-center gap-3 max-md:flex">
        <LanguageSwitch locale={locale} pathname={pathname} label={languageLabel} mobile />
        <button
          type="button"
          className="group flex cursor-pointer flex-col gap-[5px] border-0 bg-transparent p-1"
          aria-label={menuLabel}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="block h-0.5 w-6 rounded-xs bg-fg transition duration-300 group-aria-expanded:translate-y-[7px] group-aria-expanded:rotate-45" />
          <span className="block h-0.5 w-6 rounded-xs bg-fg transition duration-300 group-aria-expanded:opacity-0" />
          <span className="block h-0.5 w-6 rounded-xs bg-fg transition duration-300 group-aria-expanded:-translate-y-[7px] group-aria-expanded:-rotate-45" />
        </button>
        </div>
      </nav>

      <div
        id="mobile-menu"
        className={`absolute inset-x-0 top-full z-99 flex-col gap-4 border-b border-lagoon/20 bg-flow-0/98 px-8 py-6 backdrop-blur-xl md:hidden ${
          open ? "flex" : "hidden"
        }`}
      >
        {items.map((item) => (
          <Link
            key={item.href + item.label}
            href={item.href}
            className="border-b border-white/5 py-2 text-[1.05rem] font-medium text-fg transition-colors hover:text-lagoon aria-[current=page]:text-lagoon"
            aria-current={isActive(item.href) ? "page" : undefined}
            onClick={() => setOpen(false)}
          >
            {item.label}
          </Link>
        ))}
        <Link
          href={ctaHref}
          className={`${navCta} mt-2 self-start px-[1.8rem] py-[0.7rem] text-[1.05rem] font-medium text-white`}
          onClick={() => setOpen(false)}>
          {ctaLabel}
        </Link>
      </div>
    </header>
  );
}
