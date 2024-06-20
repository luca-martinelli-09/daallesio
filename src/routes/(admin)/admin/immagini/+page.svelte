<script lang="ts">
  import LazyImage from "$lib/components/LazyImage.svelte";
  import DeleteModal from "$lib/components/admin/ui/DeleteModal.svelte";
  import DropDownActions from "$lib/components/admin/ui/DropDownActions.svelte";
  import Pagination from "$lib/components/admin/ui/Pagination.svelte";
  import SaveButton from "$lib/components/admin/ui/SaveButton.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import * as Card from "$lib/components/ui/card/index.js";
  import * as Dialog from "$lib/components/ui/dialog";
  import * as Form from "$lib/components/ui/form";
  import Input from "$lib/components/ui/input/input.svelte";
  import type { DeleteModalData } from "$lib/types.js";
  import { crudForm } from "$lib/utils";

  let { data } = $props();

  let { images, pagination } = $derived(data);

  let form = crudForm(data.form, true);
  let { form: formData, enhance } = form;

  let canvas: HTMLCanvasElement;
  let loaded = $state(false);

  let deleteModal = $state({
    open: false,
    id: null,
  } as DeleteModalData);

  function onFileChanged(
    e: Event & {
      currentTarget: EventTarget & HTMLInputElement;
    }
  ) {
    $formData.image = e.currentTarget.files?.item(0) as File;
    $formData.base64 = null;

    const ctx = canvas.getContext("2d");
    canvas.width = 5;
    canvas.height = 5;

    if (!ctx) {
      loaded = true;
      return;
    }

    const img = new Image();
    img.src = URL.createObjectURL($formData.image);

    img.onload = function () {
      ctx.drawImage(img, 0, 0, 5, 5);

      $formData.base64 = canvas.toDataURL("image/png");
      loaded = true;
    };
  }
</script>

<div class="save-title">
  <Dialog.Root>
    <Dialog.Trigger>
      <Button>Nuovo</Button>
    </Dialog.Trigger>
    <Dialog.Content>
      <Dialog.Header>
        <Dialog.Title>Nuova immagine</Dialog.Title>
        <Dialog.Description>Carica l'immagine</Dialog.Description>
      </Dialog.Header>
      <form method="post" action="?/create" use:enhance enctype="multipart/form-data">
        <Form.Field {form} name="image">
          <Form.Control let:attrs>
            <Form.Label>File</Form.Label>
            <Input {...attrs} type="file" accept="image/*" oninput={onFileChanged} />
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>

        <input type="hidden" name="base64" bind:value={$formData.base64} />

        <canvas class="hidden" bind:this={canvas}></canvas>

        {#if loaded}
          <SaveButton {form} modal={true} />
        {/if}
      </form>
    </Dialog.Content>
  </Dialog.Root>
</div>

<div class="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
  {#each images as image}
    <Card.Root>
      <Card.Header>
        <Card.Title>
          <div class="flex items-center justify-between">
            <span>{image.fileName}</span>
            <DropDownActions
              editHref="/admin/immagini/{image.id}"
              ondelete={() => {
                deleteModal = { open: true, id: image.id };
              }}
            />
          </div>
        </Card.Title>
      </Card.Header>
      <Card.Footer class="grid gap-4">
        <LazyImage {image} />
        <p class="text-opacity-80 text-sm">{image.caption}</p>
      </Card.Footer>
    </Card.Root>
  {/each}
</div>

{#if !images.length}
  <div>Nessuna immagine trovata</div>
{/if}

<Pagination {pagination} />

<DeleteModal data={deleteModal} />
