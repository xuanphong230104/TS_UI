import PropTypes from "prop-types";
import React from "react";
import { useMemo, useRef, useEffect, useState } from "react";
import { Slate, Editable, withReact, useSlate, useFocused } from "slate-react";
import {
  Editor,
  createEditor,
  Range,
  Transforms,
  Element as SlateElement,
  Path,
} from "slate";
import { css } from "@emotion/css";
import { withHistory } from "slate-history";
import { Button, Icon, Menu, Portal } from "../index.jsx";


const RichTextEditor = ({
  tasks = [],
  isCheckin = false,
  onChange,
  initValue,
  readOnly = false,
}) => {
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);
  const [editorValue, setEditorValue] = useState([]);
  const today = new Date().toLocaleDateString('en-US', { 
    month: '2-digit', 
    day: '2-digit', 
    year: 'numeric' 
  });

  // Determine initial value based on the provided initValue prop
  // If initValue has content property, use that, otherwise use the whole initValue or default
  const initialValue = useMemo(() => {
    if (!initValue) return getDefaultInitialValue(today, isCheckin);

    // If initValue is a check-in object with content
    if (initValue.content) {
      try {
        // Try to parse the content if it's a JSON string
        const parsedContent =
          typeof initValue.content === "string"
            ? JSON.parse(initValue.content)
            : initValue.content;

        return Array.isArray(parsedContent) && parsedContent.length > 0
          ? parsedContent
          : getDefaultInitialValue(today);
      } catch (e) {
        console.error("Error parsing check-in content:", e);
        return getDefaultInitialValue(today);
      }
    }

    // If initValue is already a slate value array
    return Array.isArray(initValue) && initValue.length > 0
      ? initValue
      : getDefaultInitialValue(today);
  }, [initValue, today]);

  useEffect(() => {
    setEditorValue(initialValue);
  }, [initialValue]);

  // Function to preserve header and footer when content changes
  const preserveHeaderAndFooter = (editor, content) => {
    // We'll need to preserve the first and last paragraphs (header and footer)
    // If they don't exist yet, we'll create them
    
    const nodes = [...Editor.nodes(editor, {
      at: [],
      match: n => SlateElement.isElement(n)
    })];

    // Check if we already have content
    const hasContent = nodes.length > 0;
    
    if (!hasContent) {
      // If no content, let's create header, content and footer
      const initialStructure = getDefaultInitialValue(today);
      Transforms.insertNodes(editor, initialStructure);
      return;
    }

    // If we have content, we need to preserve header and footer
    // And replace the middle part with the new content
    const headerNode = nodes.length > 0 ? nodes[0][0] : null;
    const footerNode = nodes.length > 1 ? nodes[nodes.length - 1][0] : null;

    // First, insert the new content between header and footer
    if (content) {
      // Remove existing content between header and footer (if any)
      if (nodes.length > 2) {
        // We need to delete all nodes except the first and last
        for (let i = nodes.length - 2; i > 0; i--) {
          Transforms.delete(editor, { at: Path.next(Path.parent(nodes[i][1])) });
        }
      }

      // Insert the new content after the header
      Transforms.insertNodes(
        editor,
        content,
        { at: Path.next(Path.parent(nodes[0][1])) }
      );
    }
  };

  // Update editor content when tasks change
  useEffect(() => {
    if (tasks.length > 0 && !readOnly) {
      const taskNodes = tasks.map((task) => {
        let statusText = "";
        if (task.progress === 0) {
          statusText = "[NOT STARTED]";
        } else if (task.progress === 100) {
          statusText = "[DONE]";
        } else {
          statusText = `[INPROGRESS ${task.progress}%]`;
        }
        return {
          type: "list-item",
          children: [{ text: task.title + " " + statusText }],
        };
      });

      const numberedList = {
        type: "numbered-list",
        children: taskNodes,
      };

      // Instead of clearing everything, let's preserve the header and footer
      // and replace only the middle part
      try {
        // We'll use a temporary selection to position our cursor
        const start = Editor.start(editor, []);
        const end = Editor.end(editor, []);
        
        // Get the nodes
        const nodes = Array.from(
          Editor.nodes(editor, {
            at: { anchor: start, focus: end },
            match: n => !Editor.isEditor(n) && SlateElement.isElement(n),
          })
        );

        // If we have at least 3 nodes (header, content, footer)
        if (nodes.length >= 3) {
          // Delete the middle content (keeping header and footer)
          const headerPath = nodes[0][1];
          const footerPath = nodes[nodes.length - 1][1];
          
          // We need to work from the end backwards to avoid path issues
          for (let i = nodes.length - 2; i > 0; i--) {
            Transforms.delete(editor, { at: nodes[i][1] });
          }
          
          // Insert the numbered list after the header
          Transforms.insertNodes(editor, numberedList, { at: Path.next(headerPath) });
        } else {
          // If we don't have enough nodes, let's create a proper structure
          const newStructure = [
            {
              type: "paragraph",
              children: [{ text: `${isCheckin?"Daily Check-ins":"End-of-Day report"} ${today}:`, bold: true }],
            },
            numberedList,
            {
              type: "paragraph",
              children: [{ text: "This is some sample context...", italic: true }],
            },
          ];
          
          // Clear existing content
          Transforms.delete(editor, {
            at: {
              anchor: start,
              focus: end,
            },
          });
          
          // Insert the new structure
          Transforms.insertNodes(editor, newStructure);
        }
      } catch (error) {
        console.error("Error updating editor content:", error);
        
        // Fallback: Clear and insert everything
        const newStructure = [
          {
            type: "paragraph",
            children: [{ text: `${isCheckin?"Daily Check-ins":"End-of-Day report"} ${today}:`, bold: true ,italic: true}],
          },
          numberedList,
          {
            type: "paragraph",
            children: [{ text: "This is some sample context...", italic: true }],
          },
        ];
        
        // Clear all content
        Transforms.delete(editor, {
          at: {
            anchor: Editor.start(editor, []),
            focus: Editor.end(editor, []),
          },
        });
        
        // Insert the new structure
        Transforms.insertNodes(editor, newStructure);
      }
    }
  }, [tasks, editor, readOnly, today]);

  return (
    <Slate
      editor={editor}
      initialValue={initialValue}
      value={editorValue}
      onChange={(value) => {
        setEditorValue(value);

        // Check if the change was to content and not just selection
        const isAstChange = editor.operations.some(
          (op) => "set_selection" !== op.type
        );

        if (isAstChange && onChange) {
          onChange(value);
        }
      }}
    >
      {!readOnly && <HoveringToolbar />}
      <Editable
        readOnly={readOnly}
        className={css`
          padding-left: 9px;
          ${readOnly ? "cursor: default;" : ""}
        `}
        renderElement={(props) => <Element {...props} />}
        renderLeaf={(props) => <Leaf {...props} />}
        placeholder={readOnly ? "" : "Enter some text..."}
        onDOMBeforeInput={(event) => {
          if (readOnly) return;

          switch (event.inputType) {
            case "formatBold":
              event.preventDefault();
              return toggleMark(editor, "bold");
            case "formatItalic":
              event.preventDefault();
              return toggleMark(editor, "italic");
            case "formatUnderline":
              event.preventDefault();
              return toggleMark(editor, "underlined");
          }
        }}
      />
    </Slate>
  );
};

