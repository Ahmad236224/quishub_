import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import CTA from "@/components/sections/CTA";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { POST_BY_SLUG_QUERY, POST_SLUGS_QUERY, RELATED_POSTS_QUERY } from "@/sanity/lib/queries";
import type { Post, RelatedPost } from "@/sanity/lib/types";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await client.fetch<string[]>(POST_SLUGS_QUERY);
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await client.fetch<Post | null>(POST_BY_SLUG_QUERY, { slug });

  if (!post) {
    return { title: "Article Not Found | Quishub" };
  }

  return {
    title: `${post.title} | Quishub Insights`,
    description: post.excerpt ?? undefined,
  };
}

function formatDate(publishedAt: string | null) {
  if (!publishedAt) return "";
  return new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric" }).format(
    new Date(publishedAt)
  );
}

function coverImageUrl(coverImage: Post["coverImage"], width: number, height: number) {
  if (!coverImage) return null;
  try {
    return urlFor(coverImage).width(width).height(height).fit("crop").url();
  } catch {
    return null;
  }
}

const portableTextComponents: PortableTextComponents = {
  block: {
    h2: ({ children }) => (
      <h2
        className="font-display mt-10 font-semibold tracking-[-0.02em] text-quishub-black"
        style={{ fontSize: "26px" }}
      >
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3
        className="font-display mt-8 font-semibold tracking-[-0.01em] text-quishub-black"
        style={{ fontSize: "21px" }}
      >
        {children}
      </h3>
    ),
    normal: ({ children }) => (
      <p className="text-[17px] leading-body text-quishub-muted">{children}</p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l border-ink pl-5 font-ui text-[19px] leading-snug text-quishub-black">
        {children}
      </blockquote>
    ),
  },
  types: {
    image: ({ value }) => {
      const src = coverImageUrl(value, 1200, 700);
      if (!src) return null;
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={value.alt ?? ""}
          className="w-full rounded-lg border border-line"
        />
      );
    },
  },
};

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await client.fetch<Post | null>(POST_BY_SLUG_QUERY, { slug });

  if (!post) {
    notFound();
  }

  const related = post.category
    ? await client.fetch<RelatedPost[]>(RELATED_POSTS_QUERY, {
        category: post.category,
        slug: post.slug.current,
      })
    : [];

  const heroImage = coverImageUrl(post.coverImage, 1600, 900);

  return (
    <>

      <article className="relative overflow-hidden pt-32 pb-20 md:pt-40">
        <div className="container-content relative z-10 max-w-[820px]">
          <Link href="/blog" className="w-fit font-mono text-[12px] text-mute transition-colors hover:text-ink">
            ← All insights
          </Link>

          {post.category && <p className="label-mono mt-10">{post.category}</p>}

          <h1 className="mt-5 font-display text-display-lg font-semibold">{post.title}</h1>

          <p className="mt-7 border-b border-line pb-8 font-mono text-[12px] text-mute">
            {["Quishub team", post.readTime, formatDate(post.publishedAt)].filter(Boolean).join(" · ")}
          </p>

          {heroImage && (
            <div className="relative mt-10 overflow-hidden rounded-lg border border-line">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={heroImage} alt={post.title} className="h-full w-full object-cover" />
            </div>
          )}

          <div className="mt-10 space-y-6">
            {post.content && post.content.length > 0 ? (
              <PortableText value={post.content} components={portableTextComponents} />
            ) : post.excerpt ? (
              <p className="text-[17px] leading-body text-quishub-muted">{post.excerpt}</p>
            ) : null}
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section className="border-t border-line py-16 md:py-24">
          <div className="wrap">
            <p className="label-mono">More on {post.category}</p>
            <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-3">
              {related.map((rel) => {
                const relImage = coverImageUrl(rel.coverImage, 600, 340);
                return (
                  <Link key={rel._id} href={`/blog/${rel.slug.current}`} className="group block">
                    <div className="aspect-video overflow-hidden rounded-md border border-line bg-[var(--bg-alt)]">
                      {relImage && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={relImage} alt={rel.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]" />
                      )}
                    </div>
                    <h3 className="mt-4 font-ui text-[18px] font-medium leading-snug group-hover:underline group-hover:underline-offset-4">{rel.title}</h3>
                    {rel.readTime && <p className="mt-2 font-mono text-[11.5px] text-mute">{rel.readTime}</p>}
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <CTA />
    </>
  );
}
