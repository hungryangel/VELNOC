import Link from "next/link";
import { footerGroups } from "@/lib/site";

export function Footer() {
  return (
    <footer className="footer">
      <div className="container-wide">
        <div className="footer-grid">
          {footerGroups.map((group) => (
            <div key={group.title}>
              <h2 className="footer-title">{group.title}</h2>
              {group.links.map((link) => (
                <Link key={`${group.title}-${link.label}`} href={link.href} className="footer-link">
                  {link.label}
                </Link>
              ))}
            </div>
          ))}
        </div>
        <div className="footer-bottom">
          <p>VELNOC — 보이게 만들고, 흐르게 설계합니다.</p>
          <p className="footer-legal">
            <span>© 2026 VELNOC. All rights reserved.</span>
            <span className="footer-separator">/</span>
            <Link href="/legal/privacy">개인정보처리방침</Link>
            <span className="footer-separator">/</span>
            <Link href="/legal/terms">이용약관</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
