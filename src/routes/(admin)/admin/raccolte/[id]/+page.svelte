<script lang="ts">
  import { page } from "$app/stores";
  import LazyImage from "$lib/components/LazyImage.svelte";
  import ImageSelect from "$lib/components/admin/ui/ImageSelect.svelte";
  import RecipeSelect from "$lib/components/admin/ui/RecipeSelect.svelte";
  import SaveButton from "$lib/components/admin/ui/SaveButton.svelte";
  import TagsInput from "$lib/components/admin/ui/TagsInput.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import { buttonVariants } from "$lib/components/ui/button/index.js";
  import * as Card from "$lib/components/ui/card";
  import * as Dialog from "$lib/components/ui/dialog";
  import * as Form from "$lib/components/ui/form";
  import Input from "$lib/components/ui/input/input.svelte";
  import Textarea from "$lib/components/ui/textarea/textarea.svelte";
  import { crudForm } from "$lib/utils";
  import { type Image } from "@prisma/client";
  import { PencilIcon, PlusIcon, Trash2Icon } from "lucide-svelte";
  import type { SuperForm } from "sveltekit-superforms";
  import type { PageData } from "./$types.js";

  let { data } = $props();

  let openImageSelect = $state(false);

  const form = crudForm(data.form, true) as SuperForm<PageData["form"]["data"]>;
  const { form: formData, enhance } = form;

  function addRecipe() {
    $formData.recipes = [
      ...$formData.recipes,
      {
        id: null,
        recipeId: null,
        collectionId: $page.params.id,
        order: $formData.recipes?.length,
        recipe: null,
      },
    ];
  }

  function removeRecipe(e: Event, i: number) {
    $formData.recipes = [...$formData.recipes.filter((_, k) => i !== k)];
  }
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

          <Form.Field {form} name="summary">
            <Form.Control let:attrs>
              <Form.Label>Descrizione</Form.Label>
              <Textarea {...attrs} bind:value={$formData.summary} />
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

      <Card.Root>
        <Card.Header>
          <Card.Title>Ricette</Card.Title>
        </Card.Header>
        <Card.Content>

          <div class="grid gap-1">
            {#each $formData.recipes as recipe, i (`recipe-${i}`)}
              <div class="flex flex-1 pr-3 items-center justify-between border rounded-lg px-3 py-1">
                <strong class="text-sm">{recipe.recipe?.title || 'Seleziona una ricetta'}</strong>

                <div class="flex gap-1">
                  <Dialog.Root>
                    <Dialog.Trigger class={buttonVariants({ variant: "ghost", size: "icon" })}><PencilIcon class="h-4 w-4" /></Dialog.Trigger>
                    <Dialog.Content class="max-w-screen-lg">
                      <Dialog.Header>
                        <Dialog.Title>{recipe.recipe?.title||'Seleziona una ricetta'}</Dialog.Title>
                      </Dialog.Header>
                      <input type="hidden" name="recipes[{i}].id" value={recipe.id} />

                      <RecipeSelect
                        name="recipes[{i}].recipeId"
                        placeholder="Seleziona una ricetta"
                        label="Ricetta"
                        {form}
                        bind:formData={recipe.recipeId}
                        onchange={(r) => {
                          $formData.recipes[i].recipe = r ? { ...r, date: null } : null;
                        }}
                      />

                      <Form.Field {form} name="recipes[{i}].order">
                        <Form.Control let:attrs>
                          <Form.Label>Ordine</Form.Label>
                          <Input {...attrs} type="number" bind:value={recipe.order} />
                        </Form.Control>
                        <Form.FieldErrors />
                      </Form.Field>
                    </Dialog.Content>
                  </Dialog.Root>

                  <Button size="icon" type="button" variant="ghost" on:click={(e) => removeRecipe(e, i)}><Trash2Icon class="h-4 w-4"></Trash2Icon></Button>
                </div>
              </div>
            {/each}
          </div>
          
          <Button type="button" variant="secondary" size="sm" class="w-full gap-1 mt-4" on:click={() => addRecipe()}><PlusIcon class="h-4 w-4" /> Aggiungi ricetta</Button>
        </Card.Content>
      </Card.Root>
    </div>

    <div>
      <div class="side-cards">
        <Card.Root>
          <Card.Header>
            <Card.Title>SEO</Card.Title>
          </Card.Header>
          <Card.Content class="grid gap-4">
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
    
        <Card.Root>
          <Card.Header>
            <Card.Title>Immagine</Card.Title>
          </Card.Header>
          <Card.Content class="grid gap-4">
            {#if $formData.image}
              <LazyImage image={$formData.image as Image} />
            {/if}

            <Button type="button" variant="secondary" onclick={() => (openImageSelect = true)}>Seleziona immagine</Button>
          </Card.Content>
        </Card.Root>
      </div>
    </div>
  </div>

  <ImageSelect bind:open={openImageSelect} onselected={(i:Image) => {
    $formData.image = i
    $formData.imageId = i.id
  }} />
</form>