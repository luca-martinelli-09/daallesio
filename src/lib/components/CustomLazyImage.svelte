<script lang="ts">
  let {
    image,
    class: classlist = "",
  }: {
    image: {
      src: string;
      alt?: string | null;
      base64?: string | null;
      srcSet: string;
    };
    class?: string;
  } = $props();

  let pictureElement: HTMLElement | undefined = $state();
  let imageElement: HTMLImageElement | undefined = $state();
  let imageSourceElement: HTMLSourceElement | undefined = $state();

  function onLoaded() {
    pictureElement?.classList.remove("img-loading");
  }

  $effect(() => {
    if (pictureElement && imageElement?.complete) onLoaded();
  });

  function onError() {
    if (!imageSourceElement) return;

    imageSourceElement.srcset = image.src;
  }
</script>

<div class="{classlist} overflow-hidden img-loading" bind:this={pictureElement} style="background-image: url({image.base64})">
  <picture>
    <source bind:this={imageSourceElement} srcset={image.srcSet} src={image.src} onerror={onError} />
    <img class="w-full h-full object-cover object-center" src={image.src} alt={image.alt} loading="lazy" bind:this={imageElement} onload={onLoaded} onerror={onError} />
  </picture>
</div>

<style scoped lang="postcss">
  div {
    @apply bg-cover bg-center bg-no-repeat;
  }

  .img-loading {
    @apply blur-sm;
  }

  picture > img {
    @apply opacity-100;
    @apply transition-opacity duration-300 ease-in-out;
  }

  .img-loading img {
    @apply opacity-0;
  }
</style>
