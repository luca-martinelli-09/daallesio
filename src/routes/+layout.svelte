<script>
  import { page } from "$app/stores";
  import { env } from "$env/dynamic/public";
  import "$lib/fonts/zttalk.css";
  import { title } from "$lib/utils";
  import { ModeWatcher } from "mode-watcher";
  import "../app.css";

  const {children} = $props()
</script>

<ModeWatcher />
<svelte:head>
  <title>{env.PUBLIC_APP_NAME}</title>
  
  <meta name="description" content="Il blog ufficiale con tante ricette dal vostro ristorante preferito Da Allesio." />

   <link rel="canonical" href={env.PUBLIC_APP_URL} />

	<meta property="og:title" content={title()} />
	<meta property="og:description" content="Il blog ufficiale con tante ricette dal vostro ristorante preferito Da Allesio." />
	<meta property="og:type" content="website" />
	<meta property="og:site_name" content="Da Allesio" />
	<meta property="og:image" content="{$page.url.origin}/img/bg.png" />
	<meta property="og:locale" content="it_IT" />
</svelte:head>

{@render children()}
