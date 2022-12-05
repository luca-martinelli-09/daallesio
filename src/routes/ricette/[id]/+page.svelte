<script lang="ts">
	import Ingredients from '$lib/components/Ingredients.svelte';
	import type { Recipe } from '$lib/utils/utils';
	import Icon from '@iconify/svelte';
	import { toHours } from '$lib/utils';

	export let data: any;

	const info = <Recipe>data.info;
</script>

<main class="mb-7 border-b border-b-gray-200 dark:border-b-gray-900 print:border-none">
	<section
		class="flex flex-col-reverse md:flex-row bg-[#EDEDED] dark:bg-[#020205] dark:text-white 2xl:rounded-xl overflow-hidden"
	>
		<div class="flex flex-col py-10 px-5 md:px-10 gap-5">
			<h1 class="text-4xl md:text-5xl lg:text-6xl font-serif">{info.title}</h1>
			<p class="text-justify text-sm">{info.description}</p>
			<div class="flex flex-1 flex-row flex-wrap items-end gap-3">
				{#if info.vegan || info.vegetarian}
					<div class="iconed-span text-green-700 dark:text-green-300">
						<span class="text-base"><Icon icon="ion:leaf-outline" /></span>
						<span>
							{info.vegetarian ? 'Vegetariano' : 'Vegano'}
						</span>
					</div>
				{/if}
				<div class="iconed-span text-[#8E0505] dark:text-[#FF5F7E]">
					<span class="text-base"><Icon icon="ion:restaurant-outline" /></span>
					<span>{info.type}</span>
				</div>
				{#if info.originPlace}
					<div class="iconed-span text-[#145374] dark:text-[#88E1F2]">
						<span class="text-base"><Icon icon="ion:earth-outline" /></span>
						<a
							href={'https://maps.google.com/?q=' +
								info.originPlace.lat +
								',' +
								info.originPlace.lon}
							target="_blank"
							rel="noopener noreferrer"
						>
							{info.originPlace.city}{info.originPlace.region
								? ' (' + info.originPlace.region + ')'
								: ''}, {info.originPlace.nation}
						</a>
					</div>
				{/if}
			</div>
			<div class="iconed-span text-gray-500 dark:text-gray-300">
				<span class="text-base"><Icon icon="ion:time-outline" /></span>
				<span>
					{new Date(info.date).toLocaleDateString(undefined, {
						day: 'numeric',
						month: 'long',
						weekday: 'long',
						year: 'numeric'
					})}
				</span>
			</div>
		</div>
		<img
			class="w-full md:w-1/2 object-cover object-center print:h-32"
			src={info.image}
			alt={info.title}
		/>
	</section>
	<article
		class="p-5 md:p-10 prose dark:prose-invert max-w-none text-justify prose-h2:text-3xl prose-h2:md:text-4xl prose-h2:font-serif print:prose-headings:my-4"
	>
		<h2>Informazioni</h2>
		<div class="grid grid-cols-1 gap-0 md:gap-20 md:grid-cols-2 print:gap-2">
			<div>
				<h3 class="mt-0">Tempi</h3>
				<table class="print:mb-0">
					<thead>
						<th>Preparazione</th>
						<th>Cottura</th>
						<th>Riposo</th>
					</thead>
					<tbody>
						<tr>
							<td>{toHours(info.time.preparation)}</td>
							<td>{toHours(info.time.cook)}</td>
							<td>{toHours(info.time.rest)}</td>
						</tr>
					</tbody>
				</table>
			</div>
			<div>
				<h3 class="mt-0">Difficoltà</h3>
				<span class="flex items-center text-[#FFB400] dark:text-[#FFE578] text-3xl">
					{#each Array(info.difficulty) as _}
						<Icon icon="ion:star" />
					{/each}
					{#each Array(5 - info.difficulty) as _}
						<Icon icon="ion:star-outline" />
					{/each}
				</span>
			</div>
		</div>

		<h2>Ingredienti</h2>
		<Ingredients ingredients={info.ingredients} units={info.units} />

		<h2>Procedimento</h2>
		<svelte:component this={data.default} />
	</article>
</main>
