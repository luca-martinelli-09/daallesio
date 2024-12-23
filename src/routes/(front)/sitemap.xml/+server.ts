import { OriginAreaEnum } from "$lib/form/enums";
import { prisma } from "$lib/server/prisma";
import { publishedScope, slugify } from "$lib/utils";
import type { RequestHandler } from "./$types";
import { SitemapStream, streamToPromise } from "sitemap";
import { createGzip } from "zlib";

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

  const smStream = new SitemapStream({
    hostname: baseSite,
  });
  const pipeline = smStream.pipe(createGzip());

  const pages = [{ url: "/", changefreq: "daily", priority: 1 }];

  for (const collection of collections) {
    pages.push({ url: `/raccolte/${collection.slug}`, changefreq: "daily", priority: 0.7 });
  }

  for (const category of categories) {
    pages.push({ url: `/categorie/${category.slug}`, changefreq: "daily", priority: 0.5 });
  }

  console.log(Object.values(allTags));

  for (const area of Object.values(OriginAreaEnum)) {
    pages.push({ url: `/aree/${slugify(area)}`, changefreq: "daily", priority: 0.4 });
  }

  for (const recipe of recipes) {
    pages.push({ url: `/ricette/${recipe.slug}`, changefreq: "weekly", priority: 0.9 });
  }

  for (const tag of Object.keys(allTags)) {
    pages.push({ url: `/tag/${tag}`, changefreq: "daily", priority: 0.3 });
  }

  pages.forEach((page) => smStream.write(page));

  smStream.end();

  const sitemapBuffer = await streamToPromise(pipeline);

  return new Response(sitemapBuffer, {
    headers: {
      "Content-Type": "application/xml",
      "Content-Encoding": "gzip",
    },
  });
};
