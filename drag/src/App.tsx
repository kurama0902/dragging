import { BrowserRouter as Router } from 'react-router-dom';
import { DraggableTabs } from './components/DraggableTabs'

import s from './App.module.css'

function App() {

  return (
    <Router>
      <div className={s.app}>
        <div className={s.topPaddingBlock}></div>
        <DraggableTabs />
      </div>
    </Router>
  )
}

export default App
