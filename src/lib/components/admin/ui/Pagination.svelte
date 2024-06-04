<script lang="ts">
  import { goto } from "$app/navigation";
  import * as Pagination from "$lib/components/ui/pagination";
  import type { Pagination as PaginationType } from "$lib/types";
  import { ChevronLeft, ChevronRight } from "lucide-svelte";

  let { pagination, onchange }: { pagination: PaginationType; onchange?: (page: number) => void } = $props();
  let { count, perPage } = $derived(pagination);

  let currentPage = $state(pagination.page);

  function change(page: number) {
    if (onchange) {
      onchange(page);
      return;
    }

    goto("?page=" + page);
  }
</script>

{#if count}
  <Pagination.Root {count} {perPage} bind:page={currentPage} onPageChange={change} let:pages let:currentPage class="items-end">
    <Pagination.Content>
      <Pagination.Item>
        <Pagination.PrevButton>
          <ChevronLeft class="h-4 w-4" />
          <span class="hidden sm:block">Precedente</span>
        </Pagination.PrevButton>
      </Pagination.Item>
      {#each pages as page (page.key)}
        {#if page.type === "ellipsis"}
          <Pagination.Item>
            <Pagination.Ellipsis />
          </Pagination.Item>
        {:else}
          <Pagination.Item>
            <Pagination.Link {page} isActive={currentPage === page.value}>
              {page.value}
            </Pagination.Link>
          </Pagination.Item>
        {/if}
      {/each}
      <Pagination.Item>
        <Pagination.NextButton>
          <span class="hidden sm:block">Successivo</span>
          <ChevronRight class="h-4 w-4" />
        </Pagination.NextButton>
      </Pagination.Item>
    </Pagination.Content>
  </Pagination.Root>
{/if}
