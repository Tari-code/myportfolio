import Image from "next/image";
import Link from "next/link";
import { Calendar, ArrowRight } from "lucide-react";

interface NewsCardProps {
  article: {
    _id: string;
    slug: string;
    title: string;
    category: string;
    createdAt: string;
    imageUrl?: string;
    excerpt: string;
  };
}

export default function NewsCard({ article }: NewsCardProps) {
  return (
    <Link 
      href={`/news/${article.slug}`}
      className="glass-panel rounded-[2.5rem] overflow-hidden group flex flex-col hover:-translate-y-2 transition-all duration-500 hover:shadow-2xl hover:shadow-brand-500/10 border border-card-border"
    >
      <div className="h-64 w-full relative overflow-hidden bg-foreground/5">
        {article.imageUrl ? (
          <Image
            src={article.imageUrl}
            alt={article.title}
            fill
            className="object-cover opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 ease-expo"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-foreground/5 to-foreground/10">
            <span className="text-foreground/10 font-display font-bold text-3xl">PULSE</span>
          </div>
        )}
        <div className="absolute top-5 left-5">
          <span className="px-4 py-1.5 bg-background/80 backdrop-blur-xl rounded-xl text-[10px] label-caps !text-brand-500 border border-card-border">
            {article.category}
          </span>
        </div>
      </div>
      
      <div className="p-10 flex flex-col flex-1">
        <div className="flex items-center gap-2 text-[10px] label-caps mb-4 text-foreground/40 font-bold">
          <Calendar size={12} className="text-brand-500" />
          {new Date(article.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </div>
        
        <h3 className="text-2xl font-display font-bold text-foreground mb-4 group-hover:text-brand-500 transition-colors line-clamp-2 leading-tight">
          {article.title}
        </h3>
        
        <p className="text-foreground/80 leading-relaxed mb-8 line-clamp-3 flex-1 font-medium">
          {article.excerpt}
        </p>
        
        <div className="mt-auto flex items-center gap-2 text-brand-500 font-bold group-hover:gap-4 transition-all">
          Access Node <ArrowRight size={18} />
        </div>
      </div>
    </Link>
  );
}
