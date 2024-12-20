import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useRef } from 'react';

export default function ControlWeather({updateMetric}: {updateMetric: (idx: number)=> void}) {

    {/* Arreglo de objetos */ }
    let items = [
        // { "name": "Precipitación", "description": "Cantidad de agua que cae sobre una superficie en un período específico." },
        //{ "name": "Precipitación", "description": "Cantidad de agua que cae sobre una superficie en un período específico." },
        { "name": "Todos", "description": "Vista General." },
        
        { "name": "Temperatura", "description": "Medida de calor o frío expresada en grados Celsius (°C), indicando la energía térmica del ambiente." },
        { "name": "Viento", "description": "Velocidad del aire en movimiento, medida en metros por segundo (m/s), indicando la intensidad del flujo de aire." },
        { "name": "Humedad", "description": "Cantidad de vapor de agua presente en el aire, generalmente expresada como un porcentaje." },
        { "name": "Nubosidad", "description": "Grado de cobertura del cielo por nubes, afectando la visibilidad y la cantidad de luz solar recibida." }
    ]

    {/* Variable de estado y función de actualización */ }
    

    {/* Constante de referencia a un elemento HTML */ }
    const descriptionRef = useRef<HTMLDivElement>(null);

    {/* Arreglo de elementos JSX */ }
    let options = items.map((item, key) => <MenuItem key={key} value={key}>{item["name"]}</MenuItem>)

    {/* Manejador de eventos */ }
    const handleChange = (event: SelectChangeEvent) => {

        let idx = parseInt(event.target.value)

        if(idx < 0) {
            updateMetric(0)
        }
        else {
            updateMetric(idx)
        }
        {/* Modificación de la referencia descriptionRef */ }
        if (descriptionRef.current !== null) {
            descriptionRef.current.innerHTML = (idx >= 0) ? items[idx]["description"] : ""
        }
    };

    {/* JSX */ }
    return (
        <Paper
            sx={{
                p: 2,
                display: 'flex',
                height: '350px',
                flexDirection: 'column'
            }}
        >

            <Typography mb={2} component="h3" variant="h6" color="primary">
                Variables Meteorológicas
            </Typography>

            <Box sx={{ minWidth: 120 }}>

                <FormControl fullWidth>
                    <InputLabel id="simple-select-label">Variables</InputLabel>
                    <Select
                        labelId="simple-select-label"
                        id="simple-select"
                        label="Variables"
                        defaultValue='-1'
                        onChange={handleChange}
                    >
                        <MenuItem key="-1" value="-1" disabled>Seleccione una variable</MenuItem>

                        {options}

                    </Select>
                </FormControl>

            </Box>

            {/* Use la variable de estado para renderizar del item seleccionado 
            <Typography mt={2} component="p" color="text.secondary">
                {
                    (selected >= 0) ? items[selected]["description"] : ""
                }
            </Typography>
            */}
            <Typography ref={descriptionRef} mt={2} component="p" color="text.secondary" />
				

        </Paper>


    )
}