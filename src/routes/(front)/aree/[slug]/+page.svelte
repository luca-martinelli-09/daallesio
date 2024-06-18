<script lang="ts">
  import RecipeList from "$lib/components/front/RecipeList.svelte";
  import { OriginAreaEnum } from "$lib/form/enums.js";

  let { data } = $props();
  let { recipes, area, pagination } = $derived(data);
</script>

<RecipeList {recipes} {pagination} listTitle="Aree: {OriginAreaEnum[area]}" />
