<script lang="ts">
  import { Toggle } from "$lib/components/ui/toggle";
  import { Editor } from "@tiptap/core";
  import Highlight from "@tiptap/extension-highlight";
  import Link from "@tiptap/extension-link";
  import Underline from "@tiptap/extension-underline";
  import StarterKit from "@tiptap/starter-kit";
  import {
    BoldIcon,
    Heading2Icon,
    Heading3Icon,
    Heading4Icon,
    HighlighterIcon,
    ItalicIcon,
    LinkIcon,
    ListIcon,
    ListOrderedIcon,
    RemoveFormattingIcon,
    TextQuoteIcon,
    UnderlineIcon,
  } from "lucide-svelte";
  import { untrack } from "svelte";

  let { content = $bindable(), name }: { content: string | null; name: string } = $props();

  let element: Element | undefined;
  let editor: Editor | undefined = $state();

  let editorOptions = $state([
    {
      id: "h2",
      click: () => editor?.chain().focus().toggleHeading({ level: 2 }).run(),
      active: false,
      isActive: () => editor?.isActive("heading", { level: 2 }),
      icon: Heading2Icon,
    },
    {
      id: "h3",
      click: () => editor?.chain().focus().toggleHeading({ level: 3 }).run(),
      active: false,
      isActive: () => editor?.isActive("heading", { level: 3 }),
      icon: Heading3Icon,
    },
    {
      id: "h4",
      click: () => editor?.chain().focus().toggleHeading({ level: 4 }).run(),
      active: false,
      isActive: () => editor?.isActive("heading", { level: 4 }),
      icon: Heading4Icon,
    },
    {
      id: "bold",
      click: () => editor?.chain().focus().toggleBold().run(),
      active: false,
      isActive: () => editor?.isActive("bold"),
      icon: BoldIcon,
    },
    {
      id: "italic",
      click: () => editor?.chain().focus().toggleItalic().run(),
      active: false,
      isActive: () => editor?.isActive("italic"),
      icon: ItalicIcon,
    },
    {
      id: "underline",
      click: () => editor?.chain().focus().toggleUnderline().run(),
      active: false,
      isActive: () => editor?.isActive("underline"),
      icon: UnderlineIcon,
    },
    {
      id: "bullet-list",
      click: () => editor?.chain().focus().toggleBulletList().run(),
      active: false,
      isActive: () => editor?.isActive("bulletList"),
      icon: ListIcon,
    },
    {
      id: "ordered-list",
      click: () => editor?.chain().focus().toggleOrderedList().run(),
      active: false,
      isActive: () => editor?.isActive("orderedList"),
      icon: ListOrderedIcon,
    },
    {
      id: "blockquote",
      click: () => editor?.chain().focus().toggleBlockquote().run(),
      active: false,
      isActive: () => editor?.isActive("blockquote"),
      icon: TextQuoteIcon,
    },
    {
      id: "highlight",
      click: () => editor?.chain().focus().toggleHighlight().run(),
      active: false,
      isActive: () => editor?.isActive("highlight"),
      icon: HighlighterIcon,
    },
    {
      id: "link",
      click: () => setLink(),
      active: false,
      isActive: () => editor?.isActive("link"),
      icon: LinkIcon,
    },
    {
      id: "clear",
      click: () => editor?.chain().focus().unsetAllMarks().clearNodes().run(),
      active: false,
      isActive: () => false,
      icon: RemoveFormattingIcon,
    },
  ]);

  function setLink() {
    if (!editor) return;

    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Inserisci il link", previousUrl);

    if (url === null) {
      return;
    }

    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();

      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }

  $effect(() => {
    editor = new Editor({
      element: element,
      extensions: [
        StarterKit,
        Underline,
        Link.configure({
          openOnClick: false,
          autolink: true,
          linkOnPaste: true,
        }),
        Highlight.configure({
          multicolor: false,
        }),
      ],
      editorProps: {
        attributes: {
          class:
            "prose dark:prose-invert max-w-full min-h-32 w-full rounded-md border border-input bg-background px-3 py-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        },
      },
      content: untrack(() => content),
      onTransaction: () => {
        editorOptions.forEach((option) => {
          option.active = option.isActive() || false;
        });
      },
      onUpdate: ({ editor }) => {
        content = editor.getHTML();
      },
    });

    return () => {
      if (editor) {
        editor.destroy();
      }
    };
  });
</script>

<div class="grid gap-3">
  {#if editor}
    <div class="flex flex-wrap gap-0.5">
      {#each editorOptions as option (option.id)}
        <Toggle size="sm" onclick={option.click} pressed={option.active}>
          <svelte:component this={option.icon} class="w-4 h-4" />
        </Toggle>
      {/each}
    </div>
  {/if}

  <div class="w-full" bind:this={element}></div>

  <input type="hidden" {name} value={content} />
</div>
