<script lang="ts">
  import CollectionCard from "$lib/components/CollectionCard.svelte";
  import Pagination from "$lib/components/admin/ui/Pagination.svelte";
  import { title } from "$lib/utils.js";

  let { data } = $props();
  let { collections, pagination } = $derived(data);
</script>

<svelte:head>
  <title>{title("Raccolte")}</title>
  <meta property="og:title" content={title("Raccolte")} />
</svelte:head>

<main class="main-content">
  <h1 class="font-display text-4xl font-bold my-10 text-center">Raccolte</h1>

  <div class="recipe-grid">
    {#each collections as collection}
      <CollectionCard {collection} />
    {/each}
    {#if !collections.length}
      <h5 class="text-center font-bold text-2xl col-span-3">Nessun risultato trovato :(</h5>
    {/if}
  </div>

  <Pagination position="center" {pagination} />
</main>

<style scoped lang="postcss">
  .main-content {
    @apply px-0;
  }
</style>
