<script>
  import { onMount } from "svelte";
  import Navbar from "$lib/components/Navbar.svelte";
  import Footer from "$lib/components/Footer.svelte";
  import Icon from "@iconify/svelte";
  import RecipeCard from "$lib/components/RecipeCard.svelte";

  onMount(() => {
    window.addEventListener("beforeinstallprompt", () => {});
  });
</script>

<svelte:head>
  <title>Il ricettario magico di Da Allesio</title>
</svelte:head>

<Navbar selected="home" />

<div class="mx-5 my-20 md:m-20 flex flex-col justify-center text-center">
  <h1 class="font-serif flex flex-col">
    <span class="text-5xl md:text-6xl lg:text-7xl uppercase">Il ricettario</span>
    <span class="text-7xl md:text-8xl lg:text-9xl text-accent uppercase">magico</span>
    <span class="text-4xl md:text-5xl lg:text-6xl mt-5"><span class="font-sans">di</span> Da Allesio</span>
  </h1>
</div>

<main class="m-5 md:m-20">
  <h2 class="mb-6 md:mb-10 font-serif text-3xl md:text-4xl lg:text-5xl font-bold">Ultime ricette</h2>
  <div class="grid grid-cols-1 gap-2 lg:grid-cols-2 xl:grid-cols-3">
    <RecipeCard
      recipe={{
        id: "carbonara",
        title: "Pasta alla carbonara",
        image: "https://blog.giallozafferano.it/albe/wp-content/uploads/2020/08/15FA1142-B5FA-410C-878B-2B8745B85F64_001-960x949.jpg",
        tags: [
          {
            name: "Primo piatto",
            icon: "ep:food",
            class: "bg-[#FAFBA4]"
          },
        ],
      }}
    />
    <RecipeCard
      recipe={{
        id: "tiramisu",
        title: "Tiramisù",
        image: "https://ricetta.it/Uploads/Imgs/tiramisu-classico.jpg",
        tags: [
          {
            name: "Dolce",
            icon: "bx:cake",
            class: "bg-[#3B0000] text-white"
          },
          {
            name: "Vegetariano",
            icon: "bx:leaf",
            class: "bg-[#DDFFBC]"
          },
        ],
      }}
    />
  </div>
  <a
    class="mt-6 md:mt-10 transition-colors duration-300 font-bold pl-8 px-2 py-2 flex md:inline-flex items-center border-accent-dark border-2 bg-accent-dark hover:bg-background hover:text-black text-white rounded-full"
    href="/ricette"
  >
    <span class="flex-1">Tutte le ricette</span>
    <span class="rounded-full p-1 bg-background ml-5">
      <Icon class="text-black" icon="heroicons-outline:arrow-sm-right" width={30} height={30} />
    </span>
  </a>
</main>

<Footer />
