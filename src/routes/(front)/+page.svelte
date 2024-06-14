<script lang="ts">
  import { page } from "$app/stores";
  import CustomLazyImage from "$lib/components/CustomLazyImage.svelte";
  import RecipeCard from "$lib/components/RecipeCard.svelte";
  import Pagination from "$lib/components/admin/ui/Pagination.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import Input from "$lib/components/ui/input/input.svelte";
  import type { Pagination as PaginationType, PartialRecipe } from "$lib/types";
  import { getSrcSet, title } from "$lib/utils.js";
  import { ArrowRight, Search } from "lucide-svelte";

  let { data } = $props();
  let { recipes, pagination }: { recipes: PartialRecipe[]; pagination: PaginationType } = $derived(data);

  let searchForm: HTMLFormElement;
  let searchValue = $state($page.url.searchParams.get("q") || "");

  const schemaOrg = $derived.by(() => ({
    "@context": "https://schema.org/",
    "@type": "ItemList",
    itemListElement: recipes.map((recipe, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: $page.url.origin + "/ricette/" + recipe.slug,
    })),
  }));
</script>

<svelte:head>
  <title>{title()}</title>

  {@html `<script type="application/ld+json">${JSON.stringify(schemaOrg)}</script>`}
</svelte:head>

<form bind:this={searchForm}>
  <div class="mb-16">
    <CustomLazyImage
      class="w-full h-32 object-cover object-center"
      image={{
        alt: "Cerca",
        base64:
          "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAAKABQDASIAAhEBAxEB/8QAFwAAAwEAAAAAAAAAAAAAAAAAAAQGBf/EACQQAAEEAQQCAgMAAAAAAAAAAAECAwQRBQAGEiEiMRNBBxSR/8QAFQEBAQAAAAAAAAAAAAAAAAAABgT/xAAlEQACAgAFAgcAAAAAAAAAAAABAgMRAAQhMUEFEgYiMlFTcYH/2gAMAwEAAhEDEQA/AJvan5F3pIVGjo3I3MbjzG4ZW3HdkzH2nCCpfA9KSmh9gnyJq9N783AxsDcr8WRml5lqaHWlSC+CsPKPTnGqSASRxJodcfVF2LCjs4TIvNsNIdZioS04lACkArAISfqx11rMweJg5LDSpsyHHlTC26f2H2krcsfLXkRfVD+aOplllmMcoBWtqq/b0kbb4Vy9Py8UMD5ZFS3J27mAFUAzEnbTWxzWITNbfzuWyL0jEuPRMbZSy3OUGnKBIPSq65cu67N+jY0akJQEuZIcfHzOc65OeR9D7OjTOKDMhFCMlVzHZ/T36/eIpvDPTppGlkaS2JJ8y86/Hj//2Q==",
        src: "/img/bg.png",
        srcSet: getSrcSet("img/bg.png"),
      }}
    />

    <div class="px-3 w-full flex justify-center -mt-9">
      <div class="max-w-screen-md w-full relative search">
        <Search class="h-full w-6 absolute inset-y-0 left-7 text-muted-foreground" />
        <Input
          bind:value={searchValue}
          name="q"
          class="py-9 px-16 pr-20 text-xl rounded-full shadow-2xl focus-visible:ring-0 focus-visible:ring-offset-0 border-none"
          placeholder="Cerca una ricetta..."
        />
        <div class="flex items-center absolute inset-y-0 right-2">
          <Button class="rounded-full h-14 w-14 transition-transform duration-300 ease-in-out active:scale-90" variant="secondary" size="icon">
            <ArrowRight />
          </Button>
        </div>
      </div>
    </div>
  </div>
</form>

<main class="main-content">
  <div class="recipe-grid">
    {#each recipes as recipe}
      <RecipeCard {recipe} />
    {/each}
  </div>

  <Pagination position="center" {pagination} />
</main>

<style scoped lang="postcss">
  .main-content {
    @apply px-0;
  }
</style>
