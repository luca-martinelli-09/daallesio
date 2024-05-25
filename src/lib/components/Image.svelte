<script lang="ts">
	import { onMount } from 'svelte';

	export let src: string;
	export let srcSet: string | null = null;
	export let thumb: string = '';
	export let alt: string;

	let picture: HTMLElement;
	let image: HTMLImageElement;
	let srcError: boolean = false;

	function loaded() {
		picture.classList.remove('img-loading');
	}

	onMount(() => {
		if (image.complete) loaded();
	});
</script>

<div class={$$restProps.class}>
	<picture class="img-loading" bind:this={picture} style="background-image: url({thumb})">
		{#if srcSet && srcError}
			<source srcset={srcSet} on:error={() => (srcError = true)} />
		{/if}
		<img
			class="{$$restProps.class} object-cover object-center"
			{src}
			{alt}
			loading="lazy"
			bind:this={image}
			on:load={loaded}
		/>
	</picture>
</div>

<style scoped lang="postcss">
	picture {
		@apply bg-cover bg-center bg-no-repeat;
	}

	picture > img {
		@apply opacity-100;
		@apply transition-opacity duration-300 ease-in-out;
	}

	picture.img-loading > img {
		@apply opacity-0;
	}
</style>
