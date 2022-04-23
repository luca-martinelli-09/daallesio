<script>
  import Logo from "$lib/components/Logo.svelte";
  import Cursor from "./Cursor.svelte";

  export let selected = null;
  export const selectedClass = "font-bold underline underline-offset-4";
  export const defaultClass = "font-bold hover:underline underline-offset-4";
</script>

<Cursor />

<nav class="px-10 py-5 border-b-2 border-black flex items-center">
  <a href="/" class="flex items-center md:absolute">
    <Logo size={40} />
    <h4 class="hidden font-bold font-serif text-4xl ml-5">Da Allesio</h4>
  </a>
  <ul class="flex flex-1 justify-center items-center gap-10">
    <li><a href="/ricette" class={selected == "ricette" ? selectedClass : defaultClass} sveltekit:prefetch>Ricette</a></li>
    <li><a href="/" class={selected == "blog" ? selectedClass : defaultClass} sveltekit:prefetch>Blog</a></li>
    <li><a href="/" class={selected == "social" ? selectedClass : defaultClass} sveltekit:prefetch>Social</a></li>
  </ul>
</nav>
