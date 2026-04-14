import { useState } from 'react'
import Header from './components/Header'
import Dashboard from './components/Dashboard'

// COLL = colección activa — es el "estado global" más importante de la app
// En React, el estado vive en el componente padre y se pasa hacia abajo
// Analogía: como una variable de sesión en Oracle que todos los procedures pueden leer

function App() {
  const [coll, setColl] = useState('vinyl') // 'vinyl' | 'rum' | 'whisky'

  return (
    <>
      <Header coll={coll} setColl={setColl} />
      <Dashboard coll={coll} />
    </>
  )
}

export default App
