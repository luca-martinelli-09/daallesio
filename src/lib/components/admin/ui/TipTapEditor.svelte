<script lang="ts">
    import "$lib/assets/prose.css";
    import Button from "$lib/components/ui/button/button.svelte";
    import * as Dialog from "$lib/components/ui/dialog";
    import Input from "$lib/components/ui/input/input.svelte";
    import Label from "$lib/components/ui/label/label.svelte";
    import * as Menubar from "$lib/components/ui/menubar";
    import Switch from "$lib/components/ui/switch/switch.svelte";
    import type { EditorOption } from "$lib/types";
    import { Editor } from "@tiptap/core";
    import Highlight from "@tiptap/extension-highlight";
    import Link from "@tiptap/extension-link";
    import Table from "@tiptap/extension-table";
    import TableCell from "@tiptap/extension-table-cell";
    import TableHeader from "@tiptap/extension-table-header";
    import TableRow from "@tiptap/extension-table-row";
    import TextAlign from "@tiptap/extension-text-align";
    import Underline from "@tiptap/extension-underline";
    import StarterKit from "@tiptap/starter-kit";
    import {
        AlignCenterIcon,
        AlignJustifyIcon,
        AlignLeftIcon,
        AlignRightIcon,
        BoldIcon,
        Columns2Icon,
        Heading2Icon,
        Heading3Icon,
        Heading4Icon,
        Heading5Icon,
        HeadingIcon,
        HighlighterIcon,
        ItalicIcon,
        LinkIcon,
        ListIcon,
        ListOrderedIcon,
        MinusIcon,
        RemoveFormattingIcon,
        Rows2Icon,
        StrikethroughIcon,
        TableIcon,
        TextQuoteIcon,
        UnderlineIcon,
    } from "lucide-svelte";
    import { untrack } from "svelte";
    import TipTapEditorToolbar from "./TipTapEditorToolbar.svelte";

    let {
        content = $bindable(),
        name,
    }: { content: string | null; name: string } = $props();

    let element: Element | undefined;
    let editor: Editor | undefined = $state();

    let tableModalStatus = $state({
        open: false,
        cols: 1,
        rows: 1,
        withHeader: true,
    });

    let editorOptions: EditorOption[] = $state([
        {
            id: "headings",
            type: "multiple",
            active: false,
            isActive: () => false,
            icon: HeadingIcon,
            options: [
                {
                    id: "headings-h2",
                    type: "toggle",
                    click: () =>
                        editor
                            ?.chain()
                            .focus()
                            .toggleHeading({ level: 2 })
                            .run(),
                    active: false,
                    isActive: () => editor?.isActive("heading", { level: 2 }),
                    icon: Heading2Icon,
                },
                {
                    id: "headings-h3",
                    type: "toggle",
                    click: () =>
                        editor
                            ?.chain()
                            .focus()
                            .toggleHeading({ level: 3 })
                            .run(),
                    active: false,
                    isActive: () => editor?.isActive("heading", { level: 3 }),
                    icon: Heading3Icon,
                },
                {
                    id: "headings-h4",
                    type: "toggle",
                    click: () =>
                        editor
                            ?.chain()
                            .focus()
                            .toggleHeading({ level: 4 })
                            .run(),
                    active: false,
                    isActive: () => editor?.isActive("heading", { level: 4 }),
                    icon: Heading4Icon,
                },
                {
                    id: "headings-h5",
                    type: "toggle",
                    click: () =>
                        editor
                            ?.chain()
                            .focus()
                            .toggleHeading({ level: 5 })
                            .run(),
                    active: false,
                    isActive: () => editor?.isActive("heading", { level: 5 }),
                    icon: Heading5Icon,
                },
            ],
        },
        {
            id: "bold",
            type: "toggle",
            click: () => editor?.chain().focus().toggleBold().run(),
            active: false,
            isActive: () => editor?.isActive("bold"),
            icon: BoldIcon,
        },
        {
            id: "italic",
            type: "toggle",
            click: () => editor?.chain().focus().toggleItalic().run(),
            active: false,
            isActive: () => editor?.isActive("italic"),
            icon: ItalicIcon,
        },
        {
            id: "underline",
            type: "toggle",
            click: () => editor?.chain().focus().toggleUnderline().run(),
            active: false,
            isActive: () => editor?.isActive("underline"),
            icon: UnderlineIcon,
        },
        {
            id: "strike",
            type: "toggle",
            click: () => editor?.chain().focus().toggleStrike().run(),
            active: false,
            isActive: () => editor?.isActive("strike"),
            icon: StrikethroughIcon,
        },
        {
            id: "bullet-list",
            type: "toggle",
            click: () => editor?.chain().focus().toggleBulletList().run(),
            active: false,
            isActive: () => editor?.isActive("bulletList"),
            icon: ListIcon,
        },
        {
            id: "ordered-list",
            type: "toggle",
            click: () => editor?.chain().focus().toggleOrderedList().run(),
            active: false,
            isActive: () => editor?.isActive("orderedList"),
            icon: ListOrderedIcon,
        },
        {
            id: "blockquote",
            type: "toggle",
            click: () => editor?.chain().focus().toggleBlockquote().run(),
            active: false,
            isActive: () => editor?.isActive("blockquote"),
            icon: TextQuoteIcon,
        },
        {
            id: "highlight",
            type: "toggle",
            click: () => editor?.chain().focus().toggleHighlight().run(),
            active: false,
            isActive: () => editor?.isActive("highlight"),
            icon: HighlighterIcon,
        },
        {
            id: "link",
            type: "toggle",
            click: () => setLink(),
            active: false,
            isActive: () => editor?.isActive("link"),
            icon: LinkIcon,
        },
        {
            id: "alignments",
            type: "multiple",
            active: false,
            useActiveIcon: true,
            isActive: () => false,
            icon: AlignJustifyIcon,
            options: [
                {
                    id: "align-left",
                    type: "toggle",
                    click: () =>
                        editor?.chain().focus().setTextAlign("left").run(),
                    active: false,
                    isActive: () => editor?.isActive({ textAlign: "left" }),
                    icon: AlignLeftIcon,
                },
                {
                    id: "align-center",
                    type: "toggle",
                    click: () =>
                        editor?.chain().focus().setTextAlign("center").run(),
                    active: false,
                    isActive: () => editor?.isActive({ textAlign: "center" }),
                    icon: AlignCenterIcon,
                },
                {
                    id: "align-right",
                    type: "toggle",
                    click: () =>
                        editor?.chain().focus().setTextAlign("right").run(),
                    active: false,
                    isActive: () => editor?.isActive({ textAlign: "right" }),
                    icon: AlignRightIcon,
                },
                {
                    id: "align-justify",
                    type: "toggle",
                    click: () =>
                        editor?.chain().focus().setTextAlign("justify").run(),
                    active: false,
                    isActive: () => editor?.isActive({ textAlign: "justify" }),
                    icon: AlignJustifyIcon,
                },
            ],
        },
        {
            id: "horizontal-rule",
            type: "toggle",
            click: () => editor?.chain().focus().setHorizontalRule().run(),
            active: false,
            isActive: () => false,
            icon: MinusIcon,
        },
        {
            id: "clear",
            type: "toggle",
            click: () =>
                editor?.chain().focus().unsetAllMarks().clearNodes().run(),
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

        editor
            .chain()
            .focus()
            .extendMarkRange("link")
            .setLink({ href: url })
            .run();
    }

    $effect(() => {
        editor = new Editor({
            element: element,
            extensions: [
                StarterKit,
                Underline,
                TextAlign.configure({
                    types: ["heading", "paragraph"],
                }),
                Link.configure({
                    openOnClick: false,
                    autolink: true,
                    linkOnPaste: true,
                }),
                Table.configure({
                    resizable: true,
                }),
                TableRow,
                TableHeader,
                TableCell,
                Highlight.configure({
                    multicolor: false,
                }),
            ],
            editorProps: {
                attributes: {
                    class: "prose dark:prose-invert max-w-full min-h-32 w-full rounded-md border border-input bg-background px-3 py-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                },
            },
            content: untrack(() => content),
            onTransaction: () => {
                updateActiveIcons(editorOptions);
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

    const updateActiveIcons = (options: EditorOption[]) => {
        options.forEach((option) => {
            option.active = option.isActive() || false;

            if (option.type === "color") {
                option.color = option.getColor() || "#000000";
            }

            if (option.type === "multiple" && option.options) {
                updateActiveIcons(option.options);
                if (option.useActiveIcon)
                    option.icon =
                        option.options.find((o) => o.active)?.icon ||
                        option.icon;
            }
        });
    };

    function addTable() {
        editor
            ?.chain()
            .focus()
            .insertTable({
                rows: tableModalStatus.rows,
                cols: tableModalStatus.cols,
                withHeaderRow: tableModalStatus.withHeader,
            })
            .run();

        tableModalStatus = {
            open: false,
            rows: 1,
            cols: 1,
            withHeader: true,
        };
    }
</script>

<div class="grid gap-3">
    {#if editor}
        <div>
            <Menubar.Root
                class="rounded-t-md rounded-b-none border-b-0 border-input"
            >
                <Menubar.Menu>
                    <Menubar.Trigger>Inserisci</Menubar.Trigger>
                    <Menubar.Content>
                        <Menubar.Item
                            class="menubar-item-icon"
                            on:click={() => (tableModalStatus.open = true)}
                        >
                            <TableIcon class="h-4 w-4" />
                            <span>Tabella</span>
                        </Menubar.Item>
                    </Menubar.Content>
                </Menubar.Menu>
                <Menubar.Menu>
                    <Menubar.Trigger>Tabella</Menubar.Trigger>
                    <Menubar.Content>
                        <Menubar.Item
                            class="menubar-item-icon"
                            on:click={() =>
                                editor?.chain().focus().mergeOrSplit().run()}
                        >
                            <span>Unisci/Dividi celle</span>
                        </Menubar.Item>
                        <Menubar.Sub>
                            <Menubar.SubTrigger class="menubar-item-icon">
                                <Columns2Icon class="h-4 w-4" />
                                <span>Colonna</span>
                            </Menubar.SubTrigger>
                            <Menubar.SubContent>
                                <Menubar.Item
                                    on:click={() =>
                                        editor
                                            ?.chain()
                                            .focus()
                                            .addColumnBefore()
                                            .run()}
                                >
                                    Inserisci colonna prima
                                </Menubar.Item>
                                <Menubar.Item
                                    on:click={() =>
                                        editor
                                            ?.chain()
                                            .focus()
                                            .addColumnAfter()
                                            .run()}
                                >
                                    Inserisci colonna dopo
                                </Menubar.Item>
                                <Menubar.Separator />
                                <Menubar.Item
                                    on:click={() =>
                                        editor
                                            ?.chain()
                                            .focus()
                                            .deleteColumn()
                                            .run()}
                                >
                                    Elimina colonna
                                </Menubar.Item>
                                <Menubar.Separator />
                                <Menubar.Item
                                    on:click={() =>
                                        editor
                                            ?.chain()
                                            .focus()
                                            .toggleHeaderColumn()
                                            .run()}
                                >
                                    Colonna intestata
                                </Menubar.Item>
                            </Menubar.SubContent>
                        </Menubar.Sub>
                        <Menubar.Sub>
                            <Menubar.SubTrigger class="menubar-item-icon">
                                <Rows2Icon class="h-4 w-4" />
                                <span>Riga</span>
                            </Menubar.SubTrigger>
                            <Menubar.SubContent>
                                <Menubar.Item
                                    on:click={() =>
                                        editor
                                            ?.chain()
                                            .focus()
                                            .addRowBefore()
                                            .run()}
                                >
                                    Inserisci riga prima
                                </Menubar.Item>
                                <Menubar.Item
                                    on:click={() =>
                                        editor
                                            ?.chain()
                                            .focus()
                                            .addRowAfter()
                                            .run()}
                                >
                                    Inserisci riga dopo
                                </Menubar.Item>
                                <Menubar.Separator />
                                <Menubar.Item
                                    on:click={() =>
                                        editor
                                            ?.chain()
                                            .focus()
                                            .deleteRow()
                                            .run()}
                                >
                                    Elimina riga
                                </Menubar.Item>
                                <Menubar.Separator />
                                <Menubar.Item
                                    on:click={() =>
                                        editor
                                            ?.chain()
                                            .focus()
                                            .toggleHeaderRow()
                                            .run()}
                                >
                                    Riga intestata
                                </Menubar.Item>
                            </Menubar.SubContent>
                        </Menubar.Sub>
                    </Menubar.Content>
                </Menubar.Menu>
            </Menubar.Root>

            <TipTapEditorToolbar
                bind:editorOptions
                class="border-t-0 pt-0 rounded-t-none"
            />
        </div>
    {/if}

    <div class="w-full" bind:this={element}></div>

    <input type="hidden" {name} value={content} />

    <Dialog.Root bind:open={tableModalStatus.open}>
        <Dialog.Content>
            <Dialog.Header>
                <Dialog.Title>Aggiungi tabella</Dialog.Title>
            </Dialog.Header>
            <div class="grid gap-3 grid-cols-2 mt-2">
                <div class="grid gap-2">
                    <Label for="cols">Colonne</Label>
                    <Input
                        type="number"
                        id="cols"
                        bind:value={tableModalStatus.cols}
                    />
                </div>
                <div class="grid gap-2">
                    <Label for="rows">Righe</Label>
                    <Input
                        type="number"
                        id="rows"
                        bind:value={tableModalStatus.rows}
                    />
                </div>

                <div class="flex items-center gap-2">
                    <Label for="rows">Intestazione</Label>
                    <Switch bind:checked={tableModalStatus.withHeader} />
                </div>
            </div>
            <Dialog.Footer>
                <Button on:click={addTable}>Aggiungi</Button>
            </Dialog.Footer>
        </Dialog.Content>
    </Dialog.Root>
</div>
