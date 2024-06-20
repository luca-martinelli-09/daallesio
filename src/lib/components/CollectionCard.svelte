<script lang="ts">
  import type { PartialCollection } from "$lib/types";
  import type { Image } from "@prisma/client";
  import LazyImage from "./LazyImage.svelte";

  const { collection }: { collection: PartialCollection } = $props();
</script>

<a class="rounded-lg overflow-hidden bg-background group shadow-lg transition-all duration-300 ease-in-out hover:shadow-xl active:shadow-md active:scale-95" href="/raccolte/{collection.slug}">
  <div class="aspect-video overflow-hidden">
    <LazyImage class="aspect-video transition-transform duration-300 ease-out" image={collection.image as Image} />
  </div>

  <div class="p-3 md:p-5 flex flex-col gap-3">
    <h3 class="font-display font-bold text-2xl sm:text-4xl lg:text-3xl xl:text-4xl">{collection.title}</h3>
    
    <p class="text-muted text-xs">{collection.summary}</p>
  </div>
</a>
