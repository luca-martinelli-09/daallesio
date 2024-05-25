<script lang="ts">
	import type { Recipe } from '$lib/utils/utils';
	import Image from './Image.svelte';

	export let recipe: Recipe;
</script>

<a class="flex gap-3 no-underline" href="/ricette/{recipe.id}">
	<Image
		src={recipe.image}
		srcSet={recipe.scrSet}
		thumb={recipe.thumb}
		alt={recipe.title}
		class="w-28 rounded-lg aspect-video object-cover object-center m-0"
	/>
	<div class="flex flex-col gap-1">
		<h4 class="font-serif font-bold text-2xl m-0">{recipe.title}</h4>
		<span class="text-sm opacity-70">
			{new Date(recipe.date).toLocaleDateString(undefined, {
				day: 'numeric',
				month: 'long',
				weekday: 'long',
				year: 'numeric'
			})}
		</span>
	</div>
</a>
