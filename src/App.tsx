import { Show, useContext } from 'solid-js'
import { CommentContext } from './modules/Stores/Config'
import CommentsArea from './modules/CommentsArea/CommentsArea'
import Loading from './modules/components/Loading/Loading'
import TextEditor from './modules/textEditor/TextEditor'

import './styles/global.scss'

const App = (props: { loading?: boolean; theme?: string }) => {
  const { state: GlobalConfig } = useContext(CommentContext)
  return (
    <div class={`simcom-wrapper ${props.theme}`}>
      <div class="simcom-texteditor">
        <TextEditor />
      </div>
      <div style={{ position: 'relative' }}>
        <div class={props.loading ? 'loading' : undefined}>
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
