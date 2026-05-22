import { Zap, ArrowRight, Brain, Sparkles, Cpu, Bot } from "lucide-react";
import Link from "next/link";

export default function AIPage() {
  return (
    <div className="pt-48 pb-32 px-6 max-w-7xl mx-auto min-h-screen relative">
      <div className="absolute top-[20%] right-[10%] w-[500px] h-[500px] bg-blue-500/5 blur-[150px] rounded-full pointer-events-none" />
      
      <div className="relative z-10">
        <div className="mb-12 inline-flex items-center justify-center w-20 h-20 rounded-[2rem] bg-blue-500/10 text-blue-500 border border-blue-500/20 shadow-xl">
          <Zap size={40} />
        </div>
        
        <h1 className="text-5xl md:text-8xl font-display font-bold text-foreground mb-8 tracking-tighter">
          Cognitive <br />
          <span className="text-gradient">Intelligence</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-foreground/80 max-w-3xl mb-16 leading-relaxed font-medium">
          We integrate sophisticated LLMs and autonomous agents into your core workflows. Our AI solutions don't just process data; they understand complexity and unlock hidden potential through intelligent automation.
        </p>

        <div className="grid md:grid-cols-2 gap-8 mb-20">
          {[
            { icon: <Bot className="text-blue-500" />, title: "Autonomous Agents", desc: "Digital workers that can plan, execute, and learn from complex tasks without constant supervision." },
            { icon: <Brain className="text-purple-500" />, title: "Custom LLMs", desc: "Fine-tuning and deploying large language models tailored specifically to your private data and brand voice." },
            { icon: <Cpu className="text-brand-500" />, title: "Workflow Automation", desc: "Eliminating cognitive load by automating repetitive decision-making processes with neural precision." },
            { icon: <Sparkles className="text-yellow-500" />, title: "Predictive Analytics", desc: "Using advanced machine learning to forecast trends and optimize business outcomes before they happen." },
          ].map((item, i) => (
            <div key={i} className="glass-panel p-10 rounded-[3rem] border border-card-border hover:border-blue-500/30 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-foreground/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">{item.title}</h3>
              <p className="text-foreground/70 leading-relaxed font-medium">{item.desc}</p>
            </div>
          ))}
        </div>

        <Link href="/contact" className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-blue-600 text-white font-bold text-lg hover:scale-105 transition-all shadow-2xl shadow-blue-600/20 active:scale-95">
          Deploy AI Agent <ArrowRight size={22} />
        </Link>
      </div>
    </div>
  );
}
