<script lang="ts">
  import { page } from "$app/stores";
  import RecipeCard from "$lib/components/RecipeCard.svelte";
  import Pagination from "$lib/components/admin/ui/Pagination.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import Input from "$lib/components/ui/input/input.svelte";
  import bg from "$lib/images/bg.png";
  import type { Pagination as PaginationType, PartialRecipe } from "$lib/types";
  import { ArrowRight, Search } from "lucide-svelte";

  let { data } = $props();
  let { recipes, pagination }: { recipes: PartialRecipe[]; pagination: PaginationType } = $derived(data);

  let searchForm: HTMLFormElement;
  let searchValue = $state($page.url.searchParams.get("q") || "");
</script>

<form bind:this={searchForm}>
  <div class="mb-16">
    <img class="w-full h-32 object-cover object-center" src={bg} alt="Cerca" />

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
