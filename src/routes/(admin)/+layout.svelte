<script>
  import { Toaster } from "$lib/components/ui/sonner";
  import { title } from "$lib/utils";
  import { ModeWatcher } from "mode-watcher";
  import "./app.css";

  const {children} = $props()
</script>

<svelte:head>
  <title>{title("Pannello di amministrazione")}</title>
</svelte:head>

<ModeWatcher />
<Toaster position="top-right" />

{@render children()}