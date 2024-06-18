<script lang="ts">
  import RecipeList from "$lib/components/front/RecipeList.svelte";
  import type { Pagination as PaginationType, PartialRecipe } from "$lib/types";

  let { data } = $props();
  let { recipes, pagination }: { recipes: PartialRecipe[]; pagination: PaginationType } = $derived(data);
</script>

<RecipeList {recipes} {pagination} />
