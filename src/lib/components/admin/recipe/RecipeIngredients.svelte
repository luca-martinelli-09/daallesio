<script lang="ts">
  import Button from "$lib/components/ui/button/button.svelte";
  import * as Card from "$lib/components/ui/card";
  import * as Dialog from "$lib/components/ui/dialog";
  import * as Form from "$lib/components/ui/form";
  import Input from "$lib/components/ui/input/input.svelte";
  import Switch from "$lib/components/ui/switch/switch.svelte";
  import { RecipeIngredientTypeEnum, UnitTypeEnum } from "$lib/form/enums";
  import type { RecipeIngredientWithRelations } from "$lib/types";
  import { getIngredientRowString } from "$lib/utils";
  import { PencilIcon, PlusIcon, Trash2Icon } from "lucide-svelte";
  import type { SuperForm } from "sveltekit-superforms";
  import type { PageData } from "../../../../routes/(admin)/admin/ricette/[id]/$types";
  import EnumSelect from "../ui/EnumSelect.svelte";
  import IngredientSelect from "../ui/IngredientSelect.svelte";
  import RecipeSelect from "../ui/RecipeSelect.svelte";
  import { buttonVariants } from "$lib/components/ui/button";

  let { form }: { form: SuperForm<PageData["form"]["data"]> } = $props();
  let formData = form.form;

  function getIngredientName(i: number, j: number) {
    const ingredient = $formData.ingredientGroups[i].ingredients[j];

    return getIngredientRowString(ingredient as RecipeIngredientWithRelations).toLocaleLowerCase();
  }

  function addGroup() {
    $formData.ingredientGroups = [...$formData.ingredientGroups, { id: null, title: null, order: $formData.ingredientGroups.length, ingredients: [] }];
  }

  function removeGroup(e: Event, i: number) {
    $formData.ingredientGroups = [...$formData.ingredientGroups.filter((_, j) => i !== j)];
  }

  function addIngredient(i: number) {
    $formData.ingredientGroups[i].ingredients = [
      ...$formData.ingredientGroups[i].ingredients,
      {
        id: null,
        name: null,
        plural: null,
        amount: null,
        unit: null,
        fixed: false,
        ingredientId: null,
        recipeId: null,
        moreInfo: null,
        ingredientType: "INGREDIENT",
        order: $formData.ingredientGroups[i].ingredients.length,
        ingredient: null,
        recipe: null,
      },
    ];
  }

  function removeIngredient(e: Event, i: number, j: number) {
    $formData.ingredientGroups[i].ingredients = [...$formData.ingredientGroups[i].ingredients.filter((_, k) => j !== k)];
  }
</script>

