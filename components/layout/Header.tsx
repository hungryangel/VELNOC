"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { navItems } from "@/lib/site";
import { ButtonLink } from "@/components/ui/ButtonLink";

export function Header() {
  const [open, setOpen] = useState(false);
  const closeMenu = () => setOpen(false);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  return (
    <>
      <header className="site-header">
        <div className="site-header-inner">
          <Link href="/" className="wordmark" aria-label="VELNOC 홈">
            VELNOC
          </Link>
          <nav className="desktop-nav" aria-label="주요 메뉴">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="nav-link">
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="header-cta">
            <ButtonLink href="/contact">상담 시작 →</ButtonLink>
            <button
              className="button-icon mobile-toggle"
              type="button"
              aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((value) => !value)}
              onKeyDown={(event) => {
                if (event.key === "Escape") {
                  closeMenu();
                }
              }}
            >
              {open ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}
            </button>
          </div>
        </div>
      </header>
      <div id="mobile-menu" className="mobile-menu" data-open={open ? "true" : "false"} aria-hidden={!open}>
        <nav className="mobile-nav" aria-label="모바일 메뉴">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="nav-link" onClick={closeMenu}>
              {item.label}
            </Link>
          ))}
          <Link href="/contact" className="button button-primary w-full" onClick={closeMenu}>
            상담 시작 →
          </Link>
        </nav>
      </div>
    </>
  );
}
