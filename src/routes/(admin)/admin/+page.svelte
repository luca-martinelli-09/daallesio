<script lang="ts">
  import Button from "$lib/components/ui/button/button.svelte";
  import * as Card from "$lib/components/ui/card";

  const { data } = $props();
  const { user } = data;
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
      <Button href="/admin/ricette">Aggiungi ricetta</Button>
    </Card.Footer>
  </Card.Root>

  <Card.Root>
    <Card.Header>
      <Card.Title>Ingredienti</Card.Title>
    </Card.Header>
    <Card.Content></Card.Content>
    <Card.Footer>
      <Button href="/admin/ingredienti">Aggiungi ingrediente</Button>
    </Card.Footer>
  </Card.Root>
</div>