<div class="edit-card-container">
  <div class="main-cards">
    {#each $formData.ingredientGroups as group, i (`group-${i}`)}
      <Card.Root>
        <Card.Header>
          <Card.Title>
            <div class="flex gap-4 items-center justify-between">
              <span>{group.title || `Gruppo ${i}`}</span>
              <Button type="button" variant="ghost" on:click={(e) => removeGroup(e, i)}><Trash2Icon class="h-4 w-4"></Trash2Icon></Button>
            </div>
          </Card.Title>
        </Card.Header>
        <Card.Content class="grid gap-4">
          <input type="hidden" name="ingredientGroups[{i}].id" value={group.id} />

          <Form.Field {form} name="ingredientGroups[{i}].title">
            <Form.Control let:attrs>
              <Form.Label>Nome</Form.Label>
              <Input {...attrs} bind:value={group.title} />
            </Form.Control>
            <Form.FieldErrors />
          </Form.Field>

          <Form.Field {form} name="ingredientGroups[{i}].order">
            <Form.Control let:attrs>
              <Form.Label>Ordine</Form.Label>
              <Input {...attrs} type="number" bind:value={group.order} />
            </Form.Control>
            <Form.FieldErrors />
          </Form.Field>

          <h4 class="font-bold">Ingredienti</h4>

          <div class="grid gap-1">
            {#each $formData.ingredientGroups[i].ingredients as ingredient, j (`group-${i}-ingredient-${j}`)}
              <div class="flex flex-1 pr-3 items-center justify-between border rounded-lg px-3 py-1">
                <strong class="text-sm">{getIngredientName(i, j)}</strong>

                <div class="flex gap-1">
                  <Dialog.Root>
                    <Dialog.Trigger class={buttonVariants({ variant: "ghost", size: "icon" })}><PencilIcon class="h-4 w-4" /></Dialog.Trigger>
                    <Dialog.Content class="max-w-screen-lg">
                      <Dialog.Header>
                        <Dialog.Title>{getIngredientName(i, j)}</Dialog.Title>
                      </Dialog.Header>
                      <input type="hidden" name="ingredientGroups[{i}].ingredients[{j}].id" value={ingredient.id} />

                      <EnumSelect
                        {form}
                        label="Tipologia"
                        placeholder="Seleziona una tipologia"
                        name="ingredientGroups[{i}].ingredients[{j}].ingredientType"
                        bind:formData={ingredient.ingredientType}
                        enumOptions={RecipeIngredientTypeEnum}
                        nullable={false}
                        onchange={() => {
                          $formData.ingredientGroups[i].ingredients[j].recipe = null;
                          $formData.ingredientGroups[i].ingredients[j].ingredient = null;
                          $formData.ingredientGroups[i].ingredients[j].ingredientId = null;
                          $formData.ingredientGroups[i].ingredients[j].recipeId = null;
                        }}
                      />

                      {#if ingredient.ingredientType === "INGREDIENT"}
                        <IngredientSelect
                          name="ingredientGroups[{i}].ingredients[{j}].ingredientId"
                          placeholder="Seleziona un ingrediente"
                          label="Ingrediente"
                          {form}
                          bind:formData={ingredient.ingredientId}
                          onchange={(r) => {
                            $formData.ingredientGroups[i].ingredients[j].ingredient = r ? { ...r } : null;
                            $formData.ingredientGroups[i].ingredients[j].recipe = null;
                            $formData.ingredientGroups[i].ingredients[j].recipeId = null;
                          }}
                        />
                      {:else}
                        <RecipeSelect
                          name="ingredientGroups[{i}].ingredients[{j}].recipeId"
                          placeholder="Seleziona una ricetta"
                          label="Ricetta"
                          {form}
                          bind:formData={ingredient.recipeId}
                          onchange={(r) => {
                            $formData.ingredientGroups[i].ingredients[j].recipe = r ? { ...r, date: null } : null;
                            $formData.ingredientGroups[i].ingredients[j].ingredient = null;
                            $formData.ingredientGroups[i].ingredients[j].ingredientId = null;
                          }}
                        />
                      {/if}

                      {#if ingredient.ingredientId || ingredient.recipeId}
                        <div class="grid-field">
                          <Form.Field {form} name="ingredientGroups[{i}].ingredients[{j}].name">
                            <Form.Control let:attrs>
                              <Form.Label>Nome</Form.Label>
                              <Input {...attrs} bind:value={ingredient.name} />
                            </Form.Control>
                            <Form.FieldErrors />
                          </Form.Field>

                          <Form.Field {form} name="ingredientGroups[{i}].ingredients[{j}].plural">
                            <Form.Control let:attrs>
                              <Form.Label>Nome al plurale</Form.Label>
                              <Input {...attrs} bind:value={ingredient.plural} />
                            </Form.Control>
                            <Form.FieldErrors />
                          </Form.Field>
                        </div>

                        <div class="grid-field">
                          <Form.Field {form} name="ingredientGroups[{i}].ingredients[{j}].amount">
                            <Form.Control let:attrs>
                              <Form.Label>Quantità</Form.Label>
                              <Input {...attrs} type="number" bind:value={ingredient.amount} />
                            </Form.Control>
                            <Form.FieldErrors />
                          </Form.Field>

                          <EnumSelect
                            {form}
                            label="Unità di misura"
                            placeholder="Seleziona una unità di misura"
                            name="ingredientGroups[{i}].ingredients[{j}].unit"
                            bind:formData={ingredient.unit}
                            enumOptions={UnitTypeEnum}
                          />
                        </div>

                        <Form.Field {form} name="ingredientGroups[{i}].ingredients[{j}].fixed" class="flex items-center gap-4 space-y-0">
                          <Form.Control let:attrs>
                            <Form.Label>Quantità fissa</Form.Label>
                            <Switch {...attrs} includeInput bind:checked={ingredient.fixed} />
                          </Form.Control>
                        </Form.Field>

                        <div class="grid-field">
                          <Form.Field {form} name="ingredientGroups[{i}].ingredients[{j}].moreInfo">
                            <Form.Control let:attrs>
                              <Form.Label>Ulteriori informazioni</Form.Label>
                              <Input {...attrs} bind:value={ingredient.moreInfo} />
                            </Form.Control>
                            <Form.FieldErrors />
                          </Form.Field>

                          <Form.Field {form} name="ingredientGroups[{i}].ingredients[{j}].order">
                            <Form.Control let:attrs>
                              <Form.Label>Ordine</Form.Label>
                              <Input {...attrs} type="number" bind:value={ingredient.order} />
                            </Form.Control>
                            <Form.FieldErrors />
                          </Form.Field>
                        </div>
                      {/if}
                    </Dialog.Content>
                  </Dialog.Root>

                  <Button size="icon" type="button" variant="ghost" on:click={(e) => removeIngredient(e, i, j)}><Trash2Icon class="h-4 w-4"></Trash2Icon></Button>
                </div>
              </div>
            {/each}
          </div>

          <Button type="button" variant="secondary" size="sm" class="w-full gap-1" on:click={() => addIngredient(i)}><PlusIcon class="h-4 w-4" /> Aggiungi ingrediente</Button>
        </Card.Content>
      </Card.Root>
    {/each}

    <Button type="button" variant="secondary" size="lg" class="w-full gap-1 mt-5" on:click={addGroup}><PlusIcon class="h-4 w-4" /> Aggiungi gruppo di ingredienti</Button>
  </div>
</div>

<style scoped lang="postcss">
  .grid-field {
    @apply grid lg:grid-cols-2 gap-2;
  }
</style>
