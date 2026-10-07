import { groq } from "next-sanity";

export const POSTS_QUERY = groq`
  *[_type == "post" && defined(slug.current)] | order(publishedAt desc) {
    _id,
    title,
    slug,
    coverImage,
    category,
    readTime,
    publishedAt,
    excerpt
  }
`;

export const POST_BY_SLUG_QUERY = groq`
  *[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    coverImage,
    category,
    readTime,
    publishedAt,
    excerpt,
    content
  }
`;

export const POST_SLUGS_QUERY = groq`
  *[_type == "post" && defined(slug.current)].slug.current
`;

export const RELATED_POSTS_QUERY = groq`
  *[_type == "post" && category == $category && slug.current != $slug] | order(publishedAt desc) [0...3] {
    _id,
    title,
    slug,
    coverImage,
    readTime
  }
`;
