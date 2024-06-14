<script lang="ts">
  import Menu from "lucide-svelte/icons/menu";

  import { page } from "$app/stores";
  import { env } from "$env/dynamic/public";
  import Logo from "$lib/components/Logo.svelte";
  import { Button } from "$lib/components/ui/button/index.js";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
  import * as Sheet from "$lib/components/ui/sheet/index.js";
  import { cn } from "$lib/utils.js";
  import { CookingPot, Map, SunMoon } from "lucide-svelte";
  import { resetMode, setMode } from "mode-watcher";

  let open = $state(false);

  const menuItems: { name: string; href: string; icon: typeof CookingPot }[] = [{ name: "Mappa", href: "/mappa", icon: Map }];
</script>

<header class="grid grid-cols-3 items-center justify-center py-5 px-3 print:hidden">
  <div>
    <Sheet.Root bind:open>
      <Sheet.Trigger asChild let:builder>
        <Button variant="ghost" size="icon" class="rounded-full" builders={[builder]}>
          <Menu class="h-5 w-5" />
          <span class="sr-only">Apri/chiudi il menù di navigazione</span>
        </Button>
      </Sheet.Trigger>
      <Sheet.Content side="left" class="flex flex-col">
        <nav class="grid gap-2 text-lg font-medium">
          <a href="/" class="flex items-center gap-2 text-lg font-semibold mb-5" onclick={() => (open = false)}>
            <Logo class="h-6 w-6 text-primary" />
            <span class="font-display font-bold">{env.PUBLIC_APP_NAME}</span>
          </a>
          {#each menuItems as menuItem}
            <a
              href={menuItem.href}
              onclick={() => (open = false)}
              class={cn(
                "mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground",
                $page.url.pathname.startsWith(menuItem.href) && "bg-primary/10 text-primary"
              )}
            >
              <svelte:component this={menuItem.icon} class="h-4 w-4" />
              <span>{menuItem.name}</span>
            </a>
          {/each}
        </nav>
      </Sheet.Content>
    </Sheet.Root>
  </div>

  <a href="/" class="flex items-center gap-3 text-3xl justify-center">
    <Logo class="h-10 w-10 text-primary" />
    <span class="font-display font-bold hidden md:block">Da Allesio</span>
  </a>

  <div class="flex items-center justify-end">
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild let:builder>
        <Button builders={[builder]} variant="ghost" size="icon" class="rounded-full">
          <SunMoon class="h-5 w-5" />
          <span class="sr-only">Cambia tema</span>
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="end">
        <DropdownMenu.Item on:click={() => setMode("light")}>Chiaro</DropdownMenu.Item>
        <DropdownMenu.Item on:click={() => setMode("dark")}>Scuro</DropdownMenu.Item>
        <DropdownMenu.Item on:click={() => resetMode()}>Automatico</DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  </div>
</header>
