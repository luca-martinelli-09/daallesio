<script lang="ts">
	import RecipeCard from '$lib/components/RecipeCard.svelte';
	import type { Recipe } from '$lib/utils/utils';

	export let data;

	const recipes: Recipe[] = data.recipes;
</script>

<svelte:head>
	<title>Ricette - Da Allesio</title>
</svelte:head>

<section
	class="main-container min-h-screen p-5 md:p-10 bg-[#EDEDED] dark:bg-[#020205] dark:text-white md:mx-5 flex flex-col gap-5 md:gap-10 lg:gap-12 md:rounded-xl"
>
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-5 xl:gap-10">
		{#each recipes as recipe}
			<RecipeCard {recipe} mini={true} />
		{/each}
	</div>
</section>
