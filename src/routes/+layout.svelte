<script>
  import { env } from "$env/dynamic/public";
  import { ModeWatcher } from "mode-watcher";
  import "../app.css";
  import "$lib/fonts/zttalk.css";

  const {children} = $props()
</script>

<ModeWatcher />
<svelte:head>
  <title>{env.PUBLIC_APP_NAME}</title>
</svelte:head>

{@render children()}
