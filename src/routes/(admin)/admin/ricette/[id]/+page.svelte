<script lang="ts">
    import { page } from "$app/stores";
    import RecipeIngredients from "$lib/components/admin/recipe/RecipeIngredients.svelte";
    import RecipeSheet from "$lib/components/admin/recipe/RecipeSheet.svelte";
    import RecipeSources from "$lib/components/admin/recipe/RecipeSources.svelte";
    import RecipeSteps from "$lib/components/admin/recipe/RecipeSteps.svelte";
    import SaveButton from "$lib/components/admin/ui/SaveButton.svelte";
    import * as Tabs from "$lib/components/ui/tabs";
    import { crudForm } from "$lib/utils";
    import { type SuperForm } from "sveltekit-superforms";
    import type { PageData } from "./$types.js";
    import { goto } from "$app/navigation";

    let { data } = $props();

    let tab: string = $state($page.url.searchParams.get("e") || "general");

    const form = crudForm(data.form, true) as SuperForm<
        PageData["form"]["data"]
    >;
    const { form: formData, enhance } = form;

    $effect(() => {
        let query = new URLSearchParams($page.url.searchParams.toString());
        query.set("e", tab);
        goto(`?${query.toString()}`);
    });
</script>

<div class="section-title">
    <h1>{$formData.title}</h1>
</div>

<form method="POST" use:enhance>
    <SaveButton {form} />

    <Tabs.Root bind:value={tab}>
        <Tabs.List>
            <Tabs.Trigger value="general">Scheda</Tabs.Trigger>
            <Tabs.Trigger value="ingredients">Ingredienti</Tabs.Trigger>
            <Tabs.Trigger value="steps">Procedimento</Tabs.Trigger>
            <Tabs.Trigger value="sources">Fonti</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="general">
            <RecipeSheet {form} recipeTypes={data.recipeTypes} />
        </Tabs.Content>
        <Tabs.Content value="ingredients">
            <RecipeIngredients {form} />
        </Tabs.Content>
        <Tabs.Content value="steps">
            <RecipeSteps {form} />
        </Tabs.Content>
        <Tabs.Content value="sources">
            <RecipeSources {form} />
        </Tabs.Content>
    </Tabs.Root>
</form>
