<script lang="ts">
  import EnumSelect from "$lib/components/admin/ui/EnumSelect.svelte";
  import SaveButton from "$lib/components/admin/ui/SaveButton.svelte";
  import TagsInput from "$lib/components/admin/ui/TagsInput.svelte";
  import * as Card from "$lib/components/ui/card";
  import * as Form from "$lib/components/ui/form";
  import Input from "$lib/components/ui/input/input.svelte";
  import Switch from "$lib/components/ui/switch/switch.svelte";
  import { AllergenEnum, UnitTypeEnum } from "$lib/form/enums.js";
  import { crudForm } from "$lib/utils";
  import { Allergen, UnitType } from "@prisma/client";

  let { data } = $props();

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

          <Form.Field {form} name="plural">
            <Form.Control let:attrs>
              <Form.Label>Nome al plurale</Form.Label>
              <Input {...attrs} bind:value={$formData.plural} />
            </Form.Control>
            <Form.FieldErrors />
          </Form.Field>

          <EnumSelect
            {form}
            name="defaultUnit"
            label="Unità di misura predefinita"
            placeholder="Seleziona un'unità di misura"
            enumOptions={UnitTypeEnum}
            bind:formData={$formData.defaultUnit}
            multiple={false}
          />
        </Card.Content>
      </Card.Root>

      <Card.Root>
        <Card.Header>
          <Card.Title>Informazioni nutrizionali</Card.Title>
        </Card.Header>
        <Card.Content class="grid gap-4">
          <Form.Field {form} name="vegetarian" class="flex items-center gap-4 space-y-0">
            <Form.Control let:attrs>
              <Form.Label>Alimento vegetariano</Form.Label>
              <Switch {...attrs} includeInput bind:checked={$formData.vegetarian} />
            </Form.Control>
          </Form.Field>

          <Form.Field {form} name="vegan" class="flex items-center gap-4 space-y-0">
            <Form.Control let:attrs>
              <Form.Label>Alimento vegano</Form.Label>
              <Switch {...attrs} includeInput bind:checked={$formData.vegan} />
            </Form.Control>
          </Form.Field>

          <EnumSelect {form} label="Allergeni" placeholder="Seleziona uno o più allergeni" name="allergens" enumOptions={AllergenEnum} bind:formData={$formData.allergens} multiple={true} />
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

          <TagsInput {form} bind:formData={$formData.tags} name="tags" />
        </Card.Content>
      </Card.Root>
    </div>
  </div>
</form>
