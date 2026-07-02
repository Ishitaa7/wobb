import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ListNavLink } from "@/components/layout/ListNavLink";
import { ROUTES } from "@/lib/routes";

interface LayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

export function Layout({ children, title, description }: LayoutProps) {
  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <div className="min-h-screen flex flex-col">
        <header className="sticky top-0 z-50 border-b border-[var(--color-line)] bg-white/85 backdrop-blur-md">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
            <Link
              to={ROUTES.home}
              className="group flex items-center gap-2.5 rounded-lg focus-visible:outline-offset-4"
            >
              <span
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--color-brand)] text-sm font-bold text-white shadow-sm"
                aria-hidden="true"
              >
                W
              </span>
              <span className="text-left">
                <span className="block text-sm font-semibold text-[var(--color-ink)] group-hover:text-[var(--color-brand)] transition-colors">
                  Wobb
                </span>
                <span className="block text-xs text-[var(--color-ink-muted)]">
                  Influencer Discovery
                </span>
              </span>
            </Link>
            <ListNavLink />
          </div>
        </header>

        <main id="main-content" className="flex-1">
          <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
            {(title || description) && (
              <header className="mb-6 sm:mb-8 text-left">
                {title && <h1 className="mb-2">{title}</h1>}
                {description && (
                  <p className="max-w-2xl text-base text-[var(--color-ink-secondary)]">
                    {description}
                  </p>
                )}
              </header>
            )}
            {children}
          </div>
        </main>

        <footer className="border-t border-[var(--color-line)] bg-white/60 py-6 text-center text-sm text-[var(--color-ink-muted)]">
          <p>Discover creators across Instagram, YouTube &amp; TikTok</p>
        </footer>
      </div>
    </>
  );
}
