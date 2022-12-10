<script lang="ts">
	import type { SearchOptions } from '$lib/utils/utils';
	import { createEventDispatcher } from 'svelte';
	import Selector from './Selector.svelte';

	export let options: SearchOptions = {};

	const dispatch = createEventDispatcher();
</script>

<div
	class="bg-white dark:bg-black rounded-lg p-5 flex flex-col md:flex-row w-full md:w-auto items-start gap-5 md:gap-3"
>
	<Selector
		title="Tipologia"
		options={[
			'antipasto',
			'primo',
			'secondo',
			'dolce',
			'contorno',
			'pane',
			'salsa',
			'condimento',
			'cocktail',
			'liquore'
		]}
		on:selected={(e) => {
			options.type = e.detail.selected;
			dispatch('change', { options });
		}}
	/>
	<Selector
		title="Dieta"
		options={['vegetariana', 'vegana']}
		on:selected={(e) => {
			const selected = e.detail.selected;
			options.vegan = selected === 'vegana';
			options.vegetarian = selected === 'vegetariana';
			dispatch('change', { options });
		}}
	/>
	<Selector
		title="Continente"
		options={['asia', 'africa', 'europa', 'america', 'oceania']}
		on:selected={(e) => {
			options.originPlace = { continent: e.detail.selected };
			dispatch('change', { options });
		}}
	/>
	<Selector
		title="Difficoltà"
		options={[1, 2, 3, 4, 5]}
		bordered={false}
		on:selected={(e) => {
			options.difficulty = e.detail.selected;
			dispatch('change', { options });
		}}
	/>
</div>
