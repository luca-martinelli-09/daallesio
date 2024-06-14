<script lang="ts">
  import type { PartialRecipe } from "$lib/types";
  import { getRecipeLabels } from "$lib/utils";
  import { DateFormatter } from "@internationalized/date";
  import type { Image } from "@prisma/client";
  import LazyImage from "./LazyImage.svelte";

  const { recipe }: { recipe: PartialRecipe } = $props();

  const df = new DateFormatter('it-IT', {
    dateStyle:"long"
  })
</script>

<a class="rounded-lg overflow-hidden bg-background group shadow-lg transition-all duration-300 ease-in-out hover:shadow-xl active:shadow-md active:scale-95" href="/ricette/{recipe.slug}">
  <div class="aspect-video overflow-hidden">
    <LazyImage class="aspect-video transition-transform duration-300 ease-out" image={recipe.image as Image} />
  </div>

  <div class="p-3 md:p-5 flex flex-col gap-3">
    <div class="text-sm flex items-center gap-3">
      <span class="text-muted-foreground">{df.format(recipe.date)}</span>
      <span>•</span>
      <span class="font-bold">{recipe.type?.title}</span>
    </div>
    <h3 class="font-display font-bold text-2xl sm:text-4xl lg:text-3xl xl:text-4xl">{recipe.title}</h3>
    
    <div class="flex gap-2 items-center flex-wrap mt-3">
      {#each getRecipeLabels(recipe) as recipeLabel}
        <div class="flex items-center gap-2 px-2 py-1 text-xs font-semibold rounded-full {recipeLabel.color}">
          <svelte:component this={recipeLabel.icon} class="w-3 h-3" />
          <span>{recipeLabel.text}</span>
        </div>
      {/each}
    </div>
  </div>
</a>
