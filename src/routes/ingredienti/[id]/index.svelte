<script context="module">
  // Get posts info
	const allPosts = import.meta.globEager(`$lib/recipes/*.md`);

	let posts = [];
  // Get the posts' ids
	for (let path in allPosts) {
		const post = allPosts[path];
		const id = post.metadata.id;
		const p = { post, id };
		posts.push(p);
	}

	export function load({ params }) {
		const { id } = params;

    // Find the post with the id
		const filteredPost = posts.find((p) => {
			return p.id.toLowerCase() === id.toLowerCase();
		});

		return {
			props: {
        // Tell page to load that post's module
				page: filteredPost.post.default
			}
		};
	};
</script>

<script>
  // Declare the page variable to use on the client
	export let page;
</script>

<!--Here we'll load the component of the blog post page itself -->
<svelte:component this = { page } />