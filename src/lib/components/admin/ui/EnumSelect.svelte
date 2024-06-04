<script lang="ts" generics="F extends Record<string, unknown>, E extends string|number|symbol">
  import * as Form from "$lib/components/ui/form";
  import * as Select from "$lib/components/ui/select";
  import { createEnumSelect } from "$lib/form/enums";
  import type { Selected } from "bits-ui";
  import { X } from "lucide-svelte";
  import type { FormPath, SuperForm } from "sveltekit-superforms";

  let {
    form,
    formData = $bindable(),
    enumOptions,
    name,
    label,
    placeholder,
    multiple = false,
    nullable = true,
    onchange = ()=>{}
  }: {
    form: SuperForm<F>;
    formData: E[] | E | null | undefined;
    enumOptions: Record<E, string>;
    name: FormPath<F>;
    label: string;
    placeholder: string;
    multiple?: boolean;
    nullable?:boolean;
    onchange?:(e:E[]|E|null|undefined)=>void
  } = $props();

  function mapEnumMultiple(en: E[] | null | undefined, options: Record<E, string>) {
    return en ? en.map((c) => ({ label: options[c], value: c })) : [];
  }

  function mapEnum<T extends string | number | symbol>(en: T | null | undefined, options: Record<T, string>) {
    return en ? { label: options[en], value: en } : undefined;
  }

  let selected: { label: string; value: E } | { label: string; value: E }[] | undefined = $state(
    multiple ? mapEnumMultiple(formData as E[] | null | undefined, enumOptions) : mapEnum(formData as E | undefined, enumOptions)
  );

  function onSelectedChange(v: Selected<E> | Selected<E>[] | undefined | null) {
    if (!v) {
      formData = multiple ? [] : null;
    }else{
      if (multiple) {
        v = v as Selected<E>[];
  
        formData = v.map((c) => c.value);
      } else {
        v = v as Selected<E>;
  
        formData = v.value;
      }
    }

    onchange(formData);
  }

  function asArray(f: any) {
    return f as E[];
  }
</script>

<Form.Field {form} {name}>
  <Form.Control let:attrs>
    <Form.Label>{label}</Form.Label>

    <div class="flex gap-2">
      <Select.Root {multiple} bind:selected {onSelectedChange}>
        <Select.Trigger {...attrs}>
          <Select.Value {placeholder} />
        </Select.Trigger>
        <Select.Content>
          {#each createEnumSelect(enumOptions) as option}
            <Select.Item value={option.value} label={option.label}>
              {option.label}
            </Select.Item>
          {/each}
        </Select.Content>
      </Select.Root>
      {#if selected && nullable}
        <button
          type="button"
          onclick={() => {
            selected = null as unknown as undefined;
            onSelectedChange(null);
          }}><X class="h-4 w-4 opacity-50" /></button
        >
      {/if}
    </div>
    {#if !multiple}
      <input hidden bind:value={formData} name={attrs.name} />
    {:else}
      {#each asArray(formData) as f}
        <input name={attrs.name} hidden value={f} />
      {/each}
    {/if}
  </Form.Control>
  <Form.FieldErrors />
</Form.Field>
