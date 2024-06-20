<script lang="ts">
  import RecipeList from "$lib/components/front/RecipeList.svelte";

  let { data } = $props();
  let { collection, recipes, pagination } = $derived(data);
</script>

<RecipeList {recipes} {pagination} listTitle={collection?.title} />
