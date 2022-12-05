<script lang="ts">
	import Cursor from '$lib/components/Cursor.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import Header from '$lib/components/Header.svelte';
	import { keywords, description, title, author } from '$lib/info';

	export const trailingSlash = 'never';

	import '../app.css';
</script>

<svelte:head>
	<meta name="keywords" content={keywords.join(',')} />
	<meta name="description" content={description} />
	<meta name="author" content={author} />
	<title>{title}</title>
</svelte:head>

<Header />

<slot />

<Footer />
<Cursor />
