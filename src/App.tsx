import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Grid2 as Grid} from '@mui/material'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Grid>

    {/* Indicadores */}
    <Grid>Elemento: Indicador 1</Grid>
    <Grid>Elemento: Indicador 2</Grid>
    <Grid>Elemento: Indicador 3</Grid>
    <Grid>Elemento: Indicador 4</Grid>
   
    {/* Tabla */}
    <Grid>Elemento: Tabla</Grid>
   
    {/* Gráfico */}
    <Grid>Elemento: Gráfico 1</Grid>

</Grid>
  )
}

export default App
