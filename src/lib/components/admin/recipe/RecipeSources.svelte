<script lang="ts">
  import Button from "$lib/components/ui/button/button.svelte";
  import * as Card from "$lib/components/ui/card";
  import * as Form from "$lib/components/ui/form";
  import Input from "$lib/components/ui/input/input.svelte";
  import { SourceTypeEnum } from "$lib/form/enums";
  import { PlusIcon, Trash2Icon } from "lucide-svelte";
  import type { SuperForm } from "sveltekit-superforms";
  import type { PageData } from "../../../../routes/(admin)/admin/ricette/[id]/$types";
  import EnumSelect from "../ui/EnumSelect.svelte";

  let { form }: { form: SuperForm<PageData["form"]["data"]> } = $props();
  let formData = form.form;

  function addSource() {
    $formData.sources = [...$formData.sources, { id: null, title: "", url: "", type: "GENERAL" }];
  }

  function removeSource(i: number) {
    $formData.sources = [...$formData.sources.filter((_, j) => i !== j)];
  }
</script>

<div class="edit-card-container">
  <div class="main-cards">
    {#each $formData.sources as source, i (i)}
      <Card.Root>
        <Card.Header>
          <Card.Title>
            <div class="flex gap-4 items-center justify-between">
              <span>{source.title}</span>
              <Button on:click={() => removeSource(i)} variant="ghost" size="icon"><Trash2Icon class="h-4 w-4" /></Button>
            </div>
          </Card.Title>
        </Card.Header>
        <Card.Content class="grid gap-4">
          <input type="hidden" name="sources[{i}].id" value={source.id} />

          <Form.Field {form} name="sources[{i}].title">
            <Form.Control let:attrs>
              <Form.Label>Nome</Form.Label>
              <Input {...attrs} bind:value={source.title} />
            </Form.Control>
            <Form.FieldErrors />
          </Form.Field>

          <Form.Field {form} name="sources[{i}].url">
            <Form.Control let:attrs>
              <Form.Label>Link</Form.Label>
              <Input {...attrs} bind:value={source.url} />
            </Form.Control>
            <Form.FieldErrors />
          </Form.Field>

          <EnumSelect {form} label="Tipologia" placeholder="Seleziona una tipologia" name="sources[{i}].type" bind:formData={source.type} enumOptions={SourceTypeEnum} nullable={false} />
        </Card.Content>
      </Card.Root>
    {/each}
    <Button variant="secondary" class="w-full gap-1" size="lg" on:click={addSource}><PlusIcon class="h-4 w-4" /> Aggiungi fonte</Button>
  </div>
</div>
