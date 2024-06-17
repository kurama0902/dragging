import { BrowserRouter as Router } from 'react-router-dom';
import { DraggableTabs } from './components/DraggableTabs'

import s from './App.module.css'

function App() {

  return (
    <Router>
      <div className={s.app}>
        <div className={s.topPaddingBlock}></div>
        <div id='tabsContainer' className={s.dragableTabsContainer}>
          <DraggableTabs />
          <div id='contextMenuWrap' className={s.contextMenuWrap}>

          </div>
        </div>
      </div>
    </Router>
  )
}

export default App
