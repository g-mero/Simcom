import type { JSX } from 'solid-js/jsx-runtime'
import styles from './icon.module.scss'

export default function Icon(props: { icon: string; width?: string }) {
  return <div class={styles.icon}>{getIcon(props.icon, props.width)}</div>
}

function getIcon(icon: string, width = '1em') {
  switch (icon) {
    case 'majesticons:comment-line':
      return <MajesticonsCommentLine width={width} height={width} />

    default:
      return <></>
  }
}

function MajesticonsCommentLine(props: JSX.IntrinsicElements['svg']) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
      <path
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M19 4H5a2 2 0 0 0-2 2v15l3.467-2.6a2 2 0 0 1 1.2-.4H19a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"
      />
    </svg>
  )
}
