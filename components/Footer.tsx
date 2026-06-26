import { Send, MessageCircle, Share2, Globe, Mail, Phone } from "lucide-react";
import Link from "next/link";
const DIRECTORY = [
  { label: "About", href: "/about" },
  { label: "Projects", href: "/projects" },
  { label: "Services", href: "/services" },
  { label: "FAQ", href: "/faq" },
  { label: "News", href: "/news" },
];

export default function Footer() {
  return (
    <footer className="relative mt-24 border-t border-card-border bg-foreground/[0.01]">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-brand-500/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-6 pt-16 pb-10 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-6 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-brand flex items-center justify-center text-white shadow-glow transition-transform group-hover:scale-105">
                <span className="font-bold text-sm">T</span>
              </div>
              <span className="font-semibold text-xl tracking-tight">Tari Tech</span>
            </Link>
            <p className="text-muted-foreground max-w-sm mb-8 leading-relaxed">
              Enterprise-grade digital products — engineered in Nigeria, delivered globally.
            </p>

            <div className="space-y-3 mb-8">
              <a
                href="mailto:contact@taritechnologies.com"
                className="flex items-center gap-3 text-sm text-muted-foreground hover:text-brand-500 transition-colors group"
              >
                <div className="w-9 h-9 rounded-lg bg-foreground/5 flex items-center justify-center group-hover:bg-brand-500/10">
                  <Mail size={16} className="text-brand-500" />
                </div>
                contact@taritechnologies.com
              </a>
              <a
                href="tel:+2348000000000"
                className="flex items-center gap-3 text-sm text-muted-foreground hover:text-secondary-500 transition-colors group"
              >
                <div className="w-9 h-9 rounded-lg bg-foreground/5 flex items-center justify-center group-hover:bg-secondary-500/10">
                  <Phone size={16} className="text-secondary-500" />
                </div>
                +234 (0) 800 000 0000
              </a>
            </div>

            <div className="flex gap-2">
              {[
                { icon: MessageCircle, label: "Discord" },
                { icon: Share2, label: "Twitter" },
                { icon: Globe, label: "LinkedIn" },
              ].map(({ icon: Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="w-10 h-10 rounded-xl bg-foreground/5 border border-card-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-brand-500/10 hover:border-brand-500/20 transition-all"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-caption mb-5 !text-foreground">Directory</h4>
            <ul className="space-y-3">
              {DIRECTORY.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-brand-500 font-medium transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-caption mb-5 !text-foreground">Newsletter</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Product insights and engineering updates, monthly.
            </p>
            <div className="relative">
              <input
                type="email"
                placeholder="you@company.com"
                aria-label="Email for newsletter"
                className="w-full rounded-xl border border-card-border bg-foreground/[0.03] py-3 pl-4 pr-12 text-sm focus:outline-none focus:border-brand-500/50 focus:ring-4 focus:ring-brand-500/10 transition-all"
              />
              <button
                aria-label="Subscribe"
                className="absolute right-1.5 top-1.5 w-9 h-9 rounded-lg bg-brand-600 text-white flex items-center justify-center hover:bg-brand-500 transition-colors"
              >
                <Send size={15} />
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-card-border gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Tari Technologies. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
