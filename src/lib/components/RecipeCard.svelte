<script lang="ts">
	import type { Recipe } from '$lib/utils/utils';
	import Button from './Button.svelte';
	import Icon from '@iconify/svelte';

	export let recipe: Recipe | undefined;
	export let mini = false;
</script>

{#if recipe}
	{#if mini}
		<div class="flex flex-col bg-[#F7F5F2] dark:bg-[#060608] rounded-xl overflow-hidden">
			<img
				class="w-full aspect-video object-cover object-center"
				src={recipe.image}
				alt={recipe.title}
			/>
			<div class="flex flex-col gap-4 p-5">
				<h2 class="text-4xl font-serif">{recipe.title}</h2>
				<div>
					<Button
						title="Vai alla ricetta"
						src="/ricette/{recipe.id}"
						icon="ion:arrow-forward-outline"
					/>
				</div>
				<div class="flex flex-col flex-1 gap-2 justify-end">
					{#if recipe.vegan || recipe.vegetarian}
						<div
							class="font-bold text-sm capitalize flex items-center gap-1 text-green-700 dark:text-green-300"
						>
							<span class="text-base"><Icon icon="ion:leaf-outline" /></span>
							{recipe.vegetarian ? 'Vegetariano' : 'Vegano'}
						</div>
					{/if}
				</div>
			</div>
		</div>
	{:else}
		<div class="flex flex-col md:flex-row gap-0 md:gap-5 bg-[#F7F5F2] dark:bg-[#060608] rounded-xl overflow-hidden">
			<img
				class="w-full md:w-2/5 aspect-video object-cover object-center"
				src={recipe.image}
				alt={recipe.title}
			/>
			<div class="flex flex-col gap-4 md:gap-6 p-5 md:pt-10 md:pb-5">
				<h2 class="text-4xl md:text-5xl lg:text-6xl font-serif">{recipe.title}</h2>
				<div>
					<Button
						title="Vai alla ricetta"
						src="/ricette/{recipe.id}"
						icon="ion:arrow-forward-outline"
					/>
				</div>
				<div class="flex flex-col flex-1 gap-2 justify-end">
					{#if recipe.vegan || recipe.vegetarian}
						<div
							class="font-bold text-sm capitalize flex items-center gap-1 text-green-700 dark:text-green-300"
						>
							<span class="text-base"><Icon icon="ion:leaf-outline" /></span>
							{recipe.vegetarian ? 'Vegetariano' : 'Vegano'}
						</div>
					{/if}
				</div>
			</div>
		</div>
	{/if}
{/if}
