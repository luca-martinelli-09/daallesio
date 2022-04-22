<script>
  import { siteBaseUrl } from "$lib/meta";
  export let title;
  export let image;
  export let description;
  export let ingredients;
</script>

<svelte:head>
  {#if title}
    <title>{title}</title>
    <meta property="og:title" content={title} />
    <meta name="twitter:title" content={title} />
  {/if}

  {#if description}
    <meta name="description" content={description} />
    <meta property="og:description" content={description} />
    <meta name="twitter:description" content={description} />
  {/if}

  {#if image}
    <meta property="og:image" content="{siteBaseUrl}/images/{image.path}/{image.filename}.png" />
    <meta name="twitter:image" content="{siteBaseUrl}/images/{image.path}/{image.filename}.png" />
  {/if}
</svelte:head>

<main>
  <article class="prose">
    {#if title}
      <div class="header">
        <h1>{title}</h1>
      </div>
    {/if}

    {#if image}
      <div class="cover-image" />
    {/if}

    {#each ingredients as ingredient}
      <h3>{ingredient.icon} {ingredient.name}</h3>
    {/each}

    <div class="content">
      <slot />
    </div>
  </article>
</main>
