import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { GithubIcon } from "@/components/ui/icons";
import { getProject, getProjectSlugs } from "@/lib/projects";
import { siteConfig } from "@/lib/site-config";

const ProjectExplorer = dynamic(() =>
  import("@/app/components/project-explorer").then((mod) => mod.ProjectExplorer),
);

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getProjectSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) {
    return { title: "Project" };
  }

  return {
    title: project.name,
    description: project.summary,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      title: `${project.name} · ${siteConfig.name}`,
      description: project.summary,
      url: `${siteConfig.url}/projects/${project.slug}`,
    },
  };
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) {
    notFound();
  }

  return (
    <main>
      <section className="relative isolate overflow-hidden border-b border-line">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
        >
          <div className="absolute inset-0 bg-dot-grid opacity-35 [mask-image:radial-gradient(65%_55%_at_20%_10%,black,transparent)]" />
          <div className="absolute top-[-15%] right-[-8%] h-[55%] w-[55%] rounded-full bg-[radial-gradient(closest-side,rgb(20_184_166/0.16),transparent)] blur-2xl" />
        </div>

        <div className="container-page section-y pt-[calc(var(--spacing-navbar)+2.5rem)] pb-14 sm:pb-16">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 font-mono text-[0.7rem] tracking-[0.14em] text-ink-subtle uppercase transition-colors hover:text-accent-600"
          >
            <ArrowLeft className="size-3.5" aria-hidden />
            All projects
          </Link>

          <div className="mt-8 grid items-center gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(16rem,0.95fr)] lg:gap-12">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <Badge tone={project.featured ? "accent" : "soft"}>
                  {project.label}
                </Badge>
              </div>

              <h1 className="mt-5 max-w-xl font-display text-display-md font-semibold text-ink">
                {project.name}
              </h1>
              <p className="mt-4 max-w-xl text-lg font-medium text-ink sm:text-xl">
                {project.tagline}
              </p>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-muted sm:text-lg">
                {project.summary}
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                {project.repository ? (
                  <ButtonLink
                    href={project.repository}
                    target="_blank"
                    rel="noreferrer noopener"
                    data-magnetic
                    aria-label={`View ${project.name} source on GitHub`}
                  >
                    <GithubIcon className="size-4" />
                    View on GitHub
                    <ArrowUpRight className="size-4" aria-hidden />
                  </ButtonLink>
                ) : null}
                <p className="font-mono text-[0.65rem] tracking-[0.12em] text-ink-subtle uppercase">
                  {project.meta}
                </p>
              </div>
            </div>

            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[1.25rem] border border-line bg-white/40 shadow-panel">
              <Image
                src={project.heroImage}
                alt={`${project.name} system architecture mockup`}
                fill
                sizes="(max-width: 1024px) 100vw, 28rem"
                className="object-cover object-center"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      <ProjectExplorer panels={project.story} projectName={project.name} />
    </main>
  );
}
