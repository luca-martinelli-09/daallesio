<script lang="ts">
  import { getImageUrl } from "$lib/utils";
  import type { Image } from "@prisma/client";

  let { image, class: classlist = "" }: { image: Image; class?: string } = $props();

  const src = getImageUrl(image);

  const srcSet = [
    "/cdn-cgi/image/width=320,format=webp/" + src + " 320w",
    "/cdn-cgi/image/width=480,format=webp/" + src + " 480w",
    "/cdn-cgi/image/width=640,format=webp/" + src + " 640w",
    "/cdn-cgi/image/width=720,format=webp/" + src + " 720w",
  ].join(", ");

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

    imageSourceElement.srcset = imageSourceElement?.src;
  }
</script>

<div class="{classlist} overflow-hidden img-loading" bind:this={pictureElement} style="background-image: url({image.base64})">
  <picture>
    <source bind:this={imageSourceElement} srcset={srcSet} {src} onerror={onError} />
    <img class="w-full h-full object-cover object-center" {src} alt={image.alt} loading="lazy" bind:this={imageElement} onload={onLoaded} onerror={onError} />
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
