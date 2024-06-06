<script>
    import "./app.css";
    import Footer from "$lib/components/front/Footer.svelte"
  import Header from "$lib/components/front/Header.svelte";

    const {children} = $props()
</script>

<Header />

{@render children()}

<Footer/>