<script lang="ts">
  import SaveButton from "$lib/components/admin/ui/SaveButton.svelte";
  import * as Card from "$lib/components/ui/card";
  import * as Form from "$lib/components/ui/form";
  import Input from "$lib/components/ui/input/input.svelte";
  import { crudForm } from "$lib/utils";

  let { data } = $props();

  const form = crudForm(data.form);
  const { form: formData, enhance } = form;
</script>

<div class="section-title">
  <h1>{$formData.title}</h1>
</div>

<form method="POST" use:enhance>
  <SaveButton {form} />

  <div class="edit-card-container">
    <div class="main-cards">
      <Card.Root>
        <Card.Header>
          <Card.Title>Informazioni generali</Card.Title>
        </Card.Header>
        <Card.Content>
          <Form.Field {form} name="title">
            <Form.Control let:attrs>
              <Form.Label>Nome</Form.Label>
              <Input {...attrs} bind:value={$formData.title} />
            </Form.Control>
            <Form.FieldErrors />
          </Form.Field>

          <Form.Field {form} name="plural">
            <Form.Control let:attrs>
              <Form.Label>Nome plurale</Form.Label>
              <Input {...attrs} bind:value={$formData.plural} />
            </Form.Control>
            <Form.FieldErrors />
          </Form.Field>

          <Form.Field {form} name="order">
            <Form.Control let:attrs>
              <Form.Label>Posizione di ordinamento</Form.Label>
              <Input {...attrs} type="number" bind:value={$formData.order} />
            </Form.Control>
            <Form.FieldErrors />
          </Form.Field>
        </Card.Content>
      </Card.Root>
    </div>

    <div class="side-cards">
      <Card.Root>
        <Card.Header>
          <Card.Title>SEO</Card.Title>
        </Card.Header>
        <Card.Content>
          <Form.Field {form} name="slug">
            <Form.Control let:attrs>
              <Form.Label>Permalink</Form.Label>
              <Input {...attrs} bind:value={$formData.slug} readonly />
            </Form.Control>
            <Form.FieldErrors />
          </Form.Field>
        </Card.Content>
      </Card.Root>
    </div>
  </div>
</form>
