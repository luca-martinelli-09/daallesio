<script lang="ts">
  import { page } from "$app/stores";
  import LazyImage from "$lib/components/LazyImage.svelte";
  import ShareButtons from "$lib/components/ShareButtons.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import { DifficultyEnum, OriginAreaEnum } from "$lib/form/enums";
  import type { FullRecipe, RecipeIngredientWithRelations } from "$lib/types";
  import { calcAmountIngredients, formatDuration, formatTime, getImageUrl, getIngredientAmount, getIngredientName, getIngredientRowString, getRecipeAllergens, getRecipeLabels, mergeIngredients, removeTags, slugify, title } from "$lib/utils";
  import Icon from "@iconify/svelte";
  import { fromDate, getLocalTimeZone, toCalendarDate } from "@internationalized/date";
  import { type Image } from "@prisma/client";
  import { BookIcon, GlobeIcon, LinkIcon, MinusIcon, PlusIcon } from "lucide-svelte";
  
  let { data } = $props();
  let { recipe }: { recipe: FullRecipe } = $derived(data);
  let units:number = $state(data.recipe?.units);

  function notEmpty(text?: string|null) {
    return text && text.replaceAll("<[^>]*>", "").trim().length > 0;
  }

	const schemaOrg = $derived.by(()=> ({
		'@context': 'https://schema.org/',
		'@type': 'Recipe',
		name: recipe.title,
		image: [getImageUrl(recipe.image as Image)],
		author: {
			'@type': 'Organization',
			name: 'Da Allesio'
		},
		datePublished: toCalendarDate(fromDate(recipe.date, getLocalTimeZone())).toString(),
		description: recipe.summary,
		recipeCuisine: recipe.originPlace?.area ? OriginAreaEnum[recipe.originPlace.area] : null,
		prepTime: formatDuration(recipe.time?.preparation),
		cookTime: formatDuration(recipe.time?.cook),
		keywords: [recipe.vegan ? 'vegana' : null, recipe.vegetarian ? 'vegetariana' : null, ...recipe.tags].filter(
			(e) => e
		),
		recipeCategory: recipe.type?.title,
		recipeIngredient: mergeIngredients(
      calcAmountIngredients(
        recipe.ingredientGroups.reduce(
          (pi, ci) => pi.concat(ci.ingredients),
          [] as RecipeIngredientWithRelations[]
        ), recipe.units, recipe.units)
    ).map(
			(i) => getIngredientRowString(i)
		),
		recipeYield: recipe.units,
    recipeInstructions: recipe.recipeSteps.map((step)=>({
      "@type": "HowToStep",
      "text": removeTags(step.text),
      "url": $page.url + `#step${step.number}`,
    })),
		totalTime: formatDuration(
			(recipe.time?.cook || 0) +
				(recipe.time?.leavening || 0) +
				(recipe.time?.preparation ||0)+
				(recipe.time?.rest || 0)
		)
	}));
</script>

