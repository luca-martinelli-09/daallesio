<script>
  import Logo from "$lib/components/Logo.svelte";

  export let selected = null;
  export const selectedClass = "font-bold";
</script>

<nav class="px-10 py-5 border-b-2 border-slate-900">
  <ul class="flex items-center gap-10">
    <li>
      <a href="/" class="flex items-center">
        <Logo size={40} color="#4ade80" />
        <h4 class="font-bold text-green-400 font-serif text-4xl ml-5">Da Allesio</h4>
      </a>
    </li>
    <li><a href="/ricette" class={selected == "ricette" ? selectedClass : null} sveltekit:prefetch>Ricette</a></li>
    <li><a href="/blog" class={selected == "blog" ? selectedClass : null} sveltekit:prefetch>Blog</a></li>
    <li><a href="/social" class={selected == "social" ? selectedClass : null} sveltekit:prefetch>Social</a></li>
  </ul>
</nav>
