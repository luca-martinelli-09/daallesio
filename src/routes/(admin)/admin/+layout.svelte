<script lang="ts">
  import CircleUser from "lucide-svelte/icons/circle-user";
  import Menu from "lucide-svelte/icons/menu";

  import { page } from "$app/stores";
  import { env } from "$env/dynamic/public";
  import Logo from "$lib/components/Logo.svelte";
  import { Button } from "$lib/components/ui/button/index.js";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
  import * as Sheet from "$lib/components/ui/sheet/index.js";
  import { cn } from "$lib/utils.js";
  import { CookingPot, Home, Image, ShoppingBasket, Tag } from "lucide-svelte";
  import { resetMode, setMode } from "mode-watcher";

  const { data, children } = $props();
  const { user } = data;

  let open = $state(false);

  const menuItems = [
    { name: "Ricette", href: "/admin/ricette", icon: CookingPot },
    { name: "Ingredienti", href: "/admin/ingredienti", icon: ShoppingBasket },
    { name: "Immagini", href: "/admin/immagini", icon: Image },
    { name: "Tipi di ricette", href: "/admin/tipi-ricette", icon: Tag },
  ];
</script>

<div class="flex min-h-screen w-full">
  <div class="hidden border-r bg-muted/40 md:block">
    <div class="flex h-full max-h-screen flex-col gap-2">
      <div class="flex items-center border-b px-4 lg:px-6 py-5">
        <a href="/admin" class="flex items-center gap-2 font-semibold">
          <Logo class="h-6 w-6 text-primary" />
          <span class="">{env.PUBLIC_APP_NAME}</span>
        </a>
      </div>
      <div class="flex-1">
        <nav class="grid items-start px-2 text-sm font-medium lg:px-4">
          {#each menuItems as menuItem}
            <a
              href={menuItem.href}
              class={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary md:pr-20",
                ($page.url.pathname.startsWith(menuItem.href)) && "bg-primary/10 text-primary"
              )}
            >
              <svelte:component this={menuItem.icon} class="h-4 w-4" />
              <span>{menuItem.name}</span>
            </a>
          {/each}
        </nav>
      </div>
    </div>
  </div>
  <div class="flex-1 flex flex-col">
    <header class="flex items-center gap-4 border-b bg-muted/40 px-4 lg:px-6 py-3">
      <Sheet.Root bind:open>
        <Sheet.Trigger asChild let:builder>
          <Button variant="outline" size="icon" class="shrink-0 md:hidden" builders={[builder]}>
            <Menu class="h-5 w-5" />
            <span class="sr-only">Toggle navigation menu</span>
          </Button>
        </Sheet.Trigger>
        <Sheet.Content side="left" class="flex flex-col">
          <nav class="grid gap-2 text-lg font-medium">
            <a href="/admin" class="flex items-center gap-2 text-lg font-semibold mb-5" onclick={() => open = false}>
              <Logo class="h-6 w-6 text-primary" />
              <span class="">{env.PUBLIC_APP_NAME}</span>
            </a>
            {#each menuItems as menuItem}
              <a
                href={menuItem.href}
                onclick={() => open = false}
                class={cn(
                  "mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground",
                  ($page.url.pathname.startsWith(menuItem.href)) && "bg-primary/10 text-primary"
                )}
              >
                <svelte:component this={menuItem.icon} class="h-4 w-4" />
                <span>{menuItem.name}</span>
              </a>
            {/each}
          </nav>
        </Sheet.Content>
      </Sheet.Root>
      <div class="w-full flex-1"></div>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild let:builder>
          <Button builders={[builder]} variant="secondary" size="icon" class="rounded-full">
            <CircleUser class="h-5 w-5" />
            <span class="sr-only">Toggle user menu</span>
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content align="end">
          <DropdownMenu.Label>{user.name}</DropdownMenu.Label>
          <DropdownMenu.Separator />
          <DropdownMenu.Item href="/admin/utente">Account</DropdownMenu.Item>
          <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger>Tema</DropdownMenu.SubTrigger>
            <DropdownMenu.SubContent>
              <DropdownMenu.Item on:click={() => setMode("light")}>Chiaro</DropdownMenu.Item>
              <DropdownMenu.Item on:click={() => setMode("dark")}>Scuro</DropdownMenu.Item>
              <DropdownMenu.Item on:click={() => resetMode()}>Automatico</DropdownMenu.Item>
            </DropdownMenu.SubContent>
          </DropdownMenu.Sub>
          <DropdownMenu.Separator />
          <DropdownMenu.Item>
            <form action="/logout" method="post" class="w-full"><button class="text-left w-full">Esci</button></form>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </header>
    <main class="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 max-w-screen-2xl mx-auto w-full mb-32">
      {@render children()}
    </main>
  </div>
</div>
