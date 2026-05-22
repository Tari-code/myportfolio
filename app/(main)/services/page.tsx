import { Palette, Code, Zap, Globe, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export default function ServicesPage() {
  const services = [
    {
      icon: <Palette className="text-brand-500" />,
      title: "Immersive UI/UX",
      href: "/services/ui-ux",
      desc: "Sensory-driven designs that transcend the screen and create deep emotional connections with users.",
      features: ["User Research", "Visual Strategy", "Prototyping", "Accessibility"]
    },
    {
      icon: <Code className="text-purple-500" />,
      title: "Full-Stack Velocity",
      href: "/services/web-dev",
      desc: "High-performance architectures built with the speed of thought and the stability of steel.",
      features: ["Next.js Excellence", "API Architectures", "Database Engineering", "Performance"]
    },
    {
      icon: <Zap className="text-blue-500" />,
      title: "AI Intelligence",
      href: "/services/ai",
      desc: "Integrating cognitive computing to automate complexity and unlock hidden business potential.",
      features: ["Autonomous Agents", "Custom LLMs", "Automation", "Predictive Analytics"]
    },
    {
      icon: <Globe className="text-yellow-500" />,
      title: "Cloud Infrastructure",
      href: "/services/cloud",
      desc: "Scalable, secure, and cost-effective cloud architectures engineered for infinite growth.",
      features: ["Orchestration", "Zero Trust Security", "Serverless", "Hybrid Cloud"]
    }
  ];

  return (
    <div className="pt-48 pb-32 px-6 max-w-7xl mx-auto min-h-screen relative">
      <div className="absolute top-[20%] right-[10%] w-[500px] h-[500px] bg-brand-500/5 blur-[150px] rounded-full pointer-events-none" />
      
      <div className="relative z-10">
        <div className="mb-12 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-500 text-xs font-bold backdrop-blur-xl shadow-lg">
          <Sparkles size={14} /> Our Capabilities
        </div>
        
        <h1 className="text-6xl md:text-8xl font-display font-bold text-foreground mb-8 tracking-tighter">
          Engineering <br />
          <span className="text-gradient">Impact</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-foreground/80 max-w-3xl mb-24 leading-relaxed font-medium">
          We combine deep technical expertise with radical creativity to deliver solutions that aren&apos;t just built, but engineered to define the digital frontier.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {services.map((service, i) => (
            <Link 
              key={i} 
              href={service.href} 
              className="glass-panel p-10 md:p-12 rounded-[3.5rem] border border-card-border hover:border-brand-500/30 transition-all group flex flex-col h-full hover:scale-[1.02]"
            >
              <div className="w-20 h-20 rounded-[2rem] bg-foreground/5 flex items-center justify-center mb-10 group-hover:rotate-6 transition-transform shadow-inner">
                {service.icon}
              </div>
              <h3 className="text-4xl font-display font-bold text-foreground mb-6 group-hover:text-brand-500 transition-colors">
                {service.title}
              </h3>
              <p className="text-foreground/70 text-lg leading-relaxed font-medium mb-10 flex-1">
                {service.desc}
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-10">
                {service.features.map((f, j) => (
                  <div key={j} className="flex items-center gap-2 text-xs font-bold text-foreground/40 uppercase tracking-widest">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-500/50" />
                    {f}
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 text-brand-500 font-bold uppercase text-xs tracking-[0.2em] group-hover:gap-4 transition-all">
                Explore Capability <ArrowRight size={18} />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
