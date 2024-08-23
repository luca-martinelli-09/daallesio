<script lang="ts">
    import Button from "$lib/components/ui/button/button.svelte";
    import * as Popover from "$lib/components/ui/popover";
    import Toggle from "$lib/components/ui/toggle/toggle.svelte";
    import type { EditorOption } from "$lib/types";
    import { cn } from "$lib/utils";
    import { ChevronsUpDownIcon } from "lucide-svelte";

    const {
        editorOptions = $bindable(),
        class: className,
    }: { editorOptions: EditorOption[]; class: string } = $props();
</script>

<div
    class={cn(
        "flex flex-wrap gap-0.5 border border-input rounded-md p-1",
        className || "",
    )}
>
    {#each editorOptions as option (option.id)}
        {#if option.type === "toggle"}
            <Toggle
                size="sm"
                on:click={() => (option.click ? option.click() : null)}
                bind:pressed={option.active}
            >
                <svelte:component this={option.icon} class="w-4 h-4" />
            </Toggle>
        {:else if option.type === "multiple"}
            <Popover.Root portal={null}>
                <Popover.Trigger asChild let:builder>
                    <Button
                        builders={[builder]}
                        size="sm"
                        class="gap-1"
                        variant="ghost"
                    >
                        <svelte:component this={option.icon} class="w-4 h-4" />
                        <ChevronsUpDownIcon class="h-3 w-3" />
                    </Button>
                </Popover.Trigger>
                <Popover.Content class="p-1 w-auto">
                    <svelte:self
                        bind:editorOptions={option.options}
                        class="border-none p-0"
                    />
                </Popover.Content>
            </Popover.Root>
        {/if}
    {/each}
</div>
