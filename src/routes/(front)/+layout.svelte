<script>
    import Footer from "$lib/components/front/Footer.svelte";
    import Header from "$lib/components/front/Header.svelte";
    import "./app.css";

    const {children, data} = $props()
    const {categories} = $derived(data)
</script>

<Header {categories} />

{@render children()}

<Footer {categories} />