<script lang="ts">
  import Pagination from "$lib/components/admin/ui/Pagination.svelte";
  import Input from "$lib/components/ui/input/input.svelte";
  import bg from "$lib/images/bg.png";
  import { Search } from "lucide-svelte";

  let { data } = $props();
  let { recipes, pagination } = $derived(data);
</script>

<form>
  <div class="mb-16">
    <img class="w-full h-32 object-cover object-center" src={bg} alt="Cerca" />

    <div class="px-3 w-full flex justify-center -mt-9">
      <div class="max-w-screen-md w-full relative search">
        <Search class="h-full w-6 absolute inset-y-0 left-7 text-muted-foreground" />
        <Input name="q" class="py-9 px-9 pl-16 text-xl rounded-full shadow-2xl focus-visible:ring-0 focus-visible:ring-offset-0 border-none" placeholder="Cerca una ricetta..." />
      </div>
    </div>
  </div>
</form>

<main class="main-content">
  {#each recipes as recipe}
    <h2>{recipe.title}</h2>
    <p>{recipe.summary}</p>
  {/each}
</main>

<Pagination {pagination} />
