import { Show, createSignal } from 'solid-js'
import styles from '@/styles/components/textfield.module.scss'

function TextArea(props: {
  placeholder?: string
  onChange?: (value: string) => void
  value?: string
  onfocus?: (bool: boolean) => void
  maxLength?: number
  height?: string
  hideCount?: boolean
}) {
  const [fontCount, setFontCount] = createSignal(0)
  return (
    <div class={styles['textarea-wrapper']}>
      <textarea
        style={{ height: props.height || '6em' }}
        placeholder={props.placeholder}
        value={props.value || ''}
        onInput={(e) => {
          const value = e.target.value
          props.onChange && props.onChange(value)
          setFontCount(value.length)
        }}
        onFocus={() => {
          props.onfocus?.(true)
        }}
        onBlur={() => {
          props.onfocus?.(false)
        }}
        maxLength={props.maxLength || 1000}
      />
      <Show when={!props.hideCount}>
        <div class={styles['textarea-tools']}>
          <div />
          <div style={{ opacity: 0.7 }}>
            {fontCount()}/{props.maxLength || 1000}
          </div>
        </div>
      </Show>
    </div>
  )
}

function Input(props: {
  placeholder?: string
  onChange?: (value: string) => void
  value?: string
  type?: string
  onfocus?: (bool: boolean) => void
  maxLength?: number
}) {
  return (
    <input
      placeholder={props.placeholder}
      value={props.value || ''}
      onInput={(e) => {
        props.onChange && props.onChange((e.target as HTMLInputElement).value)
      }}
      onFocus={() => {
        props.onfocus?.(true)
      }}
      onBlur={() => {
        props.onfocus?.(false)
      }}
      type={props.type || 'text'}
      maxLength={props.maxLength || 50}
    />
  )
}

export default function TextField(props: {
  placeholder?: string
  type?: string
  onChange?: (value: string) => void
  value?: string
  maxLength?: number
  height?: string
  hideCount?: boolean
}) {
  const [focus, setFocus] = createSignal(false)
  return (
    <div
      class={`${styles['text-field-wrapper']} ${focus() ? styles.focus : ''}`}
    >
      <Show
        when={props.type === 'textarea'}
        fallback={
          <Input
            {...props}
            onfocus={(v) => {
              setFocus(v)
            }}
          />
        }
      >
        <TextArea
          {...props}
          onfocus={(v) => {
            setFocus(v)
          }}
        />
      </Show>
    </div>
  )
}
