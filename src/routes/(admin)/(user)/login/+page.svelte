<script lang="ts">
  import { enhance } from "$app/forms";
  import * as Card from "$lib/components/ui/card";
  import * as Form from "$lib/components/ui/form";
  import Input from "$lib/components/ui/input/input.svelte";
  import { title } from "$lib/utils.js";
  import { superForm } from "sveltekit-superforms";

  const { data } = $props();

  const form = superForm(data.form);

  const { form: formData } = form;
</script>

<svelte:head>
  <title>{title("Accedi")}</title>
</svelte:head>

<form method="POST" use:enhance>
  <Card.Root class="w-full max-w-2xl mx-auto">
    <Card.Header>
      <Card.Title class="text-2xl">Accedi</Card.Title>
      <Card.Description>Inserisci i tuoi dati per accedere</Card.Description>
    </Card.Header>
    <Card.Content class="grid gap-4">
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
    <Card.Footer>
      <Form.Button class="w-full">Accedi</Form.Button>
    </Card.Footer>
  </Card.Root>
</form>
