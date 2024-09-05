<script lang="ts">
    import { buttonVariants } from "$lib/components/ui/button";
    import Button from "$lib/components/ui/button/button.svelte";
    import * as Dialog from "$lib/components/ui/dialog";
    import * as Form from "$lib/components/ui/form";
    import Input from "$lib/components/ui/input/input.svelte";
    import Switch from "$lib/components/ui/switch/switch.svelte";
    import { RecipeIngredientTypeEnum, UnitTypeEnum } from "$lib/form/enums";
    import type { RecipeIngredientWithRelations } from "$lib/types";
    import { getIngredientRowString } from "$lib/utils";
    import { LucideGripVertical, PencilIcon, Trash2Icon } from "lucide-svelte";
    import { dndzone, type DndEvent } from "svelte-dnd-action";
    import { flip } from "svelte/animate";
    import type { SuperForm } from "sveltekit-superforms";
    import type { PageData } from "../../../../routes/(admin)/admin/ricette/[id]/$types";
    import EnumSelect from "../ui/EnumSelect.svelte";
    import IngredientSelect from "../ui/IngredientSelect.svelte";
    import RecipeSelect from "../ui/RecipeSelect.svelte";

    let {
        form,
        groupIndex,
    }: { form: SuperForm<PageData["form"]["data"]>; groupIndex: number } =
        $props();
    let formData = form.form;

    function getIngredientName(i: number, j: number) {
        const ingredient =
            $formData.ingredientGroups[groupIndex].ingredients[j];

        return getIngredientRowString(
            ingredient as RecipeIngredientWithRelations,
        ).toLocaleLowerCase();
    }

    function removeIngredient(e: Event, i: number, j: number) {
        $formData.ingredientGroups[groupIndex].ingredients = [
            ...$formData.ingredientGroups[groupIndex].ingredients.filter(
                (_, k) => j !== k,
            ),
        ];
    }

    const flipDurationMs = 300;

    function handleDndConsider(
        e: CustomEvent<DndEvent<any>>,
    ) {
        $formData.ingredientGroups[groupIndex].ingredients = e.detail.items.map(
            (i, j) => ({ ...i, order: j }),
        );
    }

    async function handleDndFinalize(
        e: CustomEvent<DndEvent<any>>,
    ) {
        $formData.ingredientGroups[groupIndex].ingredients = [
            ...e.detail.items.map((i, j) => ({ ...i, order: j })),
        ];
    }
</script>

<div
    class="grid gap-1"
    use:dndzone={{
        items: $formData.ingredientGroups[groupIndex].ingredients,
        flipDurationMs,
        dropTargetStyle: {},
    }}
    onconsider={handleDndConsider}
    onfinalize={handleDndFinalize}
