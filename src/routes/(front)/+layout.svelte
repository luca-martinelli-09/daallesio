<script>
    import "./app.css";
    import Footer from "$lib/components/front/Footer.svelte"

    const {children} = $props()
</script>

<main class="max-w-screen-2xl mx-auto min-h-screen">
    {@render children()}
</main>

<Footer/>