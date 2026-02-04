import { EditorProvider, FloatingMenu, BubbleMenu, useEditor, useCurrentEditor, Editor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Link from "@tiptap/extension-link"
import { Color } from "@tiptap/extension-color"
import ListItem from "@tiptap/extension-list-item"
import TextStyle from "@tiptap/extension-text-style"
import Underline from "@tiptap/extension-underline"
import Image from "@tiptap/extension-image"
import { PropsWithChildren, useEffect, useRef, useState } from "react"
import React from "react"
import Placeholder from "@tiptap/extension-placeholder"
import { CLOUD_NAME, UPLOAD_PRESET, encodeImageFileAsURL, generateUniqueUploadId } from "../app/utils"
import axios from "axios"
import { addListNodes } from "@tiptap/pm/schema-list"

export default function TipTap({
  title,
  setTitle,
  note,
  setNote,
}: PropsWithChildren<{ title: string; setTitle(_: string): void; note: string; setNote(_: string): void }>) {
  const extensions = [
    Underline.configure({
      HTMLAttributes: {
        class: "underline",
      },
    }),
    Color.configure({ types: [TextStyle.name, ListItem.name] }),
    TextStyle.configure({ HTMLAttributes: [ListItem.name] }),
    StarterKit.configure({
      bulletList: {
        keepMarks: true,
        keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
      },
      orderedList: {
        keepMarks: true,
        keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
      },
    }),
    Link.configure({
      openOnClick: false,
      autolink: true,
      validate: (href) => /^https?:\/\//.test(href),
    }),
    Placeholder.configure({
      placeholder: "Start writing...",
    }),
    Image.extend({
      addAttributes() {
        return {
          src: {
            default: null,
          },
          alt: {
            default: null,
          },
          title: {
            default: null,
          },
          class: {
            default: "ProseMirror-image",
          },
          "data-base64": {
            default: null,
          },
          "data-label": {
            default: null,
          },
        }
      },
    }),
  ]

  const editor = useEditor({
    extensions,
    content: note,
  })

  function autoGrow(element: HTMLElement) {
    element.style.height = "5px"
    element.style.height = element.scrollHeight + "px"
  }

  return (
    <div data-lenis-prevent="true" className="TipTap__wrapper">
      {/* <input type="text" placeholder="Title" value={title} onInput={(e) => setTitle(e.currentTarget.value)} /> */}
      <textarea
        name="Text1"
        placeholder="Title"
        value={title}
        onInput={(e) => {
          autoGrow(e.currentTarget)
          setTitle(e.currentTarget.value)
        }}
      ></textarea>
      <EditorProvider
        extensions={extensions}
        content={note}
        onUpdate={(editor) => {
          setNote(JSON.parse(JSON.stringify(editor.editor.getHTML())))
        }}
        slotBefore={<MenuBar />}
        slotAfter
      >
        <FloatingMenu editor={editor}>This is the floating menu</FloatingMenu>
        <BubbleMenu editor={editor}>This is the bubble menu</BubbleMenu>
      </EditorProvider>
    </div>
  )
}

const MenuBar = ({ active = false, dontClear = true }) => {
  const { editor } = useCurrentEditor()
  const img = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (dontClear) return
    if (editor && !editor.isDestroyed) editor?.commands.clearContent()
  }, [active, dontClear])

  if (!editor) {
    return null
  }

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href
    const url = window.prompt("URL", previousUrl)

    // cancelled
    if (url == null) {
      editor.chain().focus().unsetColor().run()
      editor.chain().focus().unsetUnderline().run()
      editor.chain().focus().extendMarkRange("link").unsetLink().run()

      return
    }

    // empty
    if (url === "") {
      editor.chain().focus().unsetColor().run()
      editor.chain().focus().unsetUnderline().run()
      editor.chain().focus().extendMarkRange("link").unsetLink().run()

      return
    }

    // update link
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run()
    editor.chain().focus().setColor("#0c3dde").run()
    editor.chain().focus().toggleUnderline().run()
  }

  const uploadImage = async (file: File) => {
    await uploadFile(file)
    editor.chain().focus().run()
  }

  const uploadFile = async ($file: File) => {
    if (!$file) {
      console.error("Please select a file.")
      return
    }

    const uniqueUploadId = generateUniqueUploadId()
    const chunkSize = 5 * 1024 * 1024
    const totalChunks = Math.ceil($file.size / chunkSize)
    let currentChunk = 0

    const uploadChunk = async (start: number, end: number, file: File) => {
      const formData = new FormData()
      formData.append("file", file.slice(start, end))
      formData.append("cloud_name", CLOUD_NAME)
      formData.append("upload_preset", UPLOAD_PRESET)
      const contentRange = `bytes ${start}-${end - 1}/${file.size}`

      console.log(`Uploading chunk for uniqueUploadId: ${uniqueUploadId}; start: ${start}, end: ${end - 1}`)

      try {
        const response = await axios.post(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`, formData, {
          headers: {
            "X-Unique-Upload-Id": uniqueUploadId,
            "Content-Range": contentRange,
          },
        })

        if (response.statusText !== "OK") {
          throw new Error("Chunk upload failed.")
        }

        currentChunk++

        if (currentChunk < totalChunks) {
          const nextStart = currentChunk * chunkSize
          const nextEnd = Math.min(nextStart + chunkSize, file.size)
          uploadChunk(nextStart, nextEnd, file)
        } else {
          const fetchResponse = await response.data
          editor
            .chain()
            .focus()
            .setImage({
              src: fetchResponse.url,
            })
            .run()
        }
      } catch (error) {
        console.error("Error uploading chunk:", error)
      }
    }

    const start = 0
    const end = Math.min(chunkSize, $file.size)
    await uploadChunk(start, end, $file)
  }

  return (
    <>
      {!loading && <article className="TipTapLoading"></article>}
      <article className="TipTapTools">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={editor.isActive("bold") ? "is-active" : ""}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M5 6.75C5 4.77201 6.55079 3 8.66667 3H12.8333C15.8697 3 18.1667 5.55551 18.1667 8.5C18.1667 9.58312 17.8559 10.6136 17.3118 11.4836C18.3611 12.5023 19 13.9471 19 15.5C19 18.4445 16.703 21 13.6667 21H8.66667C6.55079 21 5 19.228 5 17.25V6.75ZM12.8333 10C13.4789 10 14.1667 9.4215 14.1667 8.5C14.1667 7.5785 13.4789 7 12.8333 7H9V10H12.8333ZM9 14H13.6667C14.3122 14 15 14.5785 15 15.5C15 16.4215 14.3122 17 13.6667 17H9V14Z"
              fill="black"
            />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={editor.isActive("italic") ? "is-active" : ""}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M9 4C9 3.44772 9.44772 3 10 3H19C19.5523 3 20 3.44772 20 4C20 4.55228 19.5523 5 19 5H15.2352L10.8602 19H14C14.5523 19 15 19.4477 15 20C15 20.5523 14.5523 21 14 21H5C4.44772 21 4 20.5523 4 20C4 19.4477 4.44772 19 5 19H8.76481L13.1398 5H10C9.44772 5 9 4.55228 9 4Z"
              fill="black"
            />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          disabled={!editor.can().chain().focus().toggleUnderline().run()}
          className={editor.isActive("underline") ? "is-active" : ""}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M7 4C7 3.44772 6.55228 3 6 3C5.44772 3 5 3.44772 5 4V12C5 15.866 8.13401 19 12 19C15.866 19 19 15.866 19 12V4C19 3.44772 18.5523 3 18 3C17.4477 3 17 3.44772 17 4V12C17 14.7614 14.7614 17 12 17C9.23858 17 7 14.7614 7 12V4Z"
              fill="black"
            />
            <path
              d="M6 20C5.44772 20 5 20.4477 5 21C5 21.5523 5.44772 22 6 22H18C18.5523 22 19 21.5523 19 21C19 20.4477 18.5523 20 18 20H6Z"
              fill="black"
            />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive("bulletList") ? "is-active" : ""}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M6 4C4.34315 4 3 5.34315 3 7C3 8.65685 4.34315 10 6 10C7.65685 10 9 8.65685 9 7C9 5.34315 7.65685 4 6 4Z"
              fill="black"
            />
            <path
              d="M13 6C12.4477 6 12 6.44772 12 7C12 7.55228 12.4477 8 13 8H20C20.5523 8 21 7.55228 21 7C21 6.44772 20.5523 6 20 6H13Z"
              fill="black"
            />
            <path
              d="M6 14C4.34315 14 3 15.3431 3 17C3 18.6569 4.34315 20 6 20C7.65685 20 9 18.6569 9 17C9 15.3431 7.65685 14 6 14Z"
              fill="black"
            />
            <path
              d="M13 16C12.4477 16 12 16.4477 12 17C12 17.5523 12.4477 18 13 18H20C20.5523 18 21 17.5523 21 17C21 16.4477 20.5523 16 20 16H13Z"
              fill="black"
            />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive("orderedList") ? "is-active" : ""}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M6.52595 3.64935C6.82077 3.83156 7.00022 4.15342 7.00022 4.5V9.5C7.00022 10.0523 6.5525 10.5 6.00022 10.5C5.44793 10.5 5.00022 10.0523 5.00022 9.5V6.11804L4.44743 6.39443C3.95345 6.64142 3.35278 6.44119 3.10579 5.94721C2.8588 5.45324 3.05903 4.85256 3.55301 4.60557L5.55301 3.60557C5.86299 3.45058 6.23113 3.46714 6.52595 3.64935ZM12.0002 6C11.448 6 11.0002 6.44772 11.0002 7C11.0002 7.55228 11.448 8 12.0002 8H20.0002C20.5525 8 21.0002 7.55228 21.0002 7C21.0002 6.44772 20.5525 6 20.0002 6H12.0002ZM12.0002 16C11.448 16 11.0002 16.4477 11.0002 17C11.0002 17.5523 11.448 18 12.0002 18H20.0002C20.5525 18 21.0002 17.5523 21.0002 17C21.0002 16.4477 20.5525 16 20.0002 16H12.0002Z"
              fill="black"
            />
            <path
              d="M4.85955 15.7929L4.85843 15.7938L4.85712 15.7948L4.85514 15.7963L4.85413 15.7971C4.41665 16.1286 3.79286 16.0455 3.45762 15.6097C3.12089 15.172 3.20278 14.5441 3.64053 14.2074L3.69876 14.1645C3.72848 14.1433 3.76848 14.1156 3.81757 14.0837C3.91499 14.0203 4.05212 13.9375 4.21887 13.8546C4.53672 13.6965 5.03718 13.5 5.61126 13.5C6.93066 13.5 8.00024 14.5696 8.00024 15.889C8.00024 16.6543 7.66895 17.2421 7.26742 17.6785C6.96138 18.0111 6.58959 18.2821 6.26512 18.5H7.25024C7.80253 18.5 8.25024 18.9477 8.25024 19.5C8.25024 20.0523 7.80253 20.5 7.25024 20.5H4.00024C3.44796 20.5 3.00024 20.0523 3.00024 19.5C3.00024 18.7457 3.39226 18.2011 3.7788 17.8324C4.10631 17.52 4.521 17.2506 4.84703 17.0388L4.95305 16.9698C5.33774 16.7183 5.61042 16.5256 5.79557 16.3244C5.95653 16.1494 6.00024 16.0234 6.00024 15.889C6.00024 15.6742 5.82609 15.5 5.61126 15.5C5.47433 15.5 5.29428 15.5535 5.10937 15.6454C5.02474 15.6875 4.95493 15.7297 4.90827 15.7601C4.8853 15.775 4.86816 15.7868 4.85955 15.7929Z"
              fill="black"
            />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={editor.isActive("heading", { level: 2 }) ? "is-active" : ""}
        >
          <svg width="24" height="24" viewBox="2 2 22 22">
            <path
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 12h8m-8 6V6m8 12V6m9 12h-4c0-4 4-3 4-6c0-1.5-2-2.5-4-1"
            ></path>
          </svg>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={editor.isActive("heading", { level: 3 }) ? "is-active" : ""}
        >
          <svg width="24" height="24" viewBox="2 2 22 22">
            <path
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 12h8m-8 6V6m8 12V6m5.5 4.5c1.7-1 3.5 0 3.5 1.5a2 2 0 0 1-2 2m-2 3.5c2 1.5 4 .3 4-1.5a2 2 0 0 0-2-2"
            ></path>
          </svg>
        </button>
        <button
          type="button"
          // onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          // className={editor.isActive("heading", { level: 3 }) ? "is-active" : ""}
          onClick={setLink}
          className={editor.isActive("link") ? "is-active" : ""}
        >
          <svg width="1em" height="1em" viewBox="0 0 24 24">
            <path
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="m9.172 14.829l5.657-5.657M7.05 11.293l-1.414 1.414a4 4 0 1 0 5.657 5.657l1.412-1.414m-1.413-9.9l1.414-1.414a4 4 0 1 1 5.657 5.657l-1.414 1.414"
            ></path>
          </svg>
        </button>
        <button type="button" disabled={!editor.can().chain().focus().undo().run()}>
          <label htmlFor="tiptapimg" className="add-image-btn">
            <svg width="1em" height="1em" viewBox="0 0 24 24">
              <path
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 17V7.2c0-1.12 0-1.68.218-2.108c.192-.377.497-.682.874-.874C4.52 4 5.08 4 6.2 4h11.6c1.12 0 1.68 0 2.108.218a2 2 0 0 1 .874.874c.218.427.218.987.218 2.105v9.606c0 .485 0 .865-.018 1.174M3 17c0 .988.013 1.506.218 1.907c.192.377.497.683.874.875c.427.218.987.218 2.105.218h11.607c1.118 0 1.677 0 2.104-.218c.376-.192.682-.498.874-.875c.123-.242.177-.526.2-.93M3 17l4.768-5.562l.001-.002c.423-.493.635-.74.886-.83a1 1 0 0 1 .681.005c.25.093.46.343.876.843l2.671 3.205c.386.464.58.696.816.79a1 1 0 0 0 .651.028c.244-.072.46-.287.889-.716l.497-.497c.437-.438.656-.656.904-.728a.995.995 0 0 1 .659.037c.238.099.431.34.818.822l2.865 3.582m0 0L21 18m-6-8a1 1 0 1 1 0-2a1 1 0 0 1 0 2"
              ></path>
            </svg>
          </label>
          <input type="file" name="" id="tiptapimg" onChange={(e) => uploadImage(e.currentTarget.files[0])} hidden ref={img} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M7.20696 5.70711C7.59748 5.31658 7.59748 4.68342 7.20696 4.29289C6.81643 3.90237 6.18327 3.90237 5.79274 4.29289L2.49985 7.58579C1.7188 8.36684 1.7188 9.63317 2.49985 10.4142L5.79274 13.7071C6.18327 14.0976 6.81643 14.0976 7.20696 13.7071C7.59748 13.3166 7.59748 12.6834 7.20696 12.2929L4.91406 10H17C18.6569 10 20 11.3431 20 13V14C20 15.6569 18.6569 17 17 17H12C11.4477 17 11 17.4477 11 18C11 18.5523 11.4477 19 12 19H17C19.7614 19 22 16.7614 22 14V13C22 10.2386 19.7614 8 17 8H4.91406L7.20696 5.70711Z"
              fill="black"
            />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M16.793 5.70711C16.4025 5.31658 16.4025 4.68342 16.793 4.29289C17.1836 3.90237 17.8167 3.90237 18.2073 4.29289L21.5002 7.58579C22.2812 8.36684 22.2812 9.63317 21.5002 10.4142L18.2073 13.7071C17.8167 14.0976 17.1836 14.0976 16.793 13.7071C16.4025 13.3166 16.4025 12.6834 16.793 12.2929L19.0859 10H7C5.34315 10 4 11.3431 4 13V14C4 15.6569 5.34315 17 7 17H12C12.5523 17 13 17.4477 13 18C13 18.5523 12.5523 19 12 19H7C4.23858 19 2 16.7614 2 14V13C2 10.2386 4.23857 8 7 8H19.0859L16.793 5.70711Z"
              fill="black"
            />
          </svg>
        </button>
      </article>
    </>
  )
}

interface IAddImage {
  editor: Editor
  className?: string
}
