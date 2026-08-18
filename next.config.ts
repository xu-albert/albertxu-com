import createMDX from "@next/mdx";
import type { NextConfig } from "next";

// Built from what the production bundle actually loads, not from a template:
//
//   script-src   Next.js emits a dozen inline <script> tags per page to carry
//                the Flight payload, and their content changes every build, so
//                neither a hash list nor a nonce is available to a fully static
//                site (a nonce would force every route to render dynamically).
//                'unsafe-inline' is the price of staying prerendered. The
//                Vercel analytics/speed-insights loaders resolve to same-origin
//                /_vercel/... paths in production; va.vercel-scripts.com is the
//                fallback those packages use, so it is allowed explicitly.
//   style-src    Two inline-style sources: GFM table alignment renders as
//                style="text-align:center", and mermaid injects a <style>
//                element inside the SVG it hands to Mermaid.tsx.
//   font-src     next/font/google self-hosts Geist at build time -- the build
//                output contains no fonts.gstatic.com reference.
//   img-src      Every image is local; data: is allowed for mermaid, which can
//                emit data-URI images inside a rendered diagram.
//   connect-src  Analytics beacons post to same-origin /_vercel/... endpoints;
//                the two Vercel hosts cover the packages' fallback endpoints.
//
// Everything else is denied outright: there are no frames, no plugins, no
// workers, and no forms anywhere in the app.
//
// The one exception is the Vercel Toolbar, which Vercel injects into preview
// deployments. It loads https://vercel.live/_next-live/feedback/feedback.js,
// opens a vercel.live iframe and a Pusher websocket, and pulls its own styles,
// fonts and avatars -- every one of which the policy above blocks. Given the
// choice between losing the toolbar, loosening the policy everywhere, or
// loosening it only off production, the ruling was the third: preview gets a
// working toolbar, production is deliberately left byte-for-byte as tight as
// it was before this allowance existed. Source lists are Vercel's documented
// CSP requirements for the toolbar, not guesses:
// https://vercel.com/docs/vercel-toolbar/managing-toolbar
//
// The gate is an allowlist of the two environments that actually get a
// toolbar, and it is deliberately fail-closed: an undefined, empty or
// unrecognised VERCEL_ENV yields the tight production policy. Testing
// `!== "production"` would be the bug -- Vercel only populates VERCEL_ENV when
// the project has "Enable access to System Environment Variables" checked, so
// an absent value is not evidence that a build is non-production, and a
// fail-open gate would ship the loosened policy to the live site. preview,
// development and production are the only values Vercel documents:
// https://vercel.com/docs/environment-variables/system-environment-variables
//
// Accepted consequence of that ruling, not an oversight to undo: local
// `next dev`/`next start` see no VERCEL_ENV and so get the production policy.
// Nothing injects the toolbar locally, so there is nothing there to unblock --
// do not add a NODE_ENV check, an .env default or any other escape hatch.
const isToolbarEnvironment =
  process.env.VERCEL_ENV === "preview" ||
  process.env.VERCEL_ENV === "development";
const toolbar = (...sources: string[]) => (isToolbarEnvironment ? sources : []);

const csp = [
  ["default-src", "'self'"],
  ["base-uri", "'self'"],
  ["object-src", "'none'"],
  ["frame-ancestors", "'none'"],
  // 'none' cannot be combined with a real source, so this directive swaps
  // wholesale rather than appending.
  [
    "frame-src",
    ...(isToolbarEnvironment ? ["https://vercel.live"] : ["'none'"]),
  ],
  ["form-action", "'self'"],
  [
    "script-src",
    "'self'",
    "'unsafe-inline'",
    "https://va.vercel-scripts.com",
    ...toolbar("https://vercel.live"),
  ],
  ["style-src", "'self'", "'unsafe-inline'", ...toolbar("https://vercel.live")],
  [
    "img-src",
    "'self'",
    "data:",
    ...toolbar("https://vercel.live", "https://vercel.com", "blob:"),
  ],
  [
    "font-src",
    "'self'",
    ...toolbar("https://vercel.live", "https://assets.vercel.com"),
  ],
  ["media-src", "'self'"],
  ["worker-src", "'self'"],
  ["manifest-src", "'self'"],
  [
    "connect-src",
    "'self'",
    "https://va.vercel-scripts.com",
    "https://vitals.vercel-insights.com",
    ...toolbar("https://vercel.live", "wss://ws-us3.pusher.com"),
  ],
  ["upgrade-insecure-requests"],
]
  .map((directive) => directive.join(" "))
  .join("; ");

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  // Response security headers. There is no server-side surface here -- every
  // route is prerendered at build time -- so these are the whole defense, and
  // they are cheap: nothing on the site loads a cross-origin script, font,
  // style, frame or image. Read the CSP notes above before relaxing anything.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: csp },
          // Stop browsers second-guessing our Content-Type. Matters most for
          // public/*.svg and public/*.pdf, which Vercel serves inline.
          { key: "X-Content-Type-Options", value: "nosniff" },
          // frame-ancestors above is the real control; this is the fallback
          // for anything that still only understands X-Frame-Options.
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Nothing here asks for a device, so deny by default.
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          // Vercel already sends HSTS; this adds includeSubDomains. Deliberately
          // no `preload` -- that is a slow-to-undo commitment for every current
          // and future albertxu.com subdomain.
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains",
          },
        ],
      },
    ];
  },

  // The contact page and its form are gone; LinkedIn is the way to reach me.
  // Old inbound links and search results still point at /contact, so send
  // them where the home page's "Get in touch" now goes instead of 404ing.
  // Temporary (307) on purpose, so nothing caches this forever and an on-site
  // /contact page can come back later without fighting stale redirects.
  async redirects() {
    return [
      {
        source: "/contact",
        destination: "https://linkedin.com/in/albertwxu",
        permanent: false,
      },
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
