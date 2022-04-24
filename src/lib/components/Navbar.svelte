<script>
  import Logo from "$lib/components/Logo.svelte";
  import Cursor from "./Cursor.svelte";
  import Icon from "@iconify/svelte";

  export let selected = null;
  const defaultClass = "font-bold text-6xl md:text-base flex flex-row items-center justify-center gap-2 hover:underline underline-offset-4";
  const selectedClass = defaultClass + " underline";

  let menuOpened = false;

  function toggleMenu(e) {
    e.preventDefault();

    menuOpened = !menuOpened;
  }
</script>

<Cursor />

<nav class="fixed top-0 left-0 right-0 bg-background px-10 py-5 border-b-2 border-black flex items-center">
  <a href="/" class="flex items-center w-10 z-10">
    <Logo />
    <h4 class="hidden font-bold font-serif text-4xl ml-5">Da Allesio</h4>
  </a>
  <ul class="bg-background transition-transform origin-right {menuOpened ? "scale-x-100" : "scale-x-0 md:scale-x-100"} fixed top-0 left-0 right-0 bottom-0 flex-col flex flex-1 items-center justify-center gap-16 md:gap-10 md:flex-row md:relative">
    <li>
      <a href="/ricette" class={selected == "ricette" ? selectedClass : defaultClass} sveltekit:prefetch>
        <span>Ricette</span>
      </a>
    </li>
    <li>
      <a href="/ricette" class={selected == "ricette" ? selectedClass : defaultClass} sveltekit:prefetch>
        <span>Blog</span>
      </a>
    </li>
    <li>
      <a href="/ricette" class={selected == "ricette" ? selectedClass : defaultClass} sveltekit:prefetch>
        <span>Social</span>
      </a>
    </li>
  </ul>
  <div class="z-10 flex items-center justify-end flex-1 gap-3 md:flex-none">
    <a href="/ricette" class="w-10 flex justify-center items-center" sveltekit:prefetch>
      <Icon icon="bx:search" width={32} height={32} /><span class="hidden">Cerca</span>
    </a>
    <a href="/ricette" class="w-10 flex justify-center items-center md:hidden" sveltekit:prefetch on:click={toggleMenu}>
      <Icon icon={menuOpened ? "gg:close" : "gg:menu-right"} width={40} height={40} /><span class="hidden">Menù</span>
    </a>
  </div>
</nav>

<div class="h-20" />
