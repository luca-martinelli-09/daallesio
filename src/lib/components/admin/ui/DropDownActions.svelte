<script lang="ts">
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
  import { Ellipsis } from "lucide-svelte";
  import Button from "$lib/components/ui/button/button.svelte";

  let { editHref, ondelete }: { editHref: string; ondelete: () => void } = $props();
</script>

<div class="text-end">
  <DropdownMenu.Root>
    <DropdownMenu.Trigger asChild let:builder>
      <Button variant="ghost" builders={[builder]} size="icon" class="relative h-8 w-8 p-0">
        <span class="sr-only">Open menu</span>
        <Ellipsis class="h-4 w-4" />
      </Button>
    </DropdownMenu.Trigger>
    <DropdownMenu.Content align="end">
      <DropdownMenu.Group>
        <DropdownMenu.Item href={editHref}>Modifica</DropdownMenu.Item>
        <DropdownMenu.Item on:click={() => ondelete()}>Elimina</DropdownMenu.Item>
      </DropdownMenu.Group>
    </DropdownMenu.Content>
  </DropdownMenu.Root>
</div>
