import { Send, MessageCircle, Share2, Globe, Mail, Phone, MapPin } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative mt-32 border-t border-card-border overflow-hidden bg-background transition-colors duration-500">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-brand-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 pt-24 pb-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 font-display text-3xl font-bold text-foreground mb-8 group">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-600 to-brand-400 flex items-center justify-center shadow-2xl group-hover:rotate-12 transition-transform duration-500">
                <span className="text-white text-xl">T</span>
              </div>
              Tari Tech
            </Link>
            <p className="text-foreground/80 max-w-sm mb-10 leading-relaxed text-lg font-medium">
              Architecting the digital future with precision code and radical innovation. Based in the heart of Nigeria, serving the global frontier.
            </p>

            <div className="flex flex-col gap-4 mb-10 text-base">
              <a href="mailto:contact@taritechnologies.com" className="flex items-center gap-3 text-foreground/80 hover:text-brand-500 transition-all group/item">
                <div className="w-10 h-10 rounded-xl bg-foreground/5 flex items-center justify-center group-hover/item:bg-brand-500/10 transition-colors">
                  <Mail size={18} className="text-brand-500" />
                </div>
                <span className="font-bold">contact@taritechnologies.com</span>
              </a>
              <a href="tel:+2348000000000" className="flex items-center gap-3 text-foreground/80 hover:text-purple-500 transition-all group/item">
                <div className="w-10 h-10 rounded-xl bg-foreground/5 flex items-center justify-center group-hover/item:bg-purple-500/10 transition-colors">
                  <Phone size={18} className="text-purple-500" />
                </div>
                <span className="font-bold">+234 (0) 800 000 0000</span>
              </a>
            </div>

            <div className="flex gap-4">
              {[
                { icon: <MessageCircle size={20} />, color: "hover:bg-brand-500", label: "Discord" },
                { icon: <Share2 size={20} />, color: "hover:bg-blue-600", label: "Twitter" },
                { icon: <Globe size={20} />, color: "hover:bg-purple-600", label: "LinkedIn" },
              ].map((social, i) => (
                <a key={i} href="#" className={`w-12 h-12 rounded-2xl bg-foreground/5 border border-card-border flex items-center justify-center text-foreground/80 hover:text-white ${social.color} transition-all duration-500 hover:-translate-y-1 shadow-lg shadow-transparent hover:shadow-current/20`}>
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="label-caps mb-8 !text-foreground font-black">Directory</h4>
            <ul className="space-y-4">
              {['Company', 'Portfolio', 'Services', 'FAQ', 'Tech News'].map((link) => (
                <li key={link}>
                  <Link href={`/${link.toLowerCase().replace(' ', '-')}`} className="text-foreground/80 hover:text-brand-500 font-bold transition-all flex items-center gap-2 group">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-500 scale-0 group-hover:scale-100 transition-transform" />
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="label-caps mb-8 !text-foreground font-black">Pulse</h4>
            <p className="text-foreground/80 text-sm mb-6 leading-relaxed font-medium">Join our network for exclusive technological insights and lab updates.</p>
            <div className="relative group">
              <input
                type="email"
                placeholder="Secure transmission..."
                className="w-full bg-foreground/5 border border-card-border rounded-2xl py-4 pl-5 pr-14 text-sm text-foreground focus:outline-none focus:border-brand-500 focus:bg-background transition-all"
              />
              <button className="absolute right-1.5 top-1.5 w-11 h-11 rounded-xl bg-foreground text-background flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-xl shadow-foreground/10">
                <Send size={18} className="-ml-0.5" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between pt-10 border-t border-card-border">
          <p className="label-caps !text-[10px] text-center md:text-left">© {new Date().getFullYear()} Tari Tech. <span className="hidden md:inline">Synchronizing the Future.</span></p>
          <div className="flex gap-8 mt-6 md:mt-0">
            <Link href="/privacy" className="label-caps !text-[10px] hover:text-foreground transition-colors">Privacy Protocol</Link>
            <Link href="/terms" className="label-caps !text-[10px] hover:text-foreground transition-colors">Terms of Ops</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

