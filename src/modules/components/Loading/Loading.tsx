import styles from './Loading.module.scss'

export default function Loading() {
  return (
    <div class={styles['loading-mask']}>
      <svg id={styles.load} x="0px" y="0px" viewBox="0 0 150 150">
        <circle id={styles['loading-inner']} cx="75" cy="75" r="60" />
      </svg>
    </div>
  )
}
