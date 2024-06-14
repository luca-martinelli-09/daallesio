<script lang="ts">
  import "leaflet-gesture-handling/dist/leaflet-gesture-handling.css";
  import "leaflet.markercluster/dist/MarkerCluster.Default.css";
  import "leaflet.markercluster/dist/MarkerCluster.css";
  import "leaflet/dist/leaflet.css";

  import * as Drawer from "$lib/components/ui/drawer";

  import LazyImage from "$lib/components/LazyImage.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import type { Image } from "@prisma/client";
  import type { Map, MapOptions } from "leaflet";

  const { data } = $props();
  const { recipes } = $derived(data);

  let mapElement: HTMLDivElement;
  let mapInstance: Map;

  let drawerState = $state({
    open: false,
    recipe: null as (typeof recipes)[0] | null,
  });

  async function loadMap() {
    const L = await import("leaflet");
    // const { GestureHandling } = await import("leaflet-gesture-handling");
    // L.Map.addInitHook("addHandler", "gestureHandling", GestureHandling);

    const L1:any = await import("leaflet.markercluster");

    const markerIcon = L.icon({ iconUrl: "/img/map-marker.png", iconSize: [32, 37], iconAnchor: [16, 37] });

    mapInstance = L.map(mapElement, {
      gestureHandling: true,
    } as MapOptions).setView(
      {
        lat: 41.26,
        lng: 10.07,
      },
      4
    );

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>',
      maxZoom: 18,
    }).addTo(mapInstance);

    const markers = new L1.MarkerClusterGroup();
    for (let recipe of recipes) {
      if (recipe.originPlace.lat && recipe.originPlace.lng) {
        const mark = L.marker([recipe.originPlace.lat, recipe.originPlace.lng], { icon: markerIcon });

        mark.addEventListener("click", () => {
          drawerState.open = true;
          drawerState.recipe = recipe;
        });

        markers.addLayer(mark);
      }
    }
    mapInstance.addLayer(markers);
  }

  $effect(() => {
    loadMap();
  });
</script>

<div bind:this={mapElement} class="h-screen -z-0"></div>

<Drawer.Root bind:open={drawerState.open}>
  <Drawer.Content class="max-w-screen-lg mx-auto overflow-hidden">
    {#if drawerState.recipe}
    <LazyImage class="aspect-video" image={drawerState.recipe.image as Image} />
    <Drawer.Header class="flex flex-col gap-5">
        <Drawer.Title class="text-5xl font-bold font-display">{drawerState.recipe.title}</Drawer.Title>
        <Drawer.Description>{drawerState.recipe.summary}</Drawer.Description>
      </Drawer.Header>
      <Drawer.Footer>
        <div class="grid grid-cols-3 w-full gap-2">
          <Button class="col-span-1" variant="ghost" on:click={() => (drawerState.open = false)}>Chiudi</Button>
          <Button class="col-span-2" href="/ricette/{drawerState.recipe.slug}">Vai alla ricetta</Button>
        </div>
      </Drawer.Footer>
    {/if}
  </Drawer.Content>
</Drawer.Root>
