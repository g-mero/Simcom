import { Show, useContext } from 'solid-js'
import { CommentContext } from './controllers/Config'
import CommentsArea from './modules/CommentsArea/CommentsArea'
import styles from './styles/main.module.scss'
import TextEditor from './modules/textEditor/TextEditor'
import Loading from '@/components/Loading/Loading'

import './styles/global.scss'

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
