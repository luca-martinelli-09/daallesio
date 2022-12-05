<script lang="ts">
	import { onMount } from 'svelte';
	import gsap from 'gsap';

	let cursor: HTMLElement;

	function onMouseMove(e: MouseEvent) {
		gsap.to(cursor, {
			duration: 0.3,
			x: e.clientX - cursor.offsetWidth / 2,
			y: e.clientY - cursor.offsetHeight / 2
		});
	}

	onMount(() => {
		const hoverables = document.querySelectorAll('a, button');

		for (let i = 0; i < hoverables.length; i++) {
			hoverables[i].addEventListener('mouseenter', onMouseHover);
			hoverables[i].addEventListener('mouseleave', onMouseHoverOut);
		}

		function onMouseHover() {
			gsap.to(cursor, {
				duration: 0.3,
				scale: 2
			});
		}
		function onMouseHoverOut() {
			gsap.to(cursor, {
				duration: 0.3,
				scale: 1
			});
		}
	});
</script>

<svelte:window on:mousemove={onMouseMove} />

<div bind:this={cursor} class="hidden lg:block fixed top-0 left-0 pointer-events-none mix-blend-difference text-white">
	<svg height="30" width="30" viewBox="0 0 30 30">
		<circle cx="15" cy="15" r="12" stroke-width="0" fill="currentColor" />
	</svg>
</div>
