<script lang="ts" generics="F extends Record<string, unknown>">
  import { buttonVariants } from "$lib/components/ui/button";
  import * as Command from "$lib/components/ui/command";
  import * as Form from "$lib/components/ui/form";
  import * as Popover from "$lib/components/ui/popover";
  import { cn } from "$lib/utils";
  import type { Recipe } from "@prisma/client";
  import { Check, ChevronsUpDown, X } from "lucide-svelte";
  import { tick } from "svelte";
  import type { FormPath, SuperForm } from "sveltekit-superforms";

  let {
    form,
    formData = $bindable(),
    name,
    label,
    placeholder,
    class: classname = "",
    onchange = () => {},
  }: {
    form: SuperForm<F>;
    formData: string | null | undefined;
    name: FormPath<F>;
    label: string;
    placeholder: string;
    class?: string;
    onchange?: (r: Recipe | null) => void;
  } = $props();

  let options: { label: string; value: string; recipe: Recipe }[] = $state([]);

  $effect(() => {
    fetch("/admin/api/recipes")
      .then((r) => r.json())
      .then((r) => {
        options = r.map((c: Recipe) => ({ label: c.title, value: c.id, recipe: c }));
      });
  });

  let open = $state(false);

  function closeAndFocusTrigger(triggerId: string) {
    open = false;
    tick().then(() => {
      document.getElementById(triggerId)?.focus();
    });
  }
</script>

<Form.Field {form} {name} class={classname}>
  <Popover.Root bind:open let:ids>
    <Form.Control let:attrs>
      <Form.Label>{label}</Form.Label>
      <div class="flex gap-2">
        <Popover.Trigger class={cn(buttonVariants({ variant: "outline" }), "w-full justify-between")} role="combobox" {...attrs}>
          {options.find((f) => f.value === formData)?.label ?? placeholder}
          <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Popover.Trigger>
        {#if formData}
          <button
            type="button"
            onclick={() => {
              formData = null;
              onchange(null);
            }}
          >
            <X class="h-4 w-4 opacity-50" />
          </button>
        {/if}
      </div>
      <input hidden value={formData} name={attrs.name} />
    </Form.Control>
    <Popover.Content class="p-0" align="start">
      <Command.Root>
        <Command.Input autofocus {placeholder} class="h-9" />
        <Command.List>
          {#each options as option}
            <Command.Item
              value={option.label}
              onSelect={() => {
                formData = option.value;
                onchange(option.recipe);
                closeAndFocusTrigger(ids.trigger);
              }}
            >
              {option.label}
              <Check class={cn("ml-auto h-4 w-4", option.value !== formData && "text-transparent")} />
            </Command.Item>
          {/each}
        </Command.List>
      </Command.Root>
    </Popover.Content>
  </Popover.Root>
  <Form.FieldErrors />
</Form.Field>
