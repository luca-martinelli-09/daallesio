<script lang="ts">
	import type { Recipe } from '$lib/utils/d';

	export let data: any;

	const info = <Recipe>data.info;
</script>

<svelte:component this={data.default} />
