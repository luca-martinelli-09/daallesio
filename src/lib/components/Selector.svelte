<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Icon from '@iconify/svelte';

	export let title: string;

	export let bordered: boolean = true;

	export let options: any[];
	export let selected: any | null = null;

	let opened = true;

	const dispatch = createEventDispatcher();

	function select(option: string | null) {
		selected = option;
		dispatch('selected', { selected: option });
	}
</script>

<div class="flex flex-col gap-4 w-full md:w-auto">
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<div
		class="iconed-span cursor-pointer select-none {bordered ? 'md:border-r md:pr-3' : ''}"
		on:click={() => (opened = !opened)}
		role="combobox"
		aria-expanded={opened}
		aria-controls={options.join(',')}
		tabindex="0"
	>
		<span>{title}</span>
		<span class="font-normal">({selected || 'Nessuno'})</span>
		<span class="text-base ml-1 flex flex-1 justify-end">
			<Icon icon={opened ? 'ion:chevron-up-outline' : 'ion:chevron-down-outline'} />
		</span>
	</div>

	{#if opened}
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<div class="flex flex-col gap-2 text-sm capitalize cursor-pointer">
			<span
				on:click={() => select(null)}
				class={selected ? '' : 'font-bold'}
				role="option"
				aria-selected={!selected}
				tabindex="0">Nessuno</span
			>
			{#each options as option}
				<span
					on:click={() => select(option)}
					class={selected === option ? 'font-bold' : ''}
					role="option"
					aria-selected={selected === option}
					tabindex="0"
				>
					{option}
				</span>
			{/each}
		</div>
	{/if}
</div>
