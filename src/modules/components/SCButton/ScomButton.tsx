import type { JSX } from 'solid-js'

import styles from './styles.module.scss'

function Button(props: {
  children: JSX.Element
  text?: boolean
  type?: 'primary' | 'success'
  onClick?: JSX.EventHandler<HTMLButtonElement, MouseEvent>
  active?: boolean
  disabled?: boolean
}) {
  const getClass = (
    type: 'primary' | 'success' | 'default' = 'default',
    text = false,
  ) => {
    if (text) {
      return styles.text
    } else {
      return styles[type]
    }
  }
  return (
    <button
      class={`${getClass(props.type, props.text)} ${styles.btn} ${
        props.active ? styles.active : ''
      } ${props.disabled ? styles.disabled : ''}`}
      type="button"
      onClick={(ev) => {
        if (props.onClick) {
          props.onClick(ev)
        }
      }}
    >
      {props.children}
    </button>
  )
}

export default function ScomButton(props: {
  children: JSX.Element
  type?: 'primary' | 'success'
  text?: boolean
  onClick?: JSX.EventHandler<HTMLButtonElement, MouseEvent>
  active?: boolean
  disabled?: boolean
}) {
  return (
    <>
      <Button {...props} />
    </>
  )
}
