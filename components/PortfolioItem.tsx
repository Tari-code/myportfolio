import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

export interface PortfolioItemProps {
  title: string;
  slug: string;
  category: string;
  description: string;
  imageUrl?: string;
  tags: string[];
}

export default function PortfolioItem({
  title,
  slug,
  category,
  description,
  imageUrl,
  tags,
}: PortfolioItemProps) {
  return (
    <Link
      href={`/projects/${slug || "#"}`}
      className="group block h-full glass-panel rounded-2xl overflow-hidden border border-card-border card-interactive"
    >
      <div className="h-48 w-full bg-muted relative overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-500/5 to-secondary-500/5">
            <span className="text-2xl font-bold text-foreground/10">
              {title.substring(0, 2).toUpperCase()}
            </span>
          </div>
        )}
        <div className="absolute top-3 left-3">
          <Badge variant="brand">{category}</Badge>
        </div>
        <div className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-background/80 backdrop-blur flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <ArrowUpRight size={14} className="text-brand-500" />
        </div>
      </div>

      <div className="p-5">
        <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-brand-500 transition-colors">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{description}</p>

        <div className="flex flex-wrap gap-1.5">
          {tags.slice(0, 3).map((tag, idx) => (
            <span
              key={idx}
              className="text-[10px] px-2 py-1 rounded-md bg-foreground/5 text-muted-foreground font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
