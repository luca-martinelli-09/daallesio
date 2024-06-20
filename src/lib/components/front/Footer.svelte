<script lang="ts">
  import { OriginAreaEnum } from "$lib/form/enums";
  import { slugify } from "$lib/utils";
  import Icon from "@iconify/svelte";
  import type { Collection, RecipeType } from "@prisma/client";

  const { categories, collections }: { categories: RecipeType[]; collections: Collection[] } = $props();
</script>

<footer class="border-t mt-10">
  <div class="bg-secondary print:hidden">
    <div class="footer-grid">
      <div>
        <h6 class="font-bold">Categorie</h6>
        <ul class="mt-3">
          {#each categories as category}
            <li class="py-1">
              <a href="/categorie/{category.slug}">{category.title}</a>
            </li>
          {/each}
        </ul>
      </div>

      <div class="text-center">
        <h6 class="font-bold">Aree</h6>
        <ul class="mt-3">
          {#each Object.entries(OriginAreaEnum) as [_, title]}
            <li class="py-1">
              <a href="/aree/{slugify(title)}">{title}</a>
            </li>
          {/each}
        </ul>
      </div>

      <div class="text-right">
        <h6 class="font-bold">Raccolte</h6>
        <ul class="mt-3">
          {#each collections as collection}
            <li class="py-1">
              <a href="/raccolte/{collection.slug}">{collection.title}</a>
            </li>
          {/each}
        </ul>
      </div>
    </div>
  </div>

  <div class="footer-grid text-sm">
    <p>
      Realizzato da <a class="font-bold" target="_blank" rel="noopener noreferrer" href="https://w3id.org/people/lucamartinelli">Luca Martinelli</a>
    </p>
    <p class="md:text-center"></p>
    <p class="flex items-center gap-3 md:justify-end">
      <span>Seguici su</span>
      <a href="http://instagram.com/daallesio" target="_blank" rel="noopener noreferrer" class="flex items-center gap-1">
        <Icon icon="mdi:instagram" class="h-5 w-5" /><strong>daallesio</strong>
      </a>
    </p>
  </div>
</footer>

<style scoped lang="postcss">
  .footer-grid {
    @apply grid md:grid-cols-3 gap-3 px-3 max-w-screen-2xl mx-auto py-5;
  }
</style>
