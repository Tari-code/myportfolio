import { Globe, ArrowRight, Shield, Zap, Server, Cloud } from "lucide-react";
import Link from "next/link";

export default function CloudPage() {
  return (
    <div className="pt-48 pb-32 px-6 max-w-7xl mx-auto min-h-screen relative">
      <div className="absolute top-[20%] left-[10%] w-[500px] h-[500px] bg-yellow-500/5 blur-[150px] rounded-full pointer-events-none" />
      
      <div className="relative z-10">
        <div className="mb-12 inline-flex items-center justify-center w-20 h-20 rounded-[2rem] bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 shadow-xl">
          <Globe size={40} />
        </div>
        
        <h1 className="text-5xl md:text-8xl font-display font-bold text-foreground mb-8 tracking-tighter">
          Global <br />
          <span className="text-gradient">Infrastructure</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-foreground/80 max-w-3xl mb-16 leading-relaxed font-medium">
          We engineer the invisible foundations of the global digital economy. From serverless deployments to complex microservices orchestration, our cloud architectures are built for infinite scale and zero downtime.
        </p>

        <div className="grid md:grid-cols-2 gap-8 mb-20">
          {[
            { icon: <Server className="text-yellow-500" />, title: "Orchestration", desc: "Automating the deployment, scaling, and management of containerized applications with Kubernetes." },
            { icon: <Shield className="text-brand-500" />, title: "Zero Trust Security", desc: "Implementing rigorous security protocols and identity management to protect your core infrastructure." },
            { icon: <Zap className="text-purple-500" />, title: "Serverless Speed", desc: "Leveraging edge computing and serverless functions for instant global scalability and cost efficiency." },
            { icon: <Cloud className="text-blue-500" />, title: "Hybrid Cloud", desc: "Seamlessly bridging on-premise systems with multi-cloud environments for maximum flexibility." },
          ].map((item, i) => (
            <div key={i} className="glass-panel p-10 rounded-[3rem] border border-card-border hover:border-yellow-500/30 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-foreground/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">{item.title}</h3>
              <p className="text-foreground/70 leading-relaxed font-medium">{item.desc}</p>
            </div>
          ))}
        </div>

        <Link href="/contact" className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-yellow-600 text-white font-bold text-lg hover:scale-105 transition-all shadow-2xl shadow-yellow-600/20 active:scale-95">
          Provision Node <ArrowRight size={22} />
        </Link>
      </div>
    </div>
  );
}
