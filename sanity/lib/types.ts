import type { PortableTextBlock } from "sanity";
import type { SanityImageSource } from "@sanity/image-url";

export interface PostSlug {
  current: string;
}

export interface Post {
  _id: string;
  title: string;
  slug: PostSlug;
  coverImage: SanityImageSource | null;
  category: string | null;
  readTime: string | null;
  publishedAt: string | null;
  excerpt: string | null;
  content?: PortableTextBlock[];
}

export interface RelatedPost {
  _id: string;
  title: string;
  slug: PostSlug;
  coverImage: SanityImageSource | null;
  readTime: string | null;
}
