<script>
  import Icon from "@iconify/svelte";

  export let recipe;
</script>

<a class="recipe transition-all duration-500 rounded-xl overflow-hidden w-full border-2 border-black" href="/ricette/{recipe.id}">
  <div class="image transition-all duration-500 w-full h-60 md:h-80 bg-center bg-cover" style="background-image: url({recipe.image})" />
  <div class="p-4 border-t-2 border-black flex flex-col gap-2">
    <span class="font-serif text-3xl">{recipe.title}</span>
    <span>12/04/2022</span>
    <div class="mt-3 flex gap-2 flex-wrap">
      {#each recipe.tags as tag}
        <span class="{tag.class} px-2 py-1 text-sm font-bold rounded-full inline-flex items-center justify-center border-2 border-black">
          {#if tag.icon}
            <Icon icon={tag.icon} class="mr-1" width={20} height={20} />
          {/if}
          {tag.name}
        </span>
      {/each}
    </div>
  </div>
</a>

<style>
  .recipe {
    box-shadow: 0px 0px black;
  }

  .recipe:hover {
    box-shadow: 0px 7px black;
    transform: translateY(-7px);
  }

  .recipe:active {
    box-shadow: 0px 0px black;
    transform: none;
  }
</style>
