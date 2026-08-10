import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  async redirects() {
    return [
      // The contact page and its form are gone; LinkedIn is the way to reach me.
      // Old inbound links and search results still point at /contact, so send
      // them where the home page's "Get in touch" now goes instead of 404ing.
      // Temporary (307) on purpose, so nothing caches this forever and an on-site
      // /contact page can come back later without fighting stale redirects.
      {
        source: "/contact",
        destination: "https://linkedin.com/in/albertwxu",
        permanent: false,
      },
      // The blog index folded into /projects. Individual posts keep their
      // /blog/<slug> URLs, so only the index itself moves.
      { source: "/blog", destination: "/projects", permanent: true },
    ];
  },
};

const withMDX = createMDX({
  options: {
    remarkPlugins: ["remark-gfm"],
    rehypePlugins: ["rehype-slug"],
  },
});

export default withMDX(nextConfig);
