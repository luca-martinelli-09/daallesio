<script>
	import Logo from './Logo.svelte';
	import NavbarItem from './NavbarItem.svelte';
	import SearchPopup from './SearchPopup.svelte';
</script>

<head class="flex p-5 mb-3 items-center print:hidden justify-between">
	<a href="/"><Logo size="40px" color="currentColor" /></a>
	<nav class="flex flex-1 justify-center gap-10 shadow-lg sm:shadow-none sm:gap-5 fixed bottom-0 bg-white dark:bg-black p-5 inset-x-0 z-10 sm:relative sm:bg-transparent sm:p-0">
		<NavbarItem src="/" title="Home" />
		<NavbarItem src="/ricette" title="Ricette" />
		<NavbarItem src="/scopri" title="Scopri" />
	</nav>
	<SearchPopup />
</head>
