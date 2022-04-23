<script>
  import { onMount } from "svelte";
  import Navbar from "$lib/components/Navbar.svelte";
  import Footer from "$lib/components/Footer.svelte";

  onMount(() => {
    window.addEventListener("beforeinstallprompt", () => {});
  });
</script>

<svelte:head>
  <title>Il ricettario magico di Da Allesio</title>
</svelte:head>

<Navbar selected="home" />

<div class="m-5 md:m-20 flex flex-col justify-center text-center">
  <h1 class="text-7xl md:text-9xl uppercase font-serif">
    <span class="text-5xl md:text-8xl">Il ricettario</span><br />
    <span class="text-accent">magico</span>
  </h1>
  <h2 class="text-4xl md:text-6xl mt-5">di <span class="font-serif">Da Allesio</span></h2>
</div>

<main class="grid grid-cols-3 m-5 md:m-20">
  <a class="w-full h-80" href="/ricette/carbonara">
    <div
      class="transition-all w-full h-full bg-center bg-[length:100%] hover:bg-[length:110%] bg-[url('https://blog.giallozafferano.it/albe/wp-content/uploads/2020/08/15FA1142-B5FA-410C-878B-2B8745B85F64_001-960x949.jpg')]"
    />
  </a>
</main>

<Footer />
