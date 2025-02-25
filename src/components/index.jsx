import React from 'react'
import ReactDOM from 'react-dom'
import { cx, css } from '@emotion/css'
// Import specific Ant Design Icons
import { 
  BoldOutlined, 
  ItalicOutlined, 
  UnderlineOutlined,
  OrderedListOutlined,
  UnorderedListOutlined,
  QuestionOutlined
} from '@ant-design/icons'

export const Button = React.forwardRef(
  ({ className, active, reversed, ...props }, ref) => (
    <span
      {...props}
      ref={ref}
      className={cx(
        className,
        css`
          cursor: pointer;
          color: ${reversed
            ? active
              ? 'white'
              : '#aaa'
            : active
            ? 'black'
            : '#ccc'};
        `
      )}
    />
  )
)

export const EditorValue = React.forwardRef(
  ({ className, value, ...props }, ref) => {
    const textLines = value.document.nodes
      .map(node => node.text)
      .toArray()
      .join('\n')
    return (
      <div
        ref={ref}
        {...props}
        className={cx(
          className,
          css`
            margin: 30px -20px 0;
          `
        )}
      >
        <div
          className={css`
            font-size: 14px;
            padding: 5px 20px;
            color: #404040;
            border-top: 2px solid #eeeeee;
            background: #f8f8f8;
          `}
        >
          Slate's value as text
        </div>
        <div
          className={css`
            color: #404040;
            font: 12px monospace;
            white-space: pre-wrap;
            padding: 10px 20px;
            div {
              margin: 0 0 0.5em;
            }
          `}
        >
          {textLines}
        </div>
      </div>
    )
  }
)

// Updated Icon component using Ant Design icons
export const Icon = React.forwardRef(({ className, children, ...props }, ref) => {
  // Direct mapping of component instances rather than component classes
  const iconComponents = {
    'format_bold': <BoldOutlined />,
    'format_italic': <ItalicOutlined />,
    'format_underlined': <UnderlineOutlined />,
    'format_list_numbered': <OrderedListOutlined />,
    'format_list_bulleted': <UnorderedListOutlined />
    // Add more mappings as needed
  }
  
  // Get the appropriate icon or fallback to question icon
  const iconElement = iconComponents[children] || <QuestionOutlined />

  return (
    <span
      {...props}
      ref={ref}
      className={cx(
        className,
        css`
          font-size: 18px;
          vertical-align: text-bottom;
          display: inline-flex;
          align-items: center;
        `
      )}
    >
      {iconElement}
    </span>
  )
})

export const Instruction = React.forwardRef(({ className, ...props }, ref) => (
  <div
    {...props}
    ref={ref}
    className={cx(
      className,
      css`
        white-space: pre-wrap;
        margin: 0 -20px 10px;
        padding: 10px 20px;
        font-size: 14px;
        background: #f8f8e8;
      `
    )}
  />
))

export const Menu = React.forwardRef(({ className, ...props }, ref) => (
  <div
    {...props}
    data-test-id="menu"
    ref={ref}
    className={cx(
      className,
      css`
        & > * {
          display: inline-block;
        }

        & > * + * {
          margin-left: 15px;
        }
      `
    )}
  />
))

export const Portal = ({ children }) => {
  return typeof document === 'object'
    ? ReactDOM.createPortal(children, document.body)
    : null
}

export const Toolbar = React.forwardRef(({ className, ...props }, ref) => (
  <Menu
    {...props}
    ref={ref}
    className={cx(
      className,
      css`
        position: relative;
        padding: 1px 18px 17px;
        margin: 0 -20px;
        border-bottom: 2px solid #eee;
        margin-bottom: 20px;
      `
    )}
  />
))