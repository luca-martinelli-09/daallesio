<script lang="ts">
  import { page } from "$app/stores";
  import Icon from "@iconify/svelte";
  import Button from "./ui/button/button.svelte";

  let { class: classlist }: { class?: string } = $props();

  const url = $page.url;
</script>

<div class="flex items-center {classlist}">
  <Button variant="ghost" size="icon" href="https://t.me/share/url?url={url}" target="_blank" rel="noopener noreferrer">
    <Icon icon="logos:telegram" class="w-6 h-6" />
  </Button>

  <Button variant="ghost" size="icon" href="https://wa.me/?text={url}" target="_blank" rel="noopener noreferrer">
    <Icon icon="logos:whatsapp-icon" class="w-6 h-6" />
  </Button>

  <Button variant="ghost" size="icon" href="http://www.reddit.com/submit?url={url}" target="_blank" rel="noopener noreferrer">
    <Icon icon="logos:reddit-icon" class="w-6 h-6" />
  </Button>
</div>
