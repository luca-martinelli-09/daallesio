<script lang="ts" generics="F extends Record<string, unknown>">
  import * as Form from "$lib/components/ui/form";
  import type { FormPath, SuperForm } from "sveltekit-superforms";
  import Input from "$lib/components/ui/input/input.svelte";

  let {
    form,
    formData = $bindable(),
    name,
  }: {
    form: SuperForm<F>;
    formData: string[];
    name: FormPath<F>;
  } = $props();

  let tags: string = $state(formData.join(","));
  $effect(() => {
    formData = tags
      .split(",")
      .map((e) => e.trim())
      .filter((e) => e.length);
  });
</script>

<Form.Field {form} {name}>
  <Form.Control let:attrs>
    <Form.Label>Tag (separati da virgola)</Form.Label>
    <Input bind:value={tags} />

    <div class="flex flex-wrap gap-1">
      {#each formData as tag}
        <span class="rounded-full text-xs bg-muted px-2">{tag}</span>
      {/each}
    </div>

    {#each formData as tag}
      <input name={attrs.name} hidden value={tag} />
    {/each}
  </Form.Control>
  <Form.FieldErrors />
</Form.Field>
