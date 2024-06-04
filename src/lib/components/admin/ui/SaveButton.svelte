<script lang="ts" generics="T extends Record<string, unknown>">
  import type { Snippet } from "svelte";

  import { Loader } from "lucide-svelte";
  import type { SuperForm } from "sveltekit-superforms";
  import FormButton from "$lib/components/ui/form/form-button.svelte";

  let { form, modal = false, children }: { form: SuperForm<T>; modal?: boolean; children?: Snippet } = $props();
  let { delayed } = form;
</script>

<div class={!modal ? "save-title" : "mt-5 flex justify-end"}>
  {#if !$delayed}
    <FormButton>
      {#if children}
        {@render children()}
      {:else}
        Salva
      {/if}
    </FormButton>
  {:else}
    <Loader class="animate-spin" />
  {/if}
</div>
