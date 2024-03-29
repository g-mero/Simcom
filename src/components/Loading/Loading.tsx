import styles from '@/styles/components/loading.module.scss'

export default function Loading() {
  return (
    <div class={styles['loading-mask']}>
      <div id={styles.load}>
        <div />
        <div />
        <div />
        <div />
        <div />
      </div>
    </div>
  )
}
