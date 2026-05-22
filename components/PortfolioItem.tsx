import Image from "next/image";
import Link from "next/link";

interface PortfolioItemProps {
  title: string;
  slug: string;
  category: string;
  description: string;
  imageUrl?: string;
  tags: string[];
}

export default function PortfolioItem({ title, slug, category, description, imageUrl, tags }: PortfolioItemProps) {
  return (
    <Link href={`/projects/${slug || '#'}`} className="glass-panel rounded-[2.5rem] overflow-hidden group hover:-translate-y-2 transition-all duration-500 hover:shadow-2xl hover:shadow-brand-500/10 block border border-card-border">
      <div className="h-56 w-full bg-foreground/5 relative overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 ease-expo"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-foreground/5 to-foreground/10">
            <span className="font-display text-2xl font-bold opacity-10 text-foreground tracking-wider">
              {title.substring(0, 2).toUpperCase()}
            </span>
          </div>
        )}
        <div className="absolute top-5 left-5">
          <span className="px-4 py-1.5 bg-background/80 backdrop-blur-xl rounded-xl text-[10px] label-caps !text-brand-500 border border-card-border">
            {category}
          </span>
        </div>
      </div>
      
      <div className="p-8">
        <h3 className="text-2xl font-display font-bold mb-3 text-foreground group-hover:text-brand-500 transition-colors">
          {title}
        </h3>
        <p className="text-base text-foreground/60 mb-8 line-clamp-2 font-medium">
          {description}
        </p>
        
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, idx) => (
            <span 
              key={idx}
              className="text-[10px] px-3 py-1.5 rounded-lg bg-foreground/5 border border-card-border text-foreground/60 label-caps !tracking-[0.1em]"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
