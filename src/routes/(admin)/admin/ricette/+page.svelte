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
  import { DateFormatter } from "@internationalized/date";

  let { data } = $props();

  let { recipes, pagination } = $derived(data);

  let form = crudForm(data.form, true);
  let { form: formData, enhance } = form;

  const df = new DateFormatter("it-IT", {
    dateStyle: "long",
  });

  let deleteModal = $state({
    open: false,
    id: null,
  } as DeleteModalData);
</script>

<div class="save-title">
  <Dialog.Root>
    <Dialog.Trigger>
      <Button>Nuovo</Button>
    </Dialog.Trigger>
    <Dialog.Content>
      <Dialog.Header>
        <Dialog.Title>Nuova ricetta</Dialog.Title>
        <Dialog.Description>Inserisci le informazioni di base</Dialog.Description>
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

<div class="data-table">
  <Table.Root>
    <Table.Header>
      <Table.Row>
        <Table.Head>Titolo</Table.Head>
        <Table.Head>Permalink</Table.Head>
        <Table.Head>Stato</Table.Head>
        <Table.Head class="hidden lg:table-cell">Data di pubblicazione</Table.Head>
        <Table.Head class="w-0"></Table.Head>
      </Table.Row>
    </Table.Header>
    <Table.Body>
      {#each recipes as recipe}
        <Table.Row>
          <Table.Cell>{recipe.title}</Table.Cell>
          <Table.Cell>{recipe.slug}</Table.Cell>
          <Table.Cell>{recipe.draft ? "Pubblicato" : "Bozza"}</Table.Cell>
          <Table.Cell class="hidden lg:table-cell">{df.format(recipe.date)}</Table.Cell>
          <Table.Cell>
            <DropDownActions
              editHref="/admin/ricette/{recipe.id}"
              ondelete={() => {
                deleteModal = { open: true, id: recipe.id };
              }}
            />
          </Table.Cell>
        </Table.Row>
      {/each}
      {#if !recipes.length}
        <Table.Row>
          <Table.Cell colspan={5} class="no-data-cell">Nessuna ricetta trovata</Table.Cell>
        </Table.Row>
      {/if}
    </Table.Body>
  </Table.Root>
</div>

<Pagination {pagination} />

<DeleteModal data={deleteModal} />
