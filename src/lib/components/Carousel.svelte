<script lang="ts">
	import Siema from 'siema';
	import { onMount } from 'svelte';

	export let perPage = 1;
	export let loop = true;
	export let duration = 300;
	export let easing = 'ease-in-out';
	export let startIndex = 0;
	export let draggable = true;
	export let multipleDrag = true;
	export let threshold = 20;
	export let rtl = false;

	let siema: HTMLElement;
	let controller: Siema;

	onMount(() => {
		controller = new Siema({
			selector: siema,
			perPage: perPage,
			loop,
			duration,
			easing,
			startIndex,
			draggable,
			multipleDrag,
			threshold,
			rtl
		});

		return () => {
			controller.destroy();
		};
	});
</script>

<div class="relative w-full justify-center items-center">
	<div bind:this={siema}>
		<slot />
	</div>
</div>
