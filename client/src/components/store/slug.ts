/** Route params may arrive percent-encoded; a malformed sequence must not crash the page. */
export const decodeSlug = (slug: string) => {
  try {
    return decodeURIComponent(slug);
  } catch {
    return slug;
  }
};
