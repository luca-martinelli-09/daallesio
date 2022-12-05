<script lang="ts">
	import { onMount } from 'svelte';
	import Icon from '@iconify/svelte';

	let checked = false;

	onMount(() => {
		if (
			localStorage.theme === 'dark' ||
			(!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
		) {
			document.documentElement.classList.add('dark');
			checked = true;
		} else {
			document.documentElement.classList.remove('dark');
			checked = false;
		}
	});

	function onChange() {
		if (checked) {
			localStorage.theme = 'dark';
			document.documentElement.classList.add('dark');
		} else {
			localStorage.theme = 'light';
			document.documentElement.classList.remove('dark');
		}
	}
</script>

<div class="flex gap-2 items-center">
	<Icon icon="carbon:sun" />
	<label for="toggle-theme" class="inline-flex relative items-center cursor-pointer">
		<input
			type="checkbox"
			bind:checked
			on:change={onChange}
			id="toggle-theme"
			class="sr-only peer"
		/>
		<div
			class="w-9 h-5 bg-gray-200 rounded-full border border-slate-300 peer peer-checked:bg-[#FED049] peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-slate-600"
		/>
	</label>
	<Icon icon="carbon:moon" />
</div>
