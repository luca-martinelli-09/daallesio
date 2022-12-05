<script lang="ts">
	export let src: string;
	export let title: string;
</script>

<a href={src} class="group relative overflow-hidden uppercase font-bold">
	<span class="block group-hover:-translate-y-full transition-transform duration-500 ease-in-out">{title}</span>
	<span class="absolute top-0 left-0 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out">{title}</span>
</a>
