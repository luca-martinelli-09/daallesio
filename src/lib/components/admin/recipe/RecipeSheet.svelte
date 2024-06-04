<script lang="ts">
  import CountrySelect from "$lib/components/admin/ui/CountrySelect.svelte";
  import EnumSelect from "$lib/components/admin/ui/EnumSelect.svelte";
  import TagsInput from "$lib/components/admin/ui/TagsInput.svelte";
  import { buttonVariants } from "$lib/components/ui/button";
  import { Calendar } from "$lib/components/ui/calendar";
  import * as Card from "$lib/components/ui/card";
  import * as Form from "$lib/components/ui/form";
  import Input from "$lib/components/ui/input/input.svelte";
  import * as Popover from "$lib/components/ui/popover";
  import * as Select from "$lib/components/ui/select";
  import Switch from "$lib/components/ui/switch/switch.svelte";
  import Textarea from "$lib/components/ui/textarea/textarea.svelte";
  import { AllergenEnum, ContinentEnum, CookModeEnum, DifficultyEnum, OriginAreaEnum } from "$lib/form/enums";
  import { cn, dateWithoutTime, getImageUrl } from "$lib/utils";
  import { DateFormatter, fromDate, getLocalTimeZone, today, type DateValue } from "@internationalized/date";
  import type { Image, RecipeType } from "@prisma/client";
  import type { Selected } from "bits-ui";
  import CalendarIcon from "lucide-svelte/icons/calendar";
  import type { SuperForm } from "sveltekit-superforms";
  import type { PageData } from "../../../../routes/(admin)/admin/ricette/[id]/$types";
  import Button from "$lib/components/ui/button/button.svelte";
  import ImageSelect from "../ui/ImageSelect.svelte";

  let { form, recipeTypes }: { form: SuperForm<PageData["form"]["data"]>; recipeTypes: RecipeType[] } = $props();
  let formData = form.form;

  let openImageSelect = $state(false);

  let recipeTypesOptions = recipeTypes.map(({ id, title }) => ({ value: id, label: title }) as Selected<string>);

  const df = new DateFormatter("it-IT", {
    dateStyle: "long",
  });

  function dateWithFallback(date?: Date) {
    return date ? fromDate(dateWithoutTime(date), getLocalTimeZone()) : today(getLocalTimeZone());
  }

  let value: DateValue | undefined = $state(dateWithFallback($formData.date));
  let placeholder: DateValue = $state(dateWithFallback($formData.date));

  $effect(() => {
    value = dateWithFallback($formData.date);
  });

  let selectedRecipeType: Selected<string> | undefined = $state($formData.typeId ? recipeTypesOptions.find(({ value }) => value === $formData.typeId) : undefined);
  function onRecipeTypeSelectedChange(v: Selected<string> | undefined) {
    $formData.typeId = v?.value || null;
  }
</script>

