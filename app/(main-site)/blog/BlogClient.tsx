"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Label from "@/components/system/Label";
import Arrow from "@/components/system/Arrow";
import QWatermark from "@/components/brand/QWatermark";
import CTA from "@/components/sections/CTA";
import { urlFor } from "@/sanity/lib/image";
import type { Post } from "@/sanity/lib/types";
import { cn } from "@/lib/utils";

const ALL_INSIGHTS = "All";

function formatDate(publishedAt: string | null) {
  if (!publishedAt) return "";
  return new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric" }).format(new Date(publishedAt));
}

function coverImageUrl(post: Post) {
  if (!post.coverImage) return null;
  try {
    return urlFor(post.coverImage).width(1200).height(700).fit("crop").url();
  } catch {
    return null;
  }
}

function CoverImage({ post, className }: { post: Post; className?: string }) {
  const src = coverImageUrl(post);
  if (!src) {
    return (
      <div className={cn("flex items-center justify-center bg-[var(--bg-alt)]", className)}>
        <QWatermark className="static h-16 w-16 translate-y-0 opacity-20" />
      </div>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={post.title} className={cn("object-cover transition-transform duration-700 group-hover:scale-[1.02]", className)} />
  );
}

function Meta({ post }: { post: Post }) {
  return (
    <p className="font-mono text-[11.5px] text-mute">
      {[post.category, post.readTime, formatDate(post.publishedAt)].filter(Boolean).join(" · ")}
    </p>
  );
}

export default function BlogClient({ posts }: { posts: Post[] }) {
  const [featured, ...rest] = posts;

  const categories = useMemo(() => {
    const unique = Array.from(new Set(rest.map((p) => p.category).filter((c): c is string => Boolean(c))));
    return [ALL_INSIGHTS, ...unique];
  }, [rest]);

  const [activeCategory, setActiveCategory] = useState<string>(ALL_INSIGHTS);

  const filteredPosts = useMemo(() => {
    if (activeCategory === ALL_INSIGHTS) return rest;
    return rest.filter((post) => post.category === activeCategory);
  }, [rest, activeCategory]);

  return (
    <>
      <section className="pb-16 pt-[128px] md:pb-20 md:pt-[180px]">
        <div className="wrap">
          <Label>Insights</Label>
          <h1 className="mt-6 max-w-[16ch] font-display text-display-xl font-semibold">Notes from building real systems.</h1>

          {!featured ? (
            <p className="mt-10 text-lede text-mute">No articles published yet. Check back soon.</p>
          ) : (
            <Link href={`/blog/${featured.slug.current}`} className="group mt-14 grid grid-cols-1 gap-8 border-t border-ink pt-8 md:mt-20 lg:grid-cols-12 lg:gap-10">
              <div className="lg:col-span-5">
                <Meta post={featured} />
                <h2 className="mt-4 font-display text-display-lg font-semibold">{featured.title}</h2>
                {featured.excerpt && <p className="mt-5 max-w-[46ch] text-[16.5px] leading-relaxed text-ink-2">{featured.excerpt}</p>}
                <span className="mt-8 inline-flex items-center gap-2 font-ui text-[15px] font-medium">
                  <span className="link-draw pb-0.5">Read the article</span>
                  <Arrow className="transition-transform group-hover:translate-x-1" />
                </span>
              </div>
              <div className="overflow-hidden rounded-lg border border-line lg:col-span-7">
                <CoverImage post={featured} className="aspect-[12/7] h-full w-full" />
              </div>
            </Link>
          )}
        </div>
      </section>

      {featured && rest.length > 0 && (
        <section className="border-t border-line py-16 md:py-24">
          <div className="wrap">
            {categories.length > 1 && (
              <div role="tablist" aria-label="Filter by topic" className="scrollbar-hide flex gap-7 overflow-x-auto border-b border-line">
                {categories.map((category) => {
                  const on = category === activeCategory;
                  return (
                    <button
                      key={category}
                      role="tab"
                      type="button"
                      aria-selected={on}
                      onClick={() => setActiveCategory(category)}
                      className={cn(
                        "-mb-px shrink-0 whitespace-nowrap border-b pb-3 font-ui text-[15px] transition-colors",
                        on ? "border-ink text-ink" : "border-transparent text-mute hover:text-ink"
                      )}
                    >
                      {category}
                    </button>
                  );
                })}
              </div>
            )}

            {filteredPosts.length === 0 ? (
              <p className="py-16 text-mute">No articles in this topic yet. Check back soon.</p>
            ) : (
              <ul className="mt-10 grid grid-cols-1 gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
                {filteredPosts.map((post) => (
                  <li key={post._id}>
                    <Link href={`/blog/${post.slug.current}`} className="group block">
                      <div className="overflow-hidden rounded-md border border-line">
                        <CoverImage post={post} className="aspect-video w-full" />
                      </div>
                      <div className="mt-5">
                        <Meta post={post} />
                        <h3 className="mt-3 font-ui text-[20px] font-medium leading-snug tracking-[-0.01em] group-hover:underline group-hover:underline-offset-4">
                          {post.title}
                        </h3>
                        {post.excerpt && <p className="mt-3 line-clamp-2 text-[15px] leading-relaxed text-mute">{post.excerpt}</p>}
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      )}

      <CTA />
    </>
  );
}
