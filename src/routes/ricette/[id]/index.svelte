<script context="module">
  import { recipes } from "$lib/recipes";

  export function load({ params }) {
    const { id } = params;

    const recipe = recipes[id];

    return {
      props: {
        page: recipe.default,
      },
    };
  }
</script>

<script>
  export let page;
</script>

<svelte:component this={page} />
