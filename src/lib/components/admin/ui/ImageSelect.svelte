<script lang="ts">
  import LazyImage from "$lib/components/LazyImage.svelte";
  import * as Dialog from "$lib/components/ui/dialog";
  import Input from "$lib/components/ui/input/input.svelte";
  import type { Pagination as PaginationType } from "$lib/types";
  import type { Image } from "@prisma/client";
  import Pagination from "./Pagination.svelte";

  let { open = $bindable(), onselected }: { open: boolean; onselected?: (i: Image) => void } = $props();

  let images: Image[] = $state([]);
  let pagination: PaginationType | undefined = $state();
  let query: string = $state("");

  async function fetchImages() {
    const r = await (await fetch("/admin/api/images?" + new URLSearchParams({ query, page: (pagination?.page || 0).toString() }))).json();

    images = r.data as Image[];
    pagination = r.pagination as PaginationType;
  }

  function selectImage(image: Image) {
    onselected?.(image);
    open = false;
  }
</script>

<Dialog.Root bind:open>
  <Dialog.Content class="max-w-screen-xl max-h-screen overflow-auto">
    <Dialog.Header>
      <Dialog.Title>Seleziona un'immagine</Dialog.Title>
    </Dialog.Header>

    <form
      method="get"
      onsubmit={(e) => {
        e.preventDefault();
        fetchImages();
      }}
    >
      <Input placeholder="Cerca..." bind:value={query} />
    </form>

    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {#each images as image}
        <button class="grid border rounded-lg overflow-hidden" onclick={() => selectImage(image)} onkeydown={(e) => e.key === "Enter" && selectImage(image)} type="button">
          <LazyImage {image} />
          <p class="text-opacity-80 text-sm p-2">{image.caption}</p>
        </button>
      {/each}
    </div>

    {#if pagination}
      <Pagination {pagination} />
    {/if}
  </Dialog.Content>
</Dialog.Root>