<div class="edit-card-container">
  <div class="main-cards">
    <Card.Root>
      <Card.Header>
        <Card.Title>Informazioni generali</Card.Title>
      </Card.Header>
      <Card.Content class="grid gap-4">
        <Form.Field {form} name="title">
          <Form.Control let:attrs>
            <Form.Label>Nome</Form.Label>
            <Input {...attrs} bind:value={$formData.title} />
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>

        <Form.Field {form} name="summary">
          <Form.Control let:attrs>
            <Form.Label>Riassunto</Form.Label>
            <Textarea {...attrs} bind:value={$formData.summary} />
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>

        <Form.Field {form} name="typeId">
          <Form.Control let:attrs>
            <Form.Label>Categoria</Form.Label>

            <Select.Root selected={selectedRecipeType} onSelectedChange={onRecipeTypeSelectedChange}>
              <Select.Trigger {...attrs}>
                <Select.Value placeholder="Seleziona una categoria" />
              </Select.Trigger>
              <Select.Content>
                {#each recipeTypesOptions as recipeType}
                  <Select.Item value={recipeType.value} label={recipeType.label} />
                {/each}
              </Select.Content>
            </Select.Root>
            <input name={attrs.name} hidden value={$formData.typeId} />
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>

        <Form.Field {form} name="units">
          <Form.Control let:attrs>
            <Form.Label>Quantità (persone)</Form.Label>
            <Input {...attrs} type="number" bind:value={$formData.units} />
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>
      </Card.Content>
    </Card.Root>

    <Card.Root>
      <Card.Header>
        <Card.Title>Informazioni nutrizionali</Card.Title>
      </Card.Header>
      <Card.Content class="grid gap-4">
        <Form.Field {form} name="vegetarian" class="flex items-center gap-4 space-y-0">
          <Form.Control let:attrs>
            <Form.Label>Ricetta vegetariana</Form.Label>
            <Switch {...attrs} includeInput bind:checked={$formData.vegetarian} />
          </Form.Control>
        </Form.Field>

        <Form.Field {form} name="vegan" class="flex items-center gap-4 space-y-0">
          <Form.Control let:attrs>
            <Form.Label>Ricetta vegana</Form.Label>
            <Switch {...attrs} includeInput bind:checked={$formData.vegan} />
          </Form.Control>
        </Form.Field>

        <EnumSelect
          {form}
          label="Allergeni"
          placeholder="Seleziona uno o più allergeni"
          name="allergens"
          enumOptions={AllergenEnum}
          bind:formData={$formData.allergens}
          multiple={true}
          nullable={false}
        />
      </Card.Content>
    </Card.Root>

    {#if $formData.originPlace}
      <Card.Root>
        <Card.Header>
          <Card.Title>Origine della ricetta</Card.Title>
        </Card.Header>
        <Card.Content class="grid lg:grid-cols-2 gap-4">
          <EnumSelect {form} label="Continente" placeholder="Selezione un continente" name="originPlace.continent" enumOptions={ContinentEnum} bind:formData={$formData.originPlace.continent} />
          <EnumSelect {form} label="Area geografica" placeholder="Seleziona una regione" name="originPlace.area" enumOptions={OriginAreaEnum} bind:formData={$formData.originPlace.area} />
          <CountrySelect class="lg:col-span-2" {form} label="Paese" placeholder="Seleziona un paese" name="originPlace.country" bind:formData={$formData.originPlace.country} />
          <Form.Field {form} name="originPlace.region">
            <Form.Control let:attrs>
              <Form.Label>Regione</Form.Label>
              <Input {...attrs} bind:value={$formData.originPlace.region} />
            </Form.Control>
            <Form.FieldErrors />
          </Form.Field>
          <Form.Field {form} name="originPlace.city">
            <Form.Control let:attrs>
              <Form.Label>Città</Form.Label>
              <Input {...attrs} bind:value={$formData.originPlace.city} />
            </Form.Control>
            <Form.FieldErrors />
          </Form.Field>

          <Form.Field {form} name="originPlace.lat">
            <Form.Control let:attrs>
              <Form.Label>Latitudine</Form.Label>
              <Input {...attrs} type="number" step="any" bind:value={$formData.originPlace.lat} />
            </Form.Control>
            <Form.FieldErrors />
          </Form.Field>

          <Form.Field {form} name="originPlace.lng">
            <Form.Control let:attrs>
              <Form.Label>Longitudine</Form.Label>
              <Input {...attrs} type="number" step="any" bind:value={$formData.originPlace.lng} />
            </Form.Control>
            <Form.FieldErrors />
          </Form.Field>
        </Card.Content>
      </Card.Root>
    {/if}

    {#if $formData.time}
      <Card.Root>
        <Card.Header>
          <Card.Title>Difficoltà e tempistiche</Card.Title>
        </Card.Header>
        <Card.Content class="grid gap-4">
          <EnumSelect {form} label="Difficoltà" placeholder="Seleziona una difficoltà" name="difficulty" enumOptions={DifficultyEnum} bind:formData={$formData.difficulty} nullable={false} />

          <EnumSelect {form} label="Modalità di cottura" placeholder="Seleziona una modalità" name="cookMode" enumOptions={CookModeEnum} bind:formData={$formData.cookMode} multiple={true} />

          <div class="grid lg:grid-cols-2 gap-4">
            <Form.Field {form} name="time.preparation">
              <Form.Control let:attrs>
                <Form.Label>Preparazione (minuti)</Form.Label>
                <Input {...attrs} type="number" bind:value={$formData.time.preparation} />
              </Form.Control>
              <Form.FieldErrors />
            </Form.Field>

            <Form.Field {form} name="time.rest">
              <Form.Control let:attrs>
                <Form.Label>Riposo (minuti)</Form.Label>
                <Input {...attrs} type="number" bind:value={$formData.time.rest} />
              </Form.Control>
              <Form.FieldErrors />
            </Form.Field>

            <Form.Field {form} name="time.leavening">
              <Form.Control let:attrs>
                <Form.Label>Lievitazione (minuti)</Form.Label>
                <Input {...attrs} type="number" bind:value={$formData.time.leavening} />
              </Form.Control>
              <Form.FieldErrors />
            </Form.Field>

            <Form.Field {form} name="time.cook">
              <Form.Control let:attrs>
                <Form.Label>Cottura (minuti)</Form.Label>
                <Input {...attrs} type="number" bind:value={$formData.time.cook} />
              </Form.Control>
              <Form.FieldErrors />
            </Form.Field>
          </div>
        </Card.Content>
      </Card.Root>
    {/if}
  </div>

  <div>
    <div class="side-cards">
      <Card.Root>
        <Card.Header>
          <Card.Title>SEO</Card.Title>
        </Card.Header>
        <Card.Content class="grid gap-4">
          <Form.Field {form} name="slug">
            <Form.Control let:attrs>
              <Form.Label>Permalink</Form.Label>
              <Input {...attrs} bind:value={$formData.slug} readonly />
            </Form.Control>
            <Form.FieldErrors />
          </Form.Field>
  
          <Form.Field {form} name="date" class="flex flex-col">
            <Form.Control let:attrs>
              <Form.Label>Data di pubblicazione</Form.Label>
              <Popover.Root>
                <Popover.Trigger {...attrs} class={cn(buttonVariants({ variant: "outline" }), "justify-start pl-4 text-left font-normal")}>
                  {value ? df.format(value.toDate(getLocalTimeZone())) : "Seleziona una data"}
                  <CalendarIcon class="ml-auto h-4 w-4 opacity-50" />
                </Popover.Trigger>
                <Popover.Content class="p-0" align="start">
                  <Calendar
                    {value}
                    bind:placeholder
                    locale="it-IT"
                    calendarLabel="Data di pubblicazione"
                    initialFocus
                    preventDeselect={true}
                    onValueChange={(v) => {
                      if (v) $formData.date = v.toDate(getLocalTimeZone());
                    }}
                  />
                </Popover.Content>
              </Popover.Root>
              <Form.FieldErrors />
              <input hidden value={$formData.date} name={attrs.name} />
            </Form.Control>
          </Form.Field>
  
          <Form.Field {form} name="draft" class="flex items-center gap-4 space-y-0">
            <Form.Control let:attrs>
              <Form.Label>Bozza</Form.Label>
              <Switch {...attrs} includeInput bind:checked={$formData.draft} />
            </Form.Control>
          </Form.Field>
  
          <TagsInput {form} bind:formData={$formData.tags} name="tags" />
        </Card.Content>
      </Card.Root>
  
      <Card.Root>
        <Card.Header>
          <Card.Title>Immagine</Card.Title>
        </Card.Header>
        <Card.Content class="grid gap-4">
          {#if $formData.image}
            <img src={getImageUrl($formData.image as Image)} alt={$formData.image?.alt}>
          {/if}

          <Button type="button" variant="secondary" onclick={() => (openImageSelect = true)}>Seleziona immagine</Button>
        </Card.Content>
      </Card.Root>
    </div>
  </div>
</div>

<ImageSelect bind:open={openImageSelect} onselected={(i:Image) => {
  $formData.image = i
  $formData.imageId = i.id
}} />
