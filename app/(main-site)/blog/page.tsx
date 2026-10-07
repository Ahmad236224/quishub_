import { client } from "@/sanity/lib/client";
import { POSTS_QUERY } from "@/sanity/lib/queries";
import type { Post } from "@/sanity/lib/types";
import BlogClient from "./BlogClient";

export const revalidate = 60;

export default async function BlogPage() {
  const posts = await client.fetch<Post[]>(POSTS_QUERY);

  return <BlogClient posts={posts} />;
}
