<script lang="ts">
  import RecipeList from "$lib/components/front/RecipeList.svelte";

  let { data } = $props();
  let { recipes, tag, pagination } = $derived(data);
</script>

<RecipeList {recipes} {pagination} listTitle="#{tag}" />
