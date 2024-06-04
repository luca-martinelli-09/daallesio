<script lang="ts">
  import SaveButton from "$lib/components/admin/ui/SaveButton.svelte";
  import * as Card from "$lib/components/ui/card";
  import * as Form from "$lib/components/ui/form";
  import Input from "$lib/components/ui/input/input.svelte";
  import { crudForm } from "$lib/utils.js";

  const { data } = $props();
  const form = crudForm(data.form);

  const { form: formData, enhance } = form;
</script>

<div class="section-title">
  <h1>{$formData.name}</h1>
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
          <Form.Field {form} name="name">
            <Form.Control let:attrs>
              <Form.Label>Nome</Form.Label>
              <Input {...attrs} bind:value={$formData.name} />
            </Form.Control>
            <Form.FieldErrors />
          </Form.Field>

          <Form.Field {form} name="username">
            <Form.Control let:attrs>
              <Form.Label>Username</Form.Label>
              <Input {...attrs} bind:value={$formData.username} />
            </Form.Control>
            <Form.FieldErrors />
          </Form.Field>

          <Form.Field {form} name="password">
            <Form.Control let:attrs>
              <Form.Label>Password</Form.Label>
              <Input {...attrs} type="password" bind:value={$formData.password} />
            </Form.Control>
            <Form.FieldErrors />
          </Form.Field>
        </Card.Content>
      </Card.Root>
    </div>
  </div>
</form>
