<script lang="ts">
    import DeleteModal from "$lib/components/admin/ui/DeleteModal.svelte";
    import DropDownActions from "$lib/components/admin/ui/DropDownActions.svelte";
    import Pagination from "$lib/components/admin/ui/Pagination.svelte";
    import SaveButton from "$lib/components/admin/ui/SaveButton.svelte";
    import Button from "$lib/components/ui/button/button.svelte";
    import * as Dialog from "$lib/components/ui/dialog";
    import * as Form from "$lib/components/ui/form";
    import Input from "$lib/components/ui/input/input.svelte";
    import * as Table from "$lib/components/ui/table";
    import type { DeleteModalData } from "$lib/types.js";
    import { crudForm } from "$lib/utils";
    import type { RecipeType } from "@prisma/client";
    import { LucideArrowUpDown, LucideGripVertical } from "lucide-svelte";
    import { dndzone, type DndEvent } from "svelte-dnd-action";
    import { toast } from "svelte-sonner";
    import { flip } from "svelte/animate";

    let { data } = $props();

    let { pagination } = $derived(data);
    let recipeTypes = $state(data.recipeTypes);

    let form = crudForm(data.form, true);
    let { form: formData, enhance } = form;

    let deleteModal = $state({
        open: false,
        id: null,
    } as DeleteModalData);

    const flipDurationMs = 300;

    function handleDndConsider(e: CustomEvent<DndEvent<RecipeType>>) {
        recipeTypes = e.detail.items;
    }

    async function handleDndFinalize(e: CustomEvent<DndEvent<RecipeType>>) {
        recipeTypes = e.detail.items;

        const requestData = new FormData();
        requestData.append(
            "data",
            JSON.stringify({
                data: recipeTypes.map((r) => ({ id: r.id })),
            }),
        );

        const response = await (
            await fetch("?/reorder", {
                method: "POST",
                headers: {
                    "x-sveltekit-action": "true",
                },
                body: requestData,
            })
        ).json();

        if (response.type === "success") {
            toast("Elementi riordinati correttamente");
        }
    }
</script>

<div class="save-title">
    <Dialog.Root>
        <Dialog.Trigger>
            <Button>Nuovo</Button>
        </Dialog.Trigger>
        <Dialog.Content>
            <Dialog.Header>
                <Dialog.Title>Nuovo tipo di ricetta</Dialog.Title>
                <Dialog.Description>
                    Inserisci le informazioni di base
                </Dialog.Description>
            </Dialog.Header>
            <form method="post" action="?/create" use:enhance>
                <Form.Field {form} name="title">
                    <Form.Control let:attrs>
                        <Form.Label>Titolo</Form.Label>
                        <Input {...attrs} bind:value={$formData.title} />
                    </Form.Control>
                    <Form.FieldErrors />
                </Form.Field>
                <Form.Field {form} name="slug">
                    <Form.Control let:attrs>
                        <Form.Label>Permalink</Form.Label>
                        <Input {...attrs} bind:value={$formData.slug} />
                    </Form.Control>
                    <Form.FieldErrors />
                </Form.Field>
                <SaveButton {form} modal={true} />
            </form>
        </Dialog.Content>
    </Dialog.Root>
</div>

<div class="justify-start">
    <Dialog.Root>
        <Dialog.Trigger>
            <Button variant="ghost">
                <LucideArrowUpDown class="h-4 w-4 me-2" />
                Riordina
            </Button>
        </Dialog.Trigger>
        <Dialog.Content>
            <Dialog.Header>
                <Dialog.Title>Riordina</Dialog.Title>
            </Dialog.Header>
            <form method="post" action="?/reorder" use:enhance>
                <div
                    use:dndzone={{
                        items: recipeTypes,
                        flipDurationMs,
                        dropTargetStyle: {},
                    }}
                    onconsider={handleDndConsider}
                    onfinalize={handleDndFinalize}
                    class="grid gap-2"
                >
                    {#each recipeTypes as recipeType (recipeType.id)}
                        <div animate:flip={{ duration: flipDurationMs }}>
                            <Button
                                variant="outline"
                                class="w-full justify-start gap-2"
                            >
                                <LucideGripVertical
                                    class="h-4 w-5 opacity-65"
                                />
                                {recipeType.title}
                            </Button>
                        </div>
                    {/each}
                </div>
            </form>
        </Dialog.Content>
    </Dialog.Root>
</div>

<div class="data-table">
    <Table.Root>
        <Table.Header>
            <Table.Row>
                <Table.Head>Titolo</Table.Head>
                <Table.Head>Titolo plurale</Table.Head>
                <Table.Head>Permalink</Table.Head>
                <Table.Head></Table.Head>
            </Table.Row>
        </Table.Header>
        <Table.Body>
            {#each recipeTypes as recipeType}
                <Table.Row>
                    <Table.Cell>{recipeType.title}</Table.Cell>
                    <Table.Cell>{recipeType.plural}</Table.Cell>
                    <Table.Cell>{recipeType.slug}</Table.Cell>
                    <Table.Cell>
                        <DropDownActions
                            editHref="/admin/tipi-ricette/{recipeType.id}"
                            ondelete={() => {
                                deleteModal = { open: true, id: recipeType.id };
                            }}
                        />
                    </Table.Cell>
                </Table.Row>
            {/each}
            {#if !recipeTypes.length}
                <Table.Row>
                    <Table.Cell colspan={3} class="no-data-cell">
                        Nessuna tipologia di ricetta trovata
                    </Table.Cell>
                </Table.Row>
            {/if}
        </Table.Body>
    </Table.Root>
</div>

<Pagination {pagination} />

<DeleteModal data={deleteModal} />
