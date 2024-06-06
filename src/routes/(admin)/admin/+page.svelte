<script lang="ts">
  import LazyImage from "$lib/components/LazyImage.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import * as Card from "$lib/components/ui/card";
  import { DateFormatter } from "@internationalized/date";
  import { type Image } from "@prisma/client";
  import { BookCheckIcon, BookDashedIcon } from "lucide-svelte";

  const { data } = $props();
  const { user, lastRecipes } = data;

  const df = new DateFormatter("it-IT", {
    dateStyle: "long",
  });
</script>

<div class="section-title">
  <h1>Benvenuto,</h1>
  <h2>{user.name}</h2>
</div>

<div class="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
  <Card.Root>
    <Card.Header>
      <Card.Title>Ricette</Card.Title>
    </Card.Header>
    <Card.Content></Card.Content>
    <Card.Footer>
      <Button href="/admin/ricette">Vai alle ricette</Button>
    </Card.Footer>
  </Card.Root>

  <Card.Root>
    <Card.Header>
      <Card.Title>Ingredienti</Card.Title>
    </Card.Header>
    <Card.Content></Card.Content>
    <Card.Footer>
      <Button href="/admin/ingredienti">Vai agli ingredienti</Button>
    </Card.Footer>
  </Card.Root>
</div>

<h2 class="text-xl font-bold mt-5">Ultime ricette</h2>

<div class="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
  {#each lastRecipes as recipe}
    <Card.Root>
      <Card.Header>
        <div class="flex justify-between">
          <div>
            <Card.Title>{recipe.title}</Card.Title>
            <Card.Description>{df.format(recipe.date)}</Card.Description>
          </div>
          <span title={recipe.draft ? "Bozza" : "Pubblicata"} class={recipe.draft ? "text-red-500" : "text-green-500"}>
            {#if recipe.draft}
              <BookDashedIcon class="h-4 w-4" />
            {:else}
              <BookCheckIcon class="h-4 w-4" />
            {/if}
          </span>
        </div>
      </Card.Header>
      <Card.Content>
        <LazyImage class="rounded-md" image={recipe.image as Image} />
      </Card.Content>
      <Card.Footer>
        <Button variant="secondary" class="w-full" href="/admin/ricette/{recipe.id}">Modifica</Button>
      </Card.Footer>
    </Card.Root>
  {/each}
</div>
