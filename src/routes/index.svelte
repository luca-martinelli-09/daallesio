<script>
  import { onMount } from "svelte";
  import Navbar from "$lib/components/Navbar.svelte";

  onMount(() => {
    window.addEventListener("beforeinstallprompt", () => {});
  });
</script>

<svelte:head>
  <title>Il ricettario magico di Da Allesio</title>
</svelte:head>

<Navbar selected="home" />

<main class="m-20 flex flex-col justify-center text-center">
  <h1 class="text-9xl uppercase font-serif">
    <span class="text-8xl">Il ricettario</span><br />
    <span class="text-green-400">magico</span>
  </h1>
  <h2 class="text-6xl mt-5">di <span class="font-serif">Da Allesio</span></h2>
</main>
