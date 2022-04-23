<script>
  import { onMount } from "svelte";
  import gsap from "gsap";

  onMount(() => {
    const cursor = document.getElementById("cursor");

    const hoverables = document.getElementsByTagName("a");

    for (let i = 0; i < hoverables.length; i++) {
      hoverables[i].addEventListener("mouseenter", onMouseHover);
      hoverables[i].addEventListener("mouseleave", onMouseHoverOut);
    }

    function onMouseMove(e) {
      gsap.to(cursor, {
        duration: 0.4,
        x: e.clientX - 15,
        y: e.clientY - 15,
      });
    }

    function onMouseHover() {
      gsap.to(cursor, {
        duration: 0.3,
        scale: 4,
      });
    }
    function onMouseHoverOut() {
      gsap.to(cursor, {
        duration: 0.3,
        scale: 1,
      });
    }

    document.addEventListener("mousemove", onMouseMove);
  });
</script>

<svelte:head>
  <style>
    @media (min-width: 768px) {
      * {
        cursor: none;
      }
    }
  </style>
</svelte:head>

<div id="cursor" class="hidden md:block">
  <svg height="30" width="30">
    <circle cx="15" cy="15" r="12" stroke-width="0" />
  </svg>
</div>

<style>
  #cursor {
    position: fixed;
    z-index: 9999;
    mix-blend-mode: difference;
    pointer-events: none;
  }

  #cursor circle {
    fill: #fff;
  }
</style>
