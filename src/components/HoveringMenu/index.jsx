import React, { useMemo, useRef, useEffect, useState } from 'react'
import { Slate, Editable, withReact, useSlate, useFocused } from 'slate-react'
import { Editor, createEditor, Range, Transforms, Element as SlateElement } from 'slate'
import { css } from '@emotion/css'
import { withHistory } from 'slate-history'
import { Button, Icon, Menu, Portal } from '../index.jsx'

const HoveringMenu = () => {
  const editor = useMemo(() => withHistory(withReact(createEditor())), [])
  
  // Load initial value from localStorage or use default
  const initialValue = useMemo(() => {
    const savedContent = localStorage.getItem('content')
    return savedContent ? JSON.parse(savedContent) : defaultInitialValue
  }, [])

  return (
    <Slate 
      editor={editor} 
      initialValue={initialValue}
      onChange={value => {
        // Check if the change was to content and not just selection
        const isAstChange = editor.operations.some(
          op => 'set_selection' !== op.type
        )
        
        if (isAstChange) {
          // Save the value to localStorage
          const content = JSON.stringify(value)
          localStorage.setItem('content', content)
        }
      }}
    >
      <HoveringToolbar />
      <Editable
        renderElement={props => <Element {...props} />}
        renderLeaf={props => <Leaf {...props} />}
        placeholder="Enter some text..."
        onDOMBeforeInput={event => {
          switch (event.inputType) {
            case 'formatBold':
              event.preventDefault()
              return toggleMark(editor, 'bold')
            case 'formatItalic':
              event.preventDefault()
              return toggleMark(editor, 'italic')
            case 'formatUnderline':
              event.preventDefault()
              return toggleMark(editor, 'underlined')
          }
        }}
      />
    </Slate>
  )
}

const LIST_TYPES = ['numbered-list', 'bulleted-list']

const toggleMark = (editor, format) => {
  const isActive = isMarkActive(editor, format)
  if (isActive) {
    Editor.removeMark(editor, format)
  } else {
    Editor.addMark(editor, format, true)
  }
}

const isMarkActive = (editor, format) => {
  const marks = Editor.marks(editor)
  return marks ? marks[format] === true : false
}

const toggleBlock = (editor, format) => {
  const isActive = isBlockActive(editor, format)
  const isList = LIST_TYPES.includes(format)

  Transforms.unwrapNodes(editor, {
    match: n =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      LIST_TYPES.includes(n.type),
    split: true,
  })

  const newProperties = {
    type: isActive ? 'paragraph' : isList ? 'list-item' : format,
  }
  Transforms.setNodes(editor, newProperties)

  if (!isActive && isList) {
    const block = { type: format, children: [] }
    Transforms.wrapNodes(editor, block)
  }
}

const isBlockActive = (editor, format) => {
  const { selection } = editor
  if (!selection) return false

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: n =>
        !Editor.isEditor(n) &&
        SlateElement.isElement(n) &&
        n.type === format,
    })
  )

  return !!match
}

const Element = ({ attributes, children, element }) => {
  switch (element.type) {
    case 'bulleted-list':
      return <ul {...attributes}>{children}</ul>
    case 'numbered-list':
      return <ol {...attributes}>{children}</ol>
    case 'list-item':
      return <li {...attributes}>{children}</li>
    default:
      return <p {...attributes}>{children}</p>
  }
}

const Leaf = ({ attributes, children, leaf }) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>
  }
  if (leaf.italic) {
    children = <em>{children}</em>
  }
  if (leaf.underlined) {
    children = <u>{children}</u>
  }
  return <span {...attributes}>{children}</span>
}

const HoveringToolbar = () => {
  const ref = useRef()
  const editor = useSlate()
  const inFocus = useFocused()

  useEffect(() => {
    const el = ref.current
    const { selection } = editor

    if (!el) {
      return
    }

    if (
      !selection ||
      !inFocus ||
      Range.isCollapsed(selection) ||
      Editor.string(editor, selection) === ''
    ) {
      el.removeAttribute('style')
      return
    }

    const domSelection = window.getSelection()
    const domRange = domSelection.getRangeAt(0)
    const rect = domRange.getBoundingClientRect()
    el.style.opacity = '1'
    el.style.top = `${rect.top + window.pageYOffset - el.offsetHeight}px`
    el.style.left = `${
      rect.left + window.pageXOffset - el.offsetWidth / 2 + rect.width / 2
    }px`
  })

  return (
    <Portal>
      <Menu
        ref={ref}
        className={css`
          padding: 8px 7px 6px;
          position: absolute;
          z-index: 1;
          top: -10000px;
          left: -10000px;
          margin-top: -6px;
          opacity: 0;
          background-color: #222;
          border-radius: 4px;
          transition: opacity 0.75s;
        `}
        onMouseDown={e => {
          // prevent toolbar from taking focus away from editor
          e.preventDefault()
        }}
      >
        <FormatButton format="bold" icon="format_bold" />
        <FormatButton format="italic" icon="format_italic" />
        <FormatButton format="underlined" icon="format_underlined" />
        <BlockButton format="numbered-list" icon="format_list_numbered" />
        <BlockButton format="bulleted-list" icon="format_list_bulleted" />
      </Menu>
    </Portal>
  )
}

const FormatButton = ({ format, icon }) => {
  const editor = useSlate()
  return (
    <Button
      reversed
      active={isMarkActive(editor, format)}
      onClick={() => toggleMark(editor, format)}
    >
      <Icon>{icon}</Icon>
    </Button>
  )
}

const BlockButton = ({ format, icon }) => {
  const editor = useSlate()
  return (
    <Button
      reversed
      active={isBlockActive(editor, format)}
      onClick={() => toggleBlock(editor, format)}
    >
      <Icon>{icon}</Icon>
    </Button>
  )
}

// Renamed from initialValue to defaultInitialValue
const defaultInitialValue = [
  {
    type: 'paragraph',
    children: [
      {
        text: 'This example shows how you can make a hovering menu appear above your content, which you can use to make text ',
      }, 
      { text: 'bold', bold: true },
      { text: ', ' },
      { text: 'italic', italic: true },
      { text: ', create lists, or anything else you might want to do!' },
    ],
  },
  {
    type: 'paragraph',
    children: [
      { text: 'Try it out yourself! Just ' },
      { text: 'select any piece of text and the menu will appear', bold: true },
      { text: '.' },
    ],
  },
]

export default HoveringMenu