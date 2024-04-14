<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import FiltersCard from '$lib/components/FiltersCard.svelte';
	import RecipeCard from '$lib/components/RecipeCard.svelte';
	import { queryRecipes } from '$lib/utils';
	import type { Recipe, SearchOptions } from '$lib/utils/utils';
	import Icon from '@iconify/svelte';

	let results: Recipe[];
	let filterOptions: SearchOptions;
	let query: string;

	async function search() {
		console.log(filterOptions);
		if (
			filterOptions.difficulty ||
			filterOptions.originPlace ||
			filterOptions.type ||
			filterOptions.vegan ||
			filterOptions.vegetarian ||
			query?.length >= 3
		)
			results = await queryRecipes(query, filterOptions);
		else results = [];
	}
</script>

<svelte:head>
	<title>Scopri - Da Allesio</title>
</svelte:head>

<section
	class="main-container min-h-screen p-5 md:p-10 bg-[#EDEDED] dark:bg-[#020205] dark:text-white md:mx-5 flex flex-col gap-5 md:gap-10 lg:gap-12 md:rounded-xl"
>
	<div
		class="w-full max-w-screen-md mx-auto flex gap-2 items-center border-2 border-black dark:border-white px-3 bg-white dark:bg-black rounded-full"
	>
		<span class="text-xl"><Icon icon="ion:search-outline" /></span>
		<input
			class="flex-1 outline-none py-2 bg-transparent"
			placeholder="Cerca..."
			type="text"
			name="q"
			id="query"
			autocomplete="off"
			bind:value={query}
			on:keyup={search}
		/>
	</div>
	<div class="flex justify-center">
		<FiltersCard on:change={search} bind:options={filterOptions} />
	</div>
	{#if results?.length > 0}
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-5 xl:gap-10">
			{#each results as recipe}
				<RecipeCard {recipe} mini={true} />
			{/each}
		</div>
	{/if}
</section>
