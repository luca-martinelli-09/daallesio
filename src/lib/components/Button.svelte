<script lang="ts">
	import Icon from '@iconify/svelte';

	export let title: string;
	export let src: string;
	export let icon: string;
</script>

<a href={src} class="group inline-block relative text-white dark:text-black py-2 px-5">
	<span
		class="bg-black dark:bg-white absolute inset-0 rounded-full group-hover:scale-110 group-active:scale-90 transition-transform duration-500 ease-in-out"
	/>
	<div class="relative z-10 flex items-center">
		{title}
    <span class="text-lg ml-7 group-active:translate-x-1 transition-transform duration-500 ease-in-out"><Icon {icon} /></span>
	</div>
</a>
