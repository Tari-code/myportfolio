import { ArrowLeft, Mail, Phone, MapPin, Globe, Award, Cpu } from "lucide-react";
import Link from "next/link";

export default function CEODetailsPage() {
  const techStack = [
    {
      category: "Frontend",
      skills: ["React", "Next.js", "Tailwind CSS", "TypeScript", "GSAP"]
    },
    {
      category: "Backend & Database",
      skills: ["Node.js", "Python", "PostgreSQL", "MongoDB", "Prisma"]
    },
    {
      category: "AI & Cloud",
      skills: ["OpenAI", "AWS", "Docker", "Vercel"]
    }
  ];

  return (
    <div className="pt-24 sm:pt-32 pb-20 px-6 max-w-7xl mx-auto min-h-screen relative">
      <div className="absolute top-[10%] right-[10%] w-[600px] h-[600px] bg-brand-500/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[10%] left-[10%] w-[500px] h-[500px] bg-purple-500/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        <Link href="/about" className="inline-flex items-center gap-2 text-foreground/50 hover:text-brand-500 font-bold mb-12 transition-all group">
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Back to About Tari Tech
        </Link>

        <div className="flex flex-col md:flex-row gap-12 items-start mb-20">
          <div className="w-full md:w-1/3 aspect-square rounded-[2rem] sm:rounded-[3rem] bg-gradient-to-br from-brand-500/20 to-purple-500/20 border border-card-border overflow-hidden relative group">
            <div className="absolute inset-0 bg-brand-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute inset-0 flex items-center justify-center text-brand-500">
              <Cpu size={80} className="opacity-20 border" />
            </div>
            <img src="/image.png" alt="Paul Gambo" className="w-full object-cover" />
            {/* Placeholder for actual image if available */}
          </div>
          <div className="flex-1">
            <h1 className="text-3xl sm:text-5xl md:text-7xl font-display font-bold text-foreground mb-4">
              Paul <span className="text-gradient">Gambo</span>
            </h1>
            <p className="text-xl font-bold text-brand-500 mb-6 uppercase tracking-[0.2em]">Founder & CEO, Tari Tech</p>
            <p className="text-lg text-foreground/90 leading-relaxed font-medium">
              I am a passionate Computer Scientist and Full-Stack Software Engineer based in Nasarawa State, Nigeria. I specialize in building next-generation web applications, AI-driven platforms, and robust digital solutions that solve real-world problems. With a deep foundation in computer science principles, I engineer products that not only look beautiful but perform flawlessly at scale.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 mb-20">
          {techStack.map((group, i) => (
            <div key={i} className="glass-panel p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-card-border hover:border-brand-500/30 transition-all group">
              <h3 className="text-[10px] sm:text-xs font-bold text-foreground/50 uppercase tracking-[0.2em] mb-6 flex items-center justify-between">
                {group.category}
                <Award size={14} className="text-brand-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              </h3>
              <div className="flex flex-wrap gap-2">
                {group.skills.map(skill => (
                  <span key={skill} className="px-3 py-2 bg-foreground/5 border border-card-border rounded-xl text-foreground text-[13px] sm:text-sm font-bold group-hover:bg-brand-500/5 group-hover:border-brand-500/20 transition-all">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="glass-panel p-6 sm:p-10 rounded-[2rem] sm:rounded-[3rem] border border-card-border relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/5 blur-3xl rounded-full" />
          <h2 className="text-3xl font-display font-bold text-foreground mb-10 flex items-center gap-3">
            <Globe className="text-brand-500" /> Professional Network
          </h2>
          <div className="grid sm:grid-cols-2 gap-8">
            <div className="space-y-6">
              <a href="mailto:contact@herakonlab.com" className="flex items-center gap-4 text-foreground/90 hover:text-foreground transition-all group/link">
                <div className="w-12 h-12 rounded-2xl bg-foreground/5 border border-card-border flex items-center justify-center group-hover/link:bg-brand-500/10 transition-all">
                  <Mail size={20} className="text-brand-500" />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-foreground/50 uppercase tracking-widest mb-1">Email</div>
                  <div className="font-bold">contact@herakonlab.com</div>
                </div>
              </a>
              <a href="tel:+2348000000000" className="flex items-center gap-4 text-foreground/90 hover:text-foreground transition-all group/link">
                <div className="w-12 h-12 rounded-2xl bg-foreground/5 border border-card-border flex items-center justify-center group-hover/link:bg-purple-500/10 transition-all">
                  <Phone size={20} className="text-purple-500" />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-foreground/50 uppercase tracking-widest mb-1">Phone</div>
                  <div className="font-bold">+234 (0) 800 000 0000</div>
                </div>
              </a>
            </div>
            <div className="space-y-6">
              <div className="flex items-center gap-4 text-foreground/90 group/link">
                <div className="w-12 h-12 rounded-2xl bg-foreground/5 border border-card-border flex items-center justify-center">
                  <MapPin size={20} className="text-yellow-500" />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-foreground/50 uppercase tracking-widest mb-1">Location</div>
                  <div className="font-bold">Nasarawa State, Nigeria</div>
                </div>
              </div>
              <div className="flex gap-4 pt-2">
                <a href="#" aria-label="GitHub" className="w-12 h-12 rounded-2xl bg-foreground/5 border border-card-border flex items-center justify-center hover:bg-foreground hover:text-background transition-all shadow-xl">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
                    <path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.483 0-.237-.009-.868-.013-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.004.071 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.026 2.747-1.026.546 1.378.202 2.397.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.847-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482C19.138 20.2 22 16.447 22 12.021 22 6.484 17.522 2 12 2z" />
                  </svg>
                </a>
                <a href="#" aria-label="LinkedIn" className="w-12 h-12 rounded-2xl bg-foreground/5 border border-card-border flex items-center justify-center hover:bg-[#0077b5] hover:text-white transition-all shadow-xl">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
