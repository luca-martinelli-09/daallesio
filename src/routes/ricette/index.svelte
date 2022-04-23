<script context="module">
	export async function load({ fetch }) {
		const url = '/ricette.json';
		const res = await fetch(url);

    return {
      props: {
        posts: await res.json()
      }
    };
	}
</script>

<script>
  import Navbar from "$lib/components/Navbar.svelte";

	export let posts;
</script>

<Navbar selected="ricette" />

{#each posts as post}
  <h1><a href="/ricette/{post.id}" sveltekit:prefetch>{post.title}</a></h1>
{/each}