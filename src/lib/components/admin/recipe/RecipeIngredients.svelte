<script lang="ts">
    import Button from "$lib/components/ui/button/button.svelte";
    import * as Card from "$lib/components/ui/card";
    import * as Form from "$lib/components/ui/form";
    import Input from "$lib/components/ui/input/input.svelte";
    import { PlusIcon, Trash2Icon } from "lucide-svelte";
    import type { SuperForm } from "sveltekit-superforms";
    import { v4 as uuidv4 } from "uuid";
    import type { PageData } from "../../../../routes/(admin)/admin/ricette/[id]/$types";
    import RecipeIngredientList from "./RecipeIngredientList.svelte";

    let { form }: { form: SuperForm<PageData["form"]["data"]> } = $props();
    let formData = form.form;

    function addGroup() {
        $formData.ingredientGroups = [
            ...$formData.ingredientGroups,
            {
                id: null,
                title: null,
                order: $formData.ingredientGroups.length,
                ingredients: [],
            },
        ];
    }

    function removeGroup(e: Event, i: number) {
        $formData.ingredientGroups = [
            ...$formData.ingredientGroups.filter((_, j) => i !== j),
        ];
    }

    function addIngredient(i: number) {
        $formData.ingredientGroups[i].ingredients = [
            ...$formData.ingredientGroups[i].ingredients,
            {
                id: "new-" + uuidv4(),
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
</script>

<div class="edit-card-container">
    <div class="main-cards">
        {#each $formData.ingredientGroups as group, i (`group-${i}`)}
            <Card.Root>
                <Card.Header>
                    <Card.Title>
                        <div class="flex gap-4 items-center justify-between">
                            <span>{group.title || `Gruppo ${i}`}</span>
                            <Button
                                type="button"
                                variant="ghost"
                                on:click={(e) => removeGroup(e, i)}
                            >
                                <Trash2Icon class="h-4 w-4" />
                            </Button>
                        </div>
                    </Card.Title>
                </Card.Header>
                <Card.Content class="grid gap-4">
                    <input
                        type="hidden"
                        name="ingredientGroups[{i}].id"
                        value={group.id}
                    />

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
                            <Input
                                {...attrs}
                                type="number"
                                bind:value={group.order}
                            />
                        </Form.Control>
                        <Form.FieldErrors />
                    </Form.Field>

                    <h4 class="font-bold">Ingredienti</h4>

                    <RecipeIngredientList {form} groupIndex={i} />

                    <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        class="w-full gap-1"
                        on:click={() => addIngredient(i)}
                    >
                        <PlusIcon class="h-4 w-4" /> Aggiungi ingrediente
                    </Button>
                </Card.Content>
            </Card.Root>
        {/each}

        <Button
            type="button"
            variant="secondary"
            size="lg"
            class="w-full gap-1 mt-5"
            on:click={addGroup}
            ><PlusIcon class="h-4 w-4" /> Aggiungi gruppo di ingredienti</Button
        >
    </div>
</div>
