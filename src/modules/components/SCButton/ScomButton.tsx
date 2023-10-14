import { type JSX, Show } from 'solid-js'

import Icon from '../Icon/Icon'
import styles from './styles.module.scss'

function Button(props: {
  label?: string
  icon?: string
  flat?: boolean
  title?: string
  text?: boolean
  onClick?: JSX.EventHandler<HTMLButtonElement, MouseEvent>
  active?: boolean
  disabled?: boolean
  loading?: boolean
}) {
  return (
    <button
      class={`${styles.btn} ${props.active ? styles.active : ''} ${
        props.disabled ? styles.disabled : ''
      } ${props.flat ? styles.flat : ''} ${props.text ? styles.text : ''} ${
        props.loading ? styles.loading : ''
      }  `}
      type="button"
      title={props.title}
      onClick={(ev) => {
        if (props.onClick) {
          props.onClick(ev)
        }
      }}
    >
      <Show when={props.icon} fallback={<span>{props.label}</span>}>
        <Icon icon={props.icon || ''} />
      </Show>
      <Show when={props.loading}>
        <div class={`${styles['load-circle']}`} />
      </Show>
    </button>
  )
}

export default function ScomButton(props: {
  label?: string
  icon?: string
  flat?: boolean
  title?: string
  type?: 'primary' | 'success'
  text?: boolean
  onClick?: JSX.EventHandler<HTMLButtonElement, MouseEvent>
  active?: boolean
  disabled?: boolean
  loading?: boolean
}) {
  return (
    <>
      <Button {...props} />
    </>
  )
}
