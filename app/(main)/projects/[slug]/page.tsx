import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Calendar, User, Tag, ArrowRight } from "lucide-react";
import PortfolioItem from "@/components/PortfolioItem";
import { notFound } from "next/navigation";
import connectDB from "@/lib/mongodb";
import Project from "@/lib/models/Project";

export const dynamic = 'force-dynamic';

async function getProject(slug: string) {
  try {
    await connectDB();
    return await Project.findOne({ slug }).lean();
  } catch (error) {
    return null;
  }
}

async function getRelatedProjects(currentSlug: string) {
  try {
    await connectDB();
    return await Project.find({ slug: { $ne: currentSlug } }).sort({ createdAt: -1 }).limit(3).lean();
  } catch (error) {
    return [];
  }
}

export default async function ProjectDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const project: any = await getProject(resolvedParams.slug);
  const relatedProjects: any[] = await getRelatedProjects(resolvedParams.slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="pt-32 pb-24 px-6 max-w-5xl mx-auto min-h-screen">
      <Link href="/projects" className="inline-flex items-center gap-2 text-foreground/60 hover:text-brand-500 transition-colors mb-8 font-medium">
        <ArrowLeft size={18} /> Back to Projects
      </Link>

      <div className="mb-12">
        <div className="flex flex-wrap gap-3 mb-6">
          <span className="px-3 py-1 bg-brand-500/20 text-brand-500 rounded-full text-sm font-bold tracking-wide uppercase">
            {project.category}
          </span>
        </div>
        <h1 className="text-4xl md:text-6xl font-display font-bold text-foreground mb-6">
          {project.title}
        </h1>
        <p className="text-xl text-foreground/70 max-w-3xl leading-relaxed">
          {project.description}
        </p>
      </div>

      <div className="w-full h-[400px] md:h-[600px] rounded-3xl overflow-hidden relative mb-16 border border-card-border shadow-2xl shadow-brand-500/10">
        {project.imageUrl ? (
          <Image
            src={project.imageUrl}
            alt={project.title}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-brand-900 to-purple-900 flex items-center justify-center">
            <span className="text-6xl font-display font-bold text-white/10">{project.title}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="md:col-span-2 space-y-8">
          <div>
            <h2 className="text-2xl font-display font-bold text-foreground mb-4">About the Project</h2>
            <div className="text-foreground/70 leading-relaxed space-y-4">
              {project.fullDescription ? (
                <p>{project.fullDescription}</p>
              ) : (
                <p>{project.description} We are currently updating the detailed case study for this project. Please check back later for a comprehensive overview of our process and the solutions implemented.</p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="glass-panel p-6 rounded-2xl border border-card-border space-y-6">
            {project.client && (
              <div>
                <div className="text-xs text-foreground/60 uppercase tracking-wider font-bold mb-2 flex items-center gap-2">
                  <User size={14} /> Client
                </div>
                <div className="text-foreground font-medium">{project.client}</div>
              </div>
            )}
            
            {project.duration && (
              <div>
                <div className="text-xs text-foreground/60 uppercase tracking-wider font-bold mb-2 flex items-center gap-2">
                  <Calendar size={14} /> Duration
                </div>
                <div className="text-foreground font-medium">{project.duration}</div>
              </div>
            )}

            {project.tags && project.tags.length > 0 && (
              <div>
                <div className="text-xs text-foreground/60 uppercase tracking-wider font-bold mb-3 flex items-center gap-2">
                  <Tag size={14} /> Project Tags
                </div>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag: string, idx: number) => (
                    <span key={idx} className="text-xs px-2.5 py-1 rounded-md bg-foreground/5 border border-card-border text-foreground/80 font-bold uppercase tracking-wider">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {project.link && (
              <div className="pt-4 border-t border-card-border">
                <a 
                  href={project.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-medium flex items-center justify-center gap-2 transition-colors"
                >
                  Visit Live Site <ExternalLink size={16} />
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Related Projects Section */}
      {relatedProjects.length > 0 && (
        <div className="mt-32 pt-16 border-t border-card-border">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-display font-bold text-foreground">Related <span className="text-gradient">Artifacts</span></h2>
            <Link href="/projects" className="flex items-center gap-2 text-brand-500 font-bold hover:gap-4 transition-all uppercase text-xs tracking-widest">
              View All <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {relatedProjects.map((rel: any) => (
              <PortfolioItem key={rel._id.toString()} {...rel} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
