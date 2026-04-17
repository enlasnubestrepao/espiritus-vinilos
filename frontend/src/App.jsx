import { useState } from 'react'
import Header    from './components/Header'
import Dashboard from './components/Dashboard'

function App() {
  const [coll, setColl] = useState('vinyl')
  return (
    <>
      <Header coll={coll} setColl={setColl} />
      <Dashboard coll={coll} />
    </>
  )
}

export default App
