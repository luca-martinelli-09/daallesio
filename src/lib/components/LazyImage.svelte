<script lang="ts">
  import { getImageUrl, getSrcSet } from "$lib/utils";
  import type { Image } from "@prisma/client";
  import CustomLazyImage from "./CustomLazyImage.svelte";

  let { image, class: classlist = "" }: { image: Image; class?: string } = $props();

  const src = getImageUrl(image);
  const srcSet = getSrcSet(src);
</script>

<CustomLazyImage
  image={{
    src: src,
    alt: image.alt,
    base64: image.base64,
    srcSet: srcSet,
  }}
  class={classlist}
/>