>
    {#each $formData.ingredientGroups[groupIndex].ingredients as ingredient, j (`group-${groupIndex}-ingredient-${ingredient.id}`)}
        <div
            animate:flip={{ duration: flipDurationMs }}
            class="flex flex-1 pr-3 items-center justify-between border rounded-lg px-3 py-1 bg-background"
        >
            <div class="flex items-center gap-1">
                <LucideGripVertical class="h-4 w-5 opacity-65" />
                <strong class="text-sm">
                    {getIngredientName(groupIndex, j)}
                </strong>
            </div>

            <div class="flex gap-1">
                <Dialog.Root>
                    <Dialog.Trigger
                        class={buttonVariants({
                            variant: "ghost",
                            size: "icon",
                        })}
                    >
                        <PencilIcon class="h-4 w-4" />
                    </Dialog.Trigger>
                    <Dialog.Content class="max-w-screen-lg">
                        <Dialog.Header>
                            <Dialog.Title>
                                {getIngredientName(groupIndex, j)}
                            </Dialog.Title>
                        </Dialog.Header>
                        <input
                            type="hidden"
                            name="ingredientGroups[{groupIndex}].ingredients[{j}].id"
                            value={ingredient.id}
                        />

                        <EnumSelect
                            {form}
                            label="Tipologia"
                            placeholder="Seleziona una tipologia"
                            name="ingredientGroups[{groupIndex}].ingredients[{j}].ingredientType"
                            bind:formData={ingredient.ingredientType}
                            enumOptions={RecipeIngredientTypeEnum}
                            nullable={false}
                            onchange={() => {
                                $formData.ingredientGroups[
                                    groupIndex
                                ].ingredients[j].recipe = null;
                                $formData.ingredientGroups[
                                    groupIndex
                                ].ingredients[j].ingredient = null;
                                $formData.ingredientGroups[
                                    groupIndex
                                ].ingredients[j].ingredientId = null;
                                $formData.ingredientGroups[
                                    groupIndex
                                ].ingredients[j].recipeId = null;
                            }}
                        />

                        {#if ingredient.ingredientType === "INGREDIENT"}
                            <IngredientSelect
                                name="ingredientGroups[{groupIndex}].ingredients[{j}].ingredientId"
                                placeholder="Seleziona un ingrediente"
                                label="Ingrediente"
                                {form}
                                bind:formData={ingredient.ingredientId}
                                onchange={(r) => {
                                    $formData.ingredientGroups[
                                        groupIndex
                                    ].ingredients[j].ingredient = r
                                        ? { ...r }
                                        : null;
                                    $formData.ingredientGroups[
                                        groupIndex
                                    ].ingredients[j].recipe = null;
                                    $formData.ingredientGroups[
                                        groupIndex
                                    ].ingredients[j].recipeId = null;
                                }}
                            />
                        {:else}
                            <RecipeSelect
                                name="ingredientGroups[{groupIndex}].ingredients[{j}].recipeId"
                                placeholder="Seleziona una ricetta"
                                label="Ricetta"
                                {form}
                                bind:formData={ingredient.recipeId}
                                onchange={(r) => {
                                    $formData.ingredientGroups[
                                        groupIndex
                                    ].ingredients[j].recipe = r
                                        ? { ...r }
                                        : null;
                                    $formData.ingredientGroups[
                                        groupIndex
                                    ].ingredients[j].ingredient = null;
                                    $formData.ingredientGroups[
                                        groupIndex
                                    ].ingredients[j].ingredientId = null;
                                }}
                            />
                        {/if}

                        {#if ingredient.ingredientId || ingredient.recipeId}
                            <div class="grid-field">
                                <Form.Field
                                    {form}
                                    name="ingredientGroups[{groupIndex}].ingredients[{j}].name"
                                >
                                    <Form.Control let:attrs>
                                        <Form.Label>Nome</Form.Label>
                                        <Input
                                            {...attrs}
                                            bind:value={ingredient.name}
                                        />
                                    </Form.Control>
                                    <Form.FieldErrors />
                                </Form.Field>

                                <Form.Field
                                    {form}
                                    name="ingredientGroups[{groupIndex}].ingredients[{j}].plural"
                                >
                                    <Form.Control let:attrs>
                                        <Form.Label>Nome al plurale</Form.Label>
                                        <Input
                                            {...attrs}
                                            bind:value={ingredient.plural}
                                        />
                                    </Form.Control>
                                    <Form.FieldErrors />
                                </Form.Field>
                            </div>

                            <div class="grid-field">
                                <Form.Field
                                    {form}
                                    name="ingredientGroups[{groupIndex}].ingredients[{j}].amount"
                                >
                                    <Form.Control let:attrs>
                                        <Form.Label>Quantità</Form.Label>
                                        <Input
                                            {...attrs}
                                            type="number"
                                            bind:value={ingredient.amount}
                                        />
                                    </Form.Control>
                                    <Form.FieldErrors />
                                </Form.Field>

                                <EnumSelect
                                    {form}
                                    label="Unità di misura"
                                    placeholder="Seleziona una unità di misura"
                                    name="ingredientGroups[{groupIndex}].ingredients[{j}].unit"
                                    bind:formData={ingredient.unit}
                                    enumOptions={UnitTypeEnum}
                                />
                            </div>

                            <Form.Field
                                {form}
                                name="ingredientGroups[{groupIndex}].ingredients[{j}].fixed"
                                class="flex items-center gap-4 space-y-0"
                            >
                                <Form.Control let:attrs>
                                    <Form.Label>Quantità fissa</Form.Label>
                                    <Switch
                                        {...attrs}
                                        includeInput
                                        bind:checked={ingredient.fixed}
                                    />
                                </Form.Control>
                            </Form.Field>

                            <div class="grid-field">
                                <Form.Field
                                    {form}
                                    name="ingredientGroups[{groupIndex}].ingredients[{j}].moreInfo"
                                >
                                    <Form.Control let:attrs>
                                        <Form.Label>
                                            Ulteriori informazioni
                                        </Form.Label>
                                        <Input
                                            {...attrs}
                                            bind:value={ingredient.moreInfo}
                                        />
                                    </Form.Control>
                                    <Form.FieldErrors />
                                </Form.Field>

                                <Form.Field
                                    {form}
                                    name="ingredientGroups[{groupIndex}].ingredients[{j}].order"
                                >
                                    <Form.Control let:attrs>
                                        <Form.Label>Ordine</Form.Label>
                                        <Input
                                            {...attrs}
                                            type="number"
                                            bind:value={ingredient.order}
                                        />
                                    </Form.Control>
                                    <Form.FieldErrors />
                                </Form.Field>
                            </div>
                        {/if}
                    </Dialog.Content>
                </Dialog.Root>

                <Button
                    size="icon"
                    type="button"
                    variant="ghost"
                    on:click={(e) => removeIngredient(e, groupIndex, j)}
                >
                    <Trash2Icon class="h-4 w-4" />
                </Button>
            </div>
        </div>
    {/each}
</div>

<style scoped lang="postcss">
    .grid-field {
        @apply grid lg:grid-cols-2 gap-2;
    }
</style>
