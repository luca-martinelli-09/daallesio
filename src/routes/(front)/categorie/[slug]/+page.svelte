<script lang="ts">
  import RecipeList from "$lib/components/front/RecipeList.svelte";
  
  let { data } = $props();
  let { recipes, category, pagination } = $derived(data);
</script>

<RecipeList {recipes} {pagination} listTitle="Categoria: {category.plural || category.title}" />
