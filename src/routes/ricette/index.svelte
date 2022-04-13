<!-- By using context="module", I declare that this code will run on the server 
and fetch this data before page actually loads -->
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
	export let posts;
</script>

{#each posts as post}
  <h1><a href="/ricette/{post.id}">{post.title}</a></h1>
{/each}