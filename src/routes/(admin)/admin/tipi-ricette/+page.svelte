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

  let { data } = $props();

  let { recipeTypes, pagination } = $derived(data);

  let form = crudForm(data.form, true);
  let { form: formData, enhance } = form;

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
        <Dialog.Title>Nuovo tipo di ricetta</Dialog.Title>
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
          <Table.Cell colspan={3} class="no-data-cell">Nessuna tipologia di ricetta trovata</Table.Cell>
        </Table.Row>
      {/if}
    </Table.Body>
  </Table.Root>
</div>

<Pagination {pagination} />

<DeleteModal data={deleteModal} />
