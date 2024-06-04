<script lang="ts">
  import * as AlertDialog from "$lib/components/ui/alert-dialog";
  import type { DeleteModalData } from "$lib/types";

  let { data }: { data: DeleteModalData } = $props();
</script>

<AlertDialog.Root bind:open={data.open}>
  <AlertDialog.Content>
    <AlertDialog.Header>
      <AlertDialog.Title>Sei sicuro?</AlertDialog.Title>
      <AlertDialog.Description>Questo elemento verrà eliminato definitivamente</AlertDialog.Description>
    </AlertDialog.Header>
    <AlertDialog.Footer>
      <AlertDialog.Cancel>Annulla</AlertDialog.Cancel>
      <AlertDialog.Action>
        <form action="?/delete" method="post">
          <input type="hidden" name="id" value={data.id} />
          <button type="submit">Elimina</button>
        </form>
      </AlertDialog.Action>
    </AlertDialog.Footer>
  </AlertDialog.Content>
</AlertDialog.Root>
