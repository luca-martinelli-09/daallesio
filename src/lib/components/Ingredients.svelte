<script lang="ts">
	import { formatIngredientAmount, formatIngredientName } from '$lib/utils';
	import type { IngredientsGroup } from '$lib/utils/utils';
	import Icon from '@iconify/svelte';

	export let ingredients: IngredientsGroup[];
	export let units: number;

	let currentUnits = units;
</script>

<div class="flex items-center font-bold gap-3">
	<span>Per</span>
	<div class="flex items-center gap-px print:hidden">
		<button
			on:click={() => (currentUnits = Math.max(currentUnits - 1, 1))}
			class="px-3 py-2 bg-gray-200 dark:bg-gray-700 rounded-l-full active:scale-90 transition-transform duration-300 ease-in-out"
		>
			<Icon icon="ion:remove-outline" />
		</button>
		<span class="text-lg px-3 leading-8 bg-gray-200 dark:bg-gray-700">{currentUnits}</span>
		<button
			on:click={() => currentUnits++}
			class="px-3 py-2 bg-gray-200 dark:bg-gray-700 rounded-r-full active:scale-90 transition-transform duration-300 ease-in-out"
		>
			<Icon icon="ion:add-outline" />
		</button>
	</div>
	<span class="hidden print:block">{currentUnits}</span>
	<span>{currentUnits > 1 ? 'persone' : 'persona'}:</span>
</div>

{#each ingredients as ingredientGroup}
	{#if ingredientGroup.name}
		<h3>{ingredientGroup.name}</h3>
	{/if}
	<ul>
		{#each ingredientGroup.ingredients as ingredient}
			<li>
				{formatIngredientAmount(ingredient, currentUnits, units)}
				<strong class="lowercase">
					{formatIngredientName(ingredient)}
				</strong>
				{#if ingredient.info}
					<span class="lowercase">({ingredient.info})</span>
				{/if}
			</li>
		{/each}
	</ul>
{/each}
