import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  // The blog index folded into /projects. Individual posts keep their
  // /blog/<slug> URLs, so only the index itself moves.
  async redirects() {
    return [{ source: "/blog", destination: "/projects", permanent: true }];
  },
};

const withMDX = createMDX({
  options: {
    remarkPlugins: ["remark-gfm"],
    rehypePlugins: ["rehype-slug"],
  },
});

export default withMDX(nextConfig);
