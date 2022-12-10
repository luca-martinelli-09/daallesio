<script lang="ts">
	import { afterUpdate } from 'svelte';
	import SearchResult from './SearchResult.svelte';
	import { queryRecipes } from '$lib/utils';
	import type { Recipe } from '$lib/utils/utils';
	import Icon from '@iconify/svelte';

	let opened = false;

	let input: HTMLElement;
	let query: string;

	afterUpdate(() => {
		input?.focus();
	});

	let results: Recipe[];
	async function search() {
		if (query.length >= 3) {
			results = await queryRecipes(query);
		} else {
			results = [];
		}
	}
</script>

<a
	href="/cerca"
	on:click={(e) => {
		e.preventDefault();
		opened = true;
		document.body.classList.add('lock');
	}}
	class="text-3xl cursor-pointer"
>
	<Icon icon="ion:search-outline" />
</a>

{#if opened}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<div
		class="fixed inset-0 bg-opacity-50 dark:bg-opacity-30 bg-black dark:bg-white z-20 p-5 overflow-y-auto"
		on:click={() => {
			opened = false;
			document.body.classList.remove('lock');
		}}
	>
		<div
			class="bg-white dark:bg-black w-full max-w-screen-md p-5 mx-auto rounded-xl flex flex-col gap-5"
			on:click={(e) => e.stopPropagation()}
		>
			<div class="flex gap-2 items-center border-2 border-black dark:border-white px-3 rounded-full">
				<span class="text-xl"><Icon icon="ion:search-outline" /></span>
				<input
					class="flex-1 outline-none py-2 bg-transparent"
					placeholder="Cerca..."
					type="text"
					name="q"
					id="query"
					autocomplete="off"
					bind:this={input}
					bind:value={query}
					on:keyup={search}
				/>
			</div>
			<div class="border-t pt-5 flex flex-col gap-3">
				{#if results?.length > 0}
					{#each results as result}
						<SearchResult recipe={result} />
					{/each}
				{:else}
					<span>Nessun risultato da elencare :(</span>
				{/if}
			</div>
		</div>
	</div>
{/if}
