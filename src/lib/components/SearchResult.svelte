<script lang="ts">
	import type { Recipe } from '$lib/utils/utils';

	export let recipe: Recipe;
</script>

<a class="flex gap-3" href="/ricette/{recipe.id}">
	<img
		src={recipe.image}
		alt={recipe.title}
		class="w-28 rounded-lg aspect-video object-cover object-center"
	/>
	<div class="flex flex-col gap-1">
		<h4 class="font-serif font-bold text-2xl">{recipe.title}</h4>
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
