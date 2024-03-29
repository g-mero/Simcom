import type { JSX } from 'solid-js/jsx-runtime'

const defaultAvatar =
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNTYgMjU2Ij48cGF0aCBmaWxsPSIjYzVjNWM1IiBkPSJNMCAwaDI1NnYyNTZIMHoiLz48Y2lyY2xlIGN4PSIxMjcuNzUiIGN5PSIxMDkuNSIgcj0iNTYuNSIgZmlsbD0iI2ZmZiIvPjxwYXRoIGQ9Ik0yMjcuNTMgMjU2SDI4LjQ3YzMuMTMtNDAuNSAyMS45OC03NS4zMSA0OC45LTk0Ljk2YTMuNzQgMy43NCAwIDAgMSA0LjguMzIgNjUuMzYxIDY1LjM2MSAwIDAgMCA5MS4yMS0uMyAzLjc0MiAzLjc0MiAwIDAgMSA0LjgtLjM1YzI3LjE1IDE5LjU4IDQ2LjIgNTQuNTYgNDkuMzUgOTUuMjl6IiBmaWxsPSIjZmZmIi8+PC9zdmc+'

export default function Avatar(props: {
  avatarUrl: string
  style?: string | JSX.CSSProperties
}) {
  return (
    <div style={props.style}>
      <img
        src={props.avatarUrl || defaultAvatar}
        loading="lazy"
        alt="avatar"
        onError={(e) => {
          e.currentTarget.src = defaultAvatar
        }}
        style={{
          width: '2.8em',
          height: '2.8em',
          'margin-top': '-.2em',
          'object-fit': 'cover',
          'background-image': `url(${defaultAvatar})`,
          'background-repeat': 'no-repeat',
          'border-radius': '50%',
        }}
      />
    </div>
  )
}