const LIST_TYPES = ["numbered-list", "bulleted-list"];

const toggleMark = (editor, format) => {
  const isActive = isMarkActive(editor, format);
  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

const isMarkActive = (editor, format) => {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};

const toggleBlock = (editor, format) => {
  const isActive = isBlockActive(editor, format);
  const isList = LIST_TYPES.includes(format);

  Transforms.unwrapNodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      LIST_TYPES.includes(n.type),
    split: true,
  });

  const newProperties = {
    type: isActive ? "paragraph" : isList ? "list-item" : format,
  };
  Transforms.setNodes(editor, newProperties);

  if (!isActive && isList) {
    const block = { type: format, children: [] };
    Transforms.wrapNodes(editor, block);
  }
};

const isBlockActive = (editor, format) => {
  const { selection } = editor;
  if (!selection) return false;

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: (n) =>
        !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === format,
    })
  );

  return !!match;
};

const Element = ({ attributes, children, element }) => {
  switch (element.type) {
    case "bulleted-list":
      return <ul {...attributes}>{children}</ul>;
    case "numbered-list":
      return <ol {...attributes}>{children}</ol>;
    case "list-item":
      return <li {...attributes}>{children}</li>;
    default:
      return <p {...attributes}>{children}</p>;
  }
};

const Leaf = ({ attributes, children, leaf }) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }
  if (leaf.italic) {
    children = <em>{children}</em>;
  }
  if (leaf.underlined) {
    children = <u>{children}</u>;
  }
  return <span {...attributes}>{children}</span>;
};

