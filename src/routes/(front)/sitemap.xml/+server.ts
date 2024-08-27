import { OriginAreaEnum } from "$lib/form/enums";
import { prisma } from "$lib/server/prisma";
import { publishedScope, slugify } from "$lib/utils";
import type { RequestHandler } from "./$types";

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

  const allTags = recipes.reduce(
    (tags, recipe) => {
      for (const tag of recipe.tags) {
        tags[tag] = true;
      }

      return tags;
    },
    {} as Record<string, boolean>,
  );

  const response = new Response(
    `<?xml version="1.0" encoding="UTF-8" ?>
    <urlset
      xmlns="https://www.sitemaps.org/schemas/sitemap/0.9"
      xmlns:news="https://www.google.com/schemas/sitemap-news/0.9"
      xmlns:xhtml="https://www.w3.org/1999/xhtml"
      xmlns:mobile="https://www.google.com/schemas/sitemap-mobile/1.0"
      xmlns:image="https://www.google.com/schemas/sitemap-image/1.1"
      xmlns:video="https://www.google.com/schemas/sitemap-video/1.1"
    >
      <url>
        <loc>${baseSite}</loc>
        <changefreq>daily</changefreq>
        <priority>1</priority>
      </url>
      ${categories.map(
        (category) => `
        <url>
          <loc>${baseSite}/categorie/${category.slug}</loc>
          <changefreq>daily</changefreq>
          <priority>0.5</priority>
        </url>
        `,
      )}
      ${collections.map(
        (collection) => `
        <url>
          <loc>${baseSite}/raccolte/${collection.slug}</loc>
          <changefreq>daily</changefreq>
          <priority>0.7</priority>
        </url>
        `,
      )}
      ${Object.entries(OriginAreaEnum).map(
        ([_, title]) => `
        <url>
          <loc>${baseSite}/aree/${slugify(title)}</loc>
          <changefreq>daily</changefreq>
          <priority>0.4</priority>
        </url>
        `,
      )}
      ${recipes.map(
        (recipe) => `
        <url>
          <loc>${baseSite}/ricette/${recipe.slug}</loc>
          <changefreq>weekly</changefreq>
          <priority>0.9</priority>
        </url>
        `,
      )}
      ${Object.entries(allTags).map(
        ([tag, _]) => `
        <url>
          <loc>${baseSite}/tag/${tag}</loc>
          <changefreq>daily</changefreq>
          <priority>0.3</priority>
        </url>
        `,
      )}
    </urlset>`,
  );

  response.headers.set("Cache-Control", "max-age=0, s-maxage=3600");
  response.headers.set("Content-Type", "application/xml");

  return response;
};
