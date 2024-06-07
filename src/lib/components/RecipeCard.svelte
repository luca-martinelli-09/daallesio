<script lang="ts">
  import type { PartialRecipe } from "$lib/types";
  import type { Image } from "@prisma/client";
  import LazyImage from "./LazyImage.svelte";
  import { DateFormatter } from "@internationalized/date";

  const { recipe }: { recipe: PartialRecipe } = $props();

  const df = new DateFormatter('it-IT', {
    dateStyle:"long"
  })
</script>

<a class="rounded-lg overflow-hidden bg-background group shadow-lg transition-all duration-300 ease-in-out hover:shadow-xl active:shadow-md active:scale-95" href="/ricette/{recipe.slug}">
  <div class="aspect-video overflow-hidden">
    <LazyImage class="aspect-video transition-transform duration-300 ease-out" image={recipe.image as Image} />
  </div>

  <div class="p-3 md:p-5 flex flex-col gap-2">
    <span class="text-sm">{df.format(recipe.date)}</span>
    <h3 class="font-display font-bold text-2xl md:text-4xl lg:text-5xl">{recipe.title}</h3>
  </div>
</a>
