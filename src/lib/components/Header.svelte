<script>
	import Logo from './Logo.svelte';
	import Icon from '@iconify/svelte';
	import NavbarItem from './NavbarItem.svelte';
</script>

<head class="flex p-5 mb-3 items-center print:hidden">
	<a href="/"><Logo size="40px" color="currentColor" /></a>
	<nav class="flex flex-1 justify-center gap-5">
		<NavbarItem src="/" title="Home" />
		<NavbarItem src="/ricette" title="Ricette" />
	</nav>
	<a href="/cerca" class="text-3xl cursor-pointer"><Icon icon="ion:search-outline" /></a>
</head>
