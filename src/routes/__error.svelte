<script context="module">
  /** @type {import('@sveltejs/kit').ErrorLoad} */
  export function load({ error, status }) {
    return {
      props: {
        status: status,
        message: error.message
      },
    };
  }
</script>

<script>
  import Navbar from '$lib/components/Navbar.svelte';
  
  export let status;
  export let message;
</script>

<Navbar />

<main class="flex justify-center items-center">
  <article class="flex flex-col items-center justify-center">
    <h1 class="font-serif text-9xl">{status}</h1>
    <p class="mt-3 text-xl">{message}</p>
  </article>
</main>