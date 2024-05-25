<script lang="ts">
	import { queryRecipes } from '$lib/utils';
	import type { Recipe } from '$lib/utils/utils';
	import Icon from '@iconify/svelte';
	import { afterUpdate } from 'svelte';
	import { expoInOut } from 'svelte/easing';
	import { fade } from 'svelte/transition';
	import SearchResult from './SearchResult.svelte';
	import { page } from '$app/stores';

	let opened = false;

	let input: HTMLElement;
	let query: string;

	afterUpdate(() => {
		input?.focus();
	});

	let results: Recipe[];
	async function search() {
		if (query.length >= 3) {
			results = await queryRecipes($page.url, query);
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
	<div
		transition:fade={{ duration: 350, easing: expoInOut }}
		on:outroend={() => document.body.classList.remove('lock')}
		class="fixed inset-0 bg-opacity-60 dark:bg-opacity-60 bg-black z-20 p-5 overflow-y-auto backdrop-blur-md"
		on:click={() => (opened = false)}
		role="button"
		tabindex="0"
		on:keypress={() => {}}
	>
		<div
			class="shadow-lg bg-white dark:bg-black w-full max-w-screen-md p-7 mx-auto rounded-xl flex flex-col gap-5 dark:border dark:border-gray-500"
			on:click={(e) => e.stopPropagation()}
			role="button"
			tabindex="-1"
			on:keypress={() => {}}
		>
			<div
				class="flex gap-2 items-center border-2 border-gray-200 dark:border-gray-800 px-3 rounded-full"
			>
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
			<div class="border-t border-gray-200 dark:border-gray-800 pt-5 flex flex-col gap-3">
				{#if results?.length > 0}
					{#each results as result}
						<SearchResult recipe={result} />
					{/each}
				{:else}
					<span class="opacity-60">Nessun risultato da elencare :(</span>
				{/if}
			</div>
		</div>
	</div>
{/if}
