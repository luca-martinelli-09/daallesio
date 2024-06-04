<script lang="ts">
  import TipTapEditor from "$lib/components/admin/ui/TipTapEditor.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import * as Card from "$lib/components/ui/card";
  import * as Form from "$lib/components/ui/form";
  import Input from "$lib/components/ui/input/input.svelte";
  import { PlusIcon, Trash2Icon } from "lucide-svelte";
  import type { SuperForm } from "sveltekit-superforms";
  import type { PageData } from "../../../../routes/(admin)/admin/ricette/[id]/$types";

  let { form }: { form: SuperForm<PageData["form"]["data"]> } = $props();
  let formData = form.form;

  function addStep() {
    $formData.recipeSteps = [...$formData.recipeSteps, { id: null, number: $formData.recipeSteps.length + 1, text: "<p></p>" }];
  }

  function removeStep(e: Event, i: number) {
    $formData.recipeSteps = [...$formData.recipeSteps.filter((_, j) => i !== j)];
  }
</script>

<div class="edit-card-container">
  <div class="main-cards">
    <Card.Root class="mb-5">
      <Card.Header>
        <Card.Title>Introduzione</Card.Title>
      </Card.Header>
      <Card.Content class="grid gap-4">
        <TipTapEditor bind:content={$formData.introduction} name="introduction" />
      </Card.Content>
    </Card.Root>

    {#each $formData.recipeSteps as recipeStep, i (`step-${i}`)}
      <Card.Root>
        <Card.Header>
          <Card.Title>
            <div class="flex gap-4 items-center justify-between">
              <span>Step {recipeStep.number}</span>
              <Button type="button" variant="ghost" on:click={(e) => removeStep(e, i)}><Trash2Icon class="h-4 w-4" /></Button>
            </div>
          </Card.Title>
        </Card.Header>
        <Card.Content class="grid gap-4">
          <input type="hidden" name="recipeSteps[{i}].id" value={recipeStep.id} />

          <Form.Field {form} name="recipeSteps[{i}].number">
            <Form.Control let:attrs>
              <Form.Label>Numero</Form.Label>
              <Input {...attrs} type="number" bind:value={recipeStep.number} />
            </Form.Control>
            <Form.FieldErrors />
          </Form.Field>

          <TipTapEditor bind:content={recipeStep.text} name="text" />
        </Card.Content>
      </Card.Root>
    {/each}

    <Button type="button" variant="secondary" size="lg" class="w-full gap-1 mb-5" on:click={addStep}><PlusIcon class="h-4 w-4" /> Aggiungi step</Button>

    <Card.Root>
      <Card.Header>
        <Card.Title>Conclusione</Card.Title>
      </Card.Header>
      <Card.Content class="grid gap-4">
        <TipTapEditor bind:content={$formData.conclusion} name="conclusion" />
      </Card.Content>
    </Card.Root>
  </div>
</div>