<svelte:head>
	<title>{title(recipe.title)}</title>

	<meta name="description" content={recipe.summary} />

	<meta property="og:title" content={title(recipe.title)} />
	<meta property="og:description" content={recipe.summary} />
	<meta property="og:type" content="article" />
  {#each recipe.tags as tag}
	<meta property="og:tag" content={tag} />
  {/each}
	<meta property="og:site_name" content="Da Allesio" />
	<meta property="og:image" content={getImageUrl(recipe.image as Image)} />
	<meta property="og:locale" content="it_IT" />

	{@html `<script type="application/ld+json">${JSON.stringify(schemaOrg)}</script>`}
</svelte:head>

<main class="main-content mt-5">
  <div class="grid lg:grid-cols-3 bg-secondary rounded-lg overflow-hidden print:bg-none print:rounded-none">
    <div class="col-span-1">
      <LazyImage class="h-96 print:h-44 lg:h-full w-full" image={recipe.image as Image} />
    </div>

    <div class="lg:col-span-2 p-5 lg:p-10 flex flex-col gap-5">
      <h1 class="text-5xl md:text-6xl lg:text-7xl font-display font-bold">{recipe.title}</h1>
            
      <p class="text-justify leading-relaxed">{recipe.summary}</p>
      <div class="flex gap-2 items-center flex-wrap print:hidden">
        {#each getRecipeLabels(recipe) as recipeLabel}
          <div class="flex items-center gap-2 px-2 py-1 text-xs font-semibold rounded-full {recipeLabel.color}">
            <svelte:component this={recipeLabel.icon} class="w-3 h-3" />
            <span>{recipeLabel.text}</span>
          </div>
        {/each}
      </div>

      <div class="mt-10 flex flex-col gap-3">
        {#if recipe.type}
        <div><span class="font-thin">Categoria</span> <a href="/categorie/{recipe.type.slug}" class="lowercase font-bold">{recipe.type.title}</a></div>
        {/if}
        {#if recipe.originPlace?.area}
        <div><span class="font-thin">Origine</span> <a href="/aree/{slugify(OriginAreaEnum[recipe.originPlace.area])}" class="lowercase font-bold">{OriginAreaEnum[recipe.originPlace.area]}</a></div>
        {/if}

        <div class="mt-5 flex gap-x-5 flex-wrap print:mt-0">
          {#if recipe.time.preparation}
            <div><span class="font-thin">Preparazione</span> <strong>{formatTime(recipe.time.preparation)}</strong></div>
          {/if}
          
          {#if recipe.time.cook}
            <div><span class="font-thin">Cottura</span> <strong>{formatTime(recipe.time.cook)}</strong></div>
          {/if}

          {#if recipe.time.rest}
            <div><span class="font-thin">Riposo</span> <strong>{formatTime(recipe.time.rest)}</strong></div>
          {/if}

          {#if recipe.time.leavening}
            <div><span class="font-thin">Lievitazione</span> <strong>{formatTime(recipe.time.leavening)}</strong></div>
          {/if}
        </div>

        <div><span class="font-thin">Difficoltà</span> <strong class="lowercase">{DifficultyEnum[recipe.difficulty]}</strong></div>
      </div>

      {#if recipe.sources?.length}
      <div class="mt-10 flex items-center flex-wrap text-xs font-semibold print:hidden">
        {#each recipe.sources as source}
        <a href={source.url} target="_blank" rel="noopener noreferrer" class="flex items-center gap-2">
          {#if source.type === "BLOG"}
          <GlobeIcon class="h-4 w-4" />
          {:else if source.type === "BOOK"}
          <BookIcon class="h-4 w-4" />
          {:else if source.type === "GENERAL"}
          <LinkIcon class="h-4 w-4" />
          {:else if source.type === "INSTAGRAM"}
          <Icon icon="mdi:instagram" class="h-4 w-4" />
          {:else if source.type === "REDDIT"}
          <Icon icon="logos:reddit-icon" class="h-4 w-4" />
          {:else if source.type === "TIKTOK"}
          <Icon icon="logos:tiktok-icon" class="h-4 w-4" />
          {:else if source.type === "YOUTUBE"}
          <Icon icon="logos:youtube-icon" class="h-4 w-4" />
          {/if}
          <span>{source.title}</span>
        </a>
        {/each}
      </div>
      {/if}
    </div>
  </div>

  <div class="grid md:grid-cols-2 lg:grid-cols-3">
    <div class="col-span-1 p-2 py-10 lg:pr-10">
      <div class="flex justify-between items-start">
        <h2 class="text-4xl font-display font-bold">Ingredienti</h2>
  
        <div class="flex items-center gap-3">
          <Button variant="outline" size="icon" class="rounded-full print:hidden" on:click={() => units = Math.max(units - 1, 1)}>
            <MinusIcon class="h-5 w-5" />
          </Button>
  
          <span class="text-xl select-none print:hidden">{units}</span>
          <span class="hidden print:block">per {units} persone</span>
  
          <Button variant="outline" size="icon" class="rounded-full print:hidden" on:click={() => units++}>
            <PlusIcon class="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div class="mt-5 flex flex-col gap-5">
        {#each recipe.ingredientGroups as group}
        <div class="flex flex-col gap-2">
          {#if group.title}
            <h3 class="font-semibold text-lg">{group.title}</h3>
          {/if}

          <ul class="flex flex-col gap-1">
            {#each mergeIngredients(calcAmountIngredients(group.ingredients, recipe.units, units)) as ingredient}
              <li class="my-1 flex items-center gap-3">
                <div>
                  {#if ingredient.ingredient?.image || ingredient.recipe?.image}
                    <div class="w-10 h-10 rounded-full overflow-hidden select-none print:hidden">
                      <LazyImage image={(ingredient.ingredient?.image || ingredient.recipe?.image) as Image} /> 
                    </div>
                  {:else}
                    <span class="bg-muted text-muted-foreground w-10 h-10 rounded-full flex justify-center items-center select-none print:hidden">{getIngredientName(ingredient).charAt(0)}</span>
                  {/if}
                </div>
                <div class="flex flex-col flex-1">
                  {#if ingredient.ingredientType === "RECIPE" && ingredient.recipe}
                    <a href="/ricette/{ingredient.recipe.slug}">{getIngredientName(ingredient)}</a>
                  {:else}
                    <span class="text-lg">{getIngredientName(ingredient)}</span>
                  {/if}
                  <span class="text-sm text-muted-foreground">{ingredient.moreInfo}</span>
                </div>
                <span>{getIngredientAmount(ingredient)}</span>
              </li>
            {/each}
          </ul>
        </div>
        {/each}
      </div>

      <div class="text-red-800 dark:text-red-400 flex flex-wrap gap-2 mt-10 print:hidden">
        {#each getRecipeAllergens(recipe) as allergen}
        <span title={allergen.text} class="aspect-square bg-secondary p-3 rounded-full">
          <svelte:component this={allergen.icon} class="w-7 h-7" />
        </span>
        {/each}
      </div>
    </div>

    <div class="lg:col-span-2 p-2 lg:p-10 lg:pr-0">
      <h2 class="text-4xl font-display font-bold">Procedimento</h2>

      <article class="prose dark:prose-invert max-w-none mt-5">
        {#if notEmpty(recipe.introduction)}
        <div>
          {@html recipe.introduction}
        </div>
        {/if}

        {#each recipe.recipeSteps as step}
        <div class="flex flex-col items-start justify-start mt-5 print:mt-0">
          <span id="step{step.number}" class="rounded-full bg-secondary text-secondary-foreground py-1 px-3 font-semibold text-sm print:hidden select-none">Passaggio #{step.number}</span>
          <div>{@html step.text}</div>
        </div>
        {/each}

        {#if notEmpty(recipe.conclusion)}
        <div>
          {@html recipe.conclusion}
        </div>
        {/if}
      </article>
      
      <ShareButtons class="mt-10 print:hidden" />

      {#if recipe.tags?.length}
      <div class="flex items-center gap-2 text-xs mt-5 print:hidden">
        {#each recipe.tags as tag}
          <a href="/tag/{slugify(tag)}" class="before:content-['#'] px-2 py-1 rounded-full bg-primary text-primary-foreground font-semibold">{tag}</a>
        {/each}
      </div>
      {/if}
    </div>
  </div>
</main>
