<script context="module">
  // Get ingredients info
	const allIngredients = import.meta.globEager('$lib/ingredients/*.md');

	let ingredients = [];
  // Get the ingredients' ids
	for (let path in allIngredients) {
		const ingredient = allIngredients[path];
		const id = ingredient.metadata.id;
		const p = { ingredient, id };
		ingredients.push(p);
	}

	export function load({ params }) {
		const { id } = params;

    // Find the ingredient with the id
		const ingredient = ingredients.find((p) => {
			return p.id.toLowerCase() === id.toLowerCase();
		});

		return {
			props: {
        // Tell page to load that ingredient's module
				page: ingredient.default
			}
		};
	};
</script>

<script>
  // Declare the page variable to use on the client
	export let page;
</script>

<!--Here we'll load the component of the blog ingredient page itself -->
<svelte:component this = { page } />