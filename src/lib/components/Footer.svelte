<script>
	import Icon from '@iconify/svelte';
	import ToggleTheme from './ToggleTheme.svelte';
</script>

<footer class="p-5 mt-3 text-sm flex flex-col lg:flex-row items-start lg:items-center justify-between print:hidden gap-5">
	<p>
		Realizzato da <a
			class="font-bold"
			href="https://w3id.org/people/lucamartinelli"
			target="_blank"
			rel="noopener noreferrer">Luca Martinelli</a
		>
	</p>
	<p class="flex gap-3 items-center">
		<strong>Puoi trovarci anche su</strong>
		<a href="https://instagram.com/daallesio" target="_blank" rel="noopener noreferrer" class="flex items-center gap-1">
			<span class="text-2xl"><Icon icon="ion:logo-instagram" /></span><span>daallesio</span>
		</a>
	</p>
	<ToggleTheme />
</footer>
