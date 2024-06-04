<script lang="ts">
  import SaveButton from "$lib/components/admin/ui/SaveButton.svelte";
  import TagsInput from "$lib/components/admin/ui/TagsInput.svelte";
  import * as Card from "$lib/components/ui/card";
  import * as Form from "$lib/components/ui/form";
  import Input from "$lib/components/ui/input/input.svelte";
  import { crudForm, getImageUrl } from "$lib/utils";
  import type { Image } from "@prisma/client";
  import SuperDebug from "sveltekit-superforms";

  let { data } = $props();

  const form = crudForm(data.form);
  const { form: formData, enhance } = form;
</script>

<div class="section-title">
  <h1>{$formData.fileName}</h1>
</div>

<form method="POST" use:enhance>
  <SaveButton {form} />

  <input type="hidden" name="fileId" value={$formData.fileId}>
  <input type="hidden" name="fileName" value={$formData.fileName}>
  <input type="hidden" name="base64" value={$formData.base64}>

  <div class="edit-card-container">
    <div class="main-cards">
      <div>
        <Card.Root>
          <Card.Header>
            <Card.Title>Informazioni generali</Card.Title>
          </Card.Header>
          <Card.Content class="grid gap-4">
            <Form.Field {form} name="caption">
              <Form.Control let:attrs>
                <Form.Label>Didascalia</Form.Label>
                <Input {...attrs} bind:value={$formData.caption} />
              </Form.Control>
              <Form.FieldErrors />
            </Form.Field>
  
            <Form.Field {form} name="alt">
              <Form.Control let:attrs>
                <Form.Label>Testo alternativo</Form.Label>
                <Input {...attrs} bind:value={$formData.alt} />
              </Form.Control>
              <Form.FieldErrors />
            </Form.Field>
          </Card.Content>
        </Card.Root>
      </div>
    </div>

    <div class="side-cards">
      <Card.Root>
        <Card.Header>
          <Card.Title>SEO</Card.Title>
        </Card.Header>
        <Card.Content class="grid gap-4">
          <img src={getImageUrl($formData as Image)} alt={$formData.alt} />

          <TagsInput {form} bind:formData={$formData.tags} name="tags" />
        </Card.Content>
      </Card.Root>
    </div>
  </div>
</form>