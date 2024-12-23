import { OriginAreaEnum } from "$lib/form/enums";
import { prisma } from "$lib/server/prisma";
import { publishedScope, slugify } from "$lib/utils";
import type { RequestHandler } from "./$types";
import { SitemapStream, streamToPromise } from "sitemap";

interface SitemapEntry {
  url: string;
  lastmod?: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: number;
}

function generateSitemapXml(entries: SitemapEntry[], baseUrl: string): string {
  const xml = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'];

  for (const entry of entries) {
    xml.push("  <url>");
    xml.push(`    <loc>${baseUrl}${entry.url}</loc>`);
    if (entry.lastmod) xml.push(`    <lastmod>${entry.lastmod}</lastmod>`);
    if (entry.changefreq) xml.push(`    <changefreq>${entry.changefreq}</changefreq>`);
    if (entry.priority) xml.push(`    <priority>${entry.priority}</priority>`);
    xml.push("  </url>");
  }

  xml.push("</urlset>");
  return xml.join("\n");
}

export const GET: RequestHandler = async ({ url }) => {
  const baseSite = url.origin;

  const categories = await prisma.recipeType.findMany();
  const collections = await prisma.collection.findMany({
    orderBy: [{ order: "asc" }],
  });

  const recipes = await prisma.recipe.findMany({
    where: {
      ...publishedScope,
    },
    orderBy: [{ date: "desc" }, { title: "asc" }],
    cacheStrategy: { ttl: 180 },
  });

  const allTags = recipes.reduce((tags, recipe) => {
    for (const tag of recipe.tags) {
      tags[tag] = true;
    }

    return tags;
  }, {} as Record<string, boolean>);

  // Add pages

  const entries: SitemapEntry[] = [{ url: "/", changefreq: "daily", priority: 1 }];

  for (const collection of collections) {
    entries.push({ url: `/raccolte/${collection.slug}`, changefreq: "daily", priority: 0.7 });
  }

  for (const category of categories) {
    entries.push({ url: `/categorie/${category.slug}`, changefreq: "daily", priority: 0.5 });
  }

  for (const area of Object.values(OriginAreaEnum)) {
    entries.push({ url: `/aree/${slugify(area)}`, changefreq: "daily", priority: 0.4 });
  }

  for (const recipe of recipes) {
    entries.push({ url: `/ricette/${recipe.slug}`, changefreq: "weekly", priority: 0.9 });
  }

  for (const tag of Object.keys(allTags)) {
    entries.push({ url: `/tag/${tag}`, changefreq: "daily", priority: 0.3 });
  }

  const baseUrl = url.origin;
  const xml = generateSitemapXml(entries, baseUrl);

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "max-age=0, s-maxage=3600",
    },
  });
};
