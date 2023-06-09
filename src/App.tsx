import { Show, useContext } from 'solid-js'
import { CommentContext } from './modules/Stores/Config'
import CommentsArea from './modules/CommentsArea/CommentsArea'
import Loading from './modules/components/Loading/Loading'
import TextEditor from './modules/textEditor/TextEditor'

import './styles/global.scss'

import styles from './styles/main.module.scss'

const App = (props: { loading?: boolean }) => {
  const { state: GlobalConfig } = useContext(CommentContext)
  return (
    <div class={`simcom-wrapper`}>
      <div class="simcom-texteditor">
        <TextEditor />
      </div>
      <div style={{ position: 'relative' }}>
        <div class={props.loading ? styles.loading : undefined}>
          <CommentsArea
            comments={GlobalConfig.commentsOpt.comments}
            onPagiClick={GlobalConfig.commentsOpt.onPagiClick}
            pageCount={GlobalConfig.commentsOpt.pageCount}
          />
        </div>
        <Show when={props.loading}>
          <Loading />
        </Show>
      </div>
    </div>
  )
}

export default App
