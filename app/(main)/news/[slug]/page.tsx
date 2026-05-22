import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, User, Tag, ArrowRight } from "lucide-react";
import NewsCard from "@/components/NewsCard";
import { notFound } from "next/navigation";
import connectDB from "@/lib/mongodb";
import News from "@/lib/models/News";

export const dynamic = 'force-dynamic';

async function getArticle(slug: string) {
  try {
    await connectDB();
    return await News.findOne({ slug }).lean();
  } catch (error) {
    return null;
  }
}

async function getRelatedNews(currentSlug: string) {
  try {
    await connectDB();
    return await News.find({ slug: { $ne: currentSlug } }).sort({ createdAt: -1 }).limit(3).lean();
  } catch (error) {
    return [];
  }
}

export default async function NewsArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const article: any = await getArticle(resolvedParams.slug);
  const relatedNews: any[] = await getRelatedNews(resolvedParams.slug);

  if (!article) {
    notFound();
  }

  return (
    <div className="pt-32 pb-24 px-6 max-w-4xl mx-auto min-h-screen">
      <Link href="/news" className="inline-flex items-center gap-2 text-foreground/60 hover:text-brand-500 transition-colors mb-8 font-medium">
        <ArrowLeft size={18} /> Back to News
      </Link>

      <div className="mb-10 text-center">
        <div className="flex justify-center flex-wrap gap-3 mb-6">
          <span className="px-3 py-1 bg-brand-500/20 text-brand-500 rounded-full text-sm font-bold tracking-wide uppercase border border-brand-500/20">
            {article.category}
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-6 leading-tight">
          {article.title}
        </h1>
        
        <div className="flex items-center justify-center gap-6 text-foreground/40 text-sm font-medium uppercase tracking-wider">
          <div className="flex items-center gap-2">
            <User size={16} className="text-brand-500" />
            {article.author || "Paul Gambo"}
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-brand-500" />
            {new Date(article.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </div>
        </div>
      </div>

      <div className="w-full h-[300px] md:h-[500px] rounded-3xl overflow-hidden relative mb-12 border border-card-border shadow-2xl shadow-brand-500/10">
        {article.imageUrl ? (
          <Image
            src={article.imageUrl}
            alt={article.title}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-brand-900 to-purple-900 flex items-center justify-center">
            <span className="text-4xl font-display font-bold text-white/10">NEWS</span>
          </div>
        )}
      </div>

      <article className="prose prose-lg max-w-none prose-headings:font-display prose-headings:font-bold prose-headings:text-foreground prose-p:text-foreground/80 prose-a:text-brand-500 hover:prose-a:text-brand-400 prose-strong:text-foreground">
        {article.content.split('\n').map((paragraph: string, i: number) => (
          <p key={i} className="leading-relaxed mb-6">
            {paragraph}
          </p>
        ))}
      </article>

      {article.tags && article.tags.length > 0 && (
        <div className="mt-16 pt-8 border-t border-card-border">
          <div className="flex items-center gap-3 text-sm font-bold text-foreground/30 uppercase tracking-widest mb-4">
            <Tag size={16} /> Related Tags
          </div>
          <div className="flex flex-wrap gap-2">
            {article.tags.map((tag: string, idx: number) => (
              <span key={idx} className="px-4 py-2 rounded-full bg-foreground/5 border border-card-border text-foreground/70 text-sm hover:bg-foreground/10 transition-colors cursor-pointer">
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Related News Section */}
      {relatedNews.length > 0 && (
        <div className="mt-32 pt-16 border-t border-card-border">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-display font-bold text-foreground">Related <span className="text-gradient">Transmissions</span></h2>
            <Link href="/news" className="flex items-center gap-2 text-brand-500 font-bold hover:gap-4 transition-all uppercase text-xs tracking-widest">
              View All <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedNews.map((rel: any) => (
              <NewsCard key={rel._id.toString()} article={rel} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
