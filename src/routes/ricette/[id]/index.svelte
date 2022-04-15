<script context="module">
  export async function load({ params, fetch }) {
    const url = params.id + ".json";
    const res = await fetch(url);

    return {
      props: {
        page: await res.json(),
      },
    };
  }
</script>

<script>
  export let page;
</script>

<svelte:head>
	{@html page.head}

	<style>
		{@html page.css}
	</style>
</svelte:head>

{@html page.html}