const HoveringToolbar = () => {
  const ref = useRef();
  const editor = useSlate();
  const inFocus = useFocused();

  useEffect(() => {
    const el = ref.current;
    const { selection } = editor;

    if (!el) {
      return;
    }

    if (
      !selection ||
      !inFocus ||
      Range.isCollapsed(selection) ||
      Editor.string(editor, selection) === ""
    ) {
      el.removeAttribute("style");
      return;
    }

    const domSelection = window.getSelection();
    const domRange = domSelection.getRangeAt(0);
    const rect = domRange.getBoundingClientRect();
    el.style.opacity = "1";
    el.style.top = `${rect.top + window.pageYOffset - el.offsetHeight}px`;
    el.style.left = `${
      rect.left + window.pageXOffset - el.offsetWidth / 2 + rect.width / 2
    }px`;
  });

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
        onMouseDown={(e) => {
          // prevent toolbar from taking focus away from editor
          e.preventDefault();
        }}
      >
        <FormatButton format="bold" icon="format_bold" />
        <FormatButton format="italic" icon="format_italic" />
        <FormatButton format="underlined" icon="format_underlined" />
        <BlockButton format="numbered-list" icon="format_list_numbered" />
        <BlockButton format="bulleted-list" icon="format_list_bulleted" />
      </Menu>
    </Portal>
  );
};

const FormatButton = ({ format, icon }) => {
  const editor = useSlate();
  return (
    <Button
      reversed
      active={isMarkActive(editor, format)}
      onClick={() => toggleMark(editor, format)}
    >
      <Icon>{icon}</Icon>
    </Button>
  );
};

const BlockButton = ({ format, icon }) => {
  const editor = useSlate();
  return (
    <Button
      reversed
      active={isBlockActive(editor, format)}
      onClick={() => toggleBlock(editor, format)}
    >
      <Icon>{icon}</Icon>
    </Button>
  );
};

// Get default initial value with current date
const getDefaultInitialValue = (date, isCheckin) => [
  {
    type: "paragraph",
    children: [
      { text: `${isCheckin?"Daily Check-ins":"End-of-Day report"} ${date}:`, bold: true , italic: true}
    ],
  },
  {
    type: "numbered-list",
    children: [
      {
        type: "list-item",
        children: [{ text: "Add your tasks here" }],
      }
    ],
  },
  {
    type: "paragraph",
    children: [
      { text: "This is some sample context...", italic: true }
    ],
  }
];

// Default initial value (fallback)
const defaultInitialValue = getDefaultInitialValue(
  new Date().toLocaleDateString('en-US', { 
    month: '2-digit', 
    day: '2-digit', 
    year: 'numeric' 
  })
);

RichTextEditor.propTypes = {
  tasks: PropTypes.array,
  onChange: PropTypes.func.isRequired,
  initValue: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  readOnly: PropTypes.bool,
  onKeyDown: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  onPaste: PropTypes.func,
  onCut: PropTypes.func,
  onCopy: PropTypes.func,
  onDrop: PropTypes.func,
  isCheckin: PropTypes.bool
};

Element.propTypes = {
  attributes: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
  element: PropTypes.shape({
    type: PropTypes.string.isRequired
  }).isRequired
};

Leaf.propTypes = {
  attributes: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
  leaf: PropTypes.shape({
    bold: PropTypes.bool,
    italic: PropTypes.bool,
    underlined: PropTypes.bool
  }).isRequired
};

FormatButton.propTypes = {
  format: PropTypes.string.isRequired,
  icon: PropTypes.node.isRequired
};

BlockButton.propTypes = {
  format: PropTypes.string.isRequired,
  icon: PropTypes.node.isRequired
};

export default RichTextEditor;
