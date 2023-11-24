import { Show } from 'solid-js'
import { ReplyTextEditor } from '../../textEditor/TextEditor'
import styles from './styles.module.scss'

export default function ReplyEditor(props: {
  show: boolean
  value?: string
  placeHolder?: string
  label?: string
  onPost: (value: string) => Promise<any>
}) {
  return (
    <div class={`${styles['open-wrapper']} ${props.show ? styles.open : ''}`}>
      <Show when={props.show}>
        <ReplyTextEditor
          placeHolder={props.placeHolder || ''}
          value={props.value || ''}
          label={props.label}
          onPost={(value) => {
            return props.onPost(value)
          }}
        />
      </Show>
    </div>
  )
}
