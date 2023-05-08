import type { ParentProps } from 'solid-js'

import styles from './styles.module.scss'

export default function Tooltip(props: { content: string } & ParentProps) {
  return (
    <div class={styles.poptip} aria-controls={props.content}>
      {props.children}
    </div>
  )
}
