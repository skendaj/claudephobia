import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
      // Explicitly allow AI crawlers for agent-friendly indexing
      { userAgent: "GPTBot", allow: "/" },
      { userAgent: "ChatGPT-User", allow: "/" },
      { userAgent: "ClaudeBot", allow: "/" },
      { userAgent: "anthropic-ai", allow: "/" },
      { userAgent: "PerplexityBot", allow: "/" },
      { userAgent: "Googlebot-Extended", allow: "/" },
      { userAgent: "CCBot", allow: "/" },
      { userAgent: "cohere-ai", allow: "/" },
    ],
    sitemap: "https://clawdephobia.vercel.app/sitemap.xml",
  };
}
