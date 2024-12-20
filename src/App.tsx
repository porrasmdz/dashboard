import './App.css'
import Grid from '@mui/material/Grid2'
import IndicatorWeather from './components/IndicatorWeather'
import TableWeather from './components/TableWeather'
import ControlWeather from './components/ControlWeather'
import LineChartWeather from './components/LineChartWeather'
import { useEffect, useState } from 'react';
import Item from './interface/Item'
import { WeatherIndicator } from './interface/WeatherIndicator'
import { groupIndicatorsDataByDay } from './utils/utils'
import { Box, Typography } from '@mui/material'
import { CloudOutlined } from '@mui/icons-material'


interface Indicator {
  title?: String;
  subtitle?: String;
  value?: String;
}

function App() {


  {/* Variable de estado y función de actualización */ }
  let [indicators, setIndicators] = useState<Array<WeatherIndicator[]>>([])
  let [owm, setOWM] = useState(localStorage.getItem("openWeatherMap"))

  const [items, setItems] = useState<Item[]>([])
  const [selectedMetric, setSelectedMetric] = useState<number>(0);

  {/* Variable de estado y función de actualización */ }
  useEffect(() => {
    let request = async () => {

      {/* Referencia a las claves del LocalStorage: openWeatherMap y expiringTime */ }
      let savedTextXML = localStorage.getItem("openWeatherMap") || "";
      let expiringTime = localStorage.getItem("expiringTime");
      const dataToItems: Item[] = []
      {/* Obtenga la estampa de tiempo actual */ }
      let nowTime = (new Date()).getTime();

      {/* Request */ }
      {/* Verifique si es que no existe la clave expiringTime o si la estampa de tiempo actual supera el tiempo de expiración */ }
      if (expiringTime === null || nowTime > parseInt(expiringTime)) {
        let API_KEY = "2bdab66598aa50c78a535885cffe390d"
        let response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=Guayaquil&mode=xml&appid=${API_KEY}`)
        {/* Tiempo de expiración */ }
        let hours = 0.01
        let delay = hours * 3600000
        let expiringTime = nowTime + delay
        let savedTextXMLRes = await response.text()

        {/* En el LocalStorage, almacene el texto en la clave openWeatherMap, estampa actual y estampa de tiempo de expiración */ }
        localStorage.setItem("openWeatherMap", savedTextXMLRes)
        localStorage.setItem("expiringTime", expiringTime.toString())
        localStorage.setItem("nowTime", nowTime.toString())

        {/* DateTime */ }
        localStorage.setItem("expiringDateTime", new Date(expiringTime).toString())
        localStorage.setItem("nowDateTime", new Date(nowTime).toString())

        {/* Modificación de la variable de estado mediante la función de actualización */ }
        setOWM(savedTextXML)
      }
      //savedTextXML = await response.text();
      if (savedTextXML) {
        {/* XML Parser */ }
        const parser = new DOMParser();
        const xml = parser.parseFromString(savedTextXML, "application/xml");

        {/* Extracción y almacenamiento del contenido del XML agrupada por 4 dias futuros*/ }
        const todayDate = new Date()
        let dataToIndicators: Array<WeatherIndicator[]> = groupIndicatorsDataByDay(savedTextXML, todayDate)

        setIndicators(dataToIndicators)

        let timeList = xml.getElementsByTagName("time") || ""
        if (timeList == undefined) return;

        Array.from(timeList).slice(0, 6).forEach((timeItem: HTMLElement) => {

          const timeFrom = timeItem.getAttribute("from") || ""
          const timeTo = timeItem.getAttribute("to") || ""
          let precipitation = timeItem.getElementsByTagName("precipitation")[0]
          const probability = precipitation.getAttribute("probability") || ""

          let humidity = timeItem.getElementsByTagName("humidity")[0]
          const humidityVal = humidity.getAttribute("value") || ""

          let clouds = timeItem.getElementsByTagName("clouds")[0]
          const cloudsAll = clouds.getAttribute("all") || ""

          let temperature = timeItem.getElementsByTagName("temperature")[0]
          const tVal = temperature.getAttribute("value") || ""
          let wind = timeItem.getElementsByTagName("windSpeed")[0]
          const windVal = wind.getAttribute("mps") || ""

          const resultItem: Item = {
            dateStart: timeFrom,
            dateEnd: timeTo,
            precipitation: probability,
            humidity: humidityVal,
            clouds: cloudsAll,
            wind: windVal,
            temperature: tVal
          }
          dataToItems.push(resultItem)
        });

        {/* Modificación de la variable de estado mediante la función de actualización */ }
        // setIndicators(dataToIndicators)
        setItems(dataToItems)
      }


    }
    request();
  }, [owm])
  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12 }}>
        <Box sx={{
          display: 'flex',
          gap: '12px',
          margin: '0rem 0rem 1.6rem',
        }}>
          <CloudOutlined sx={{
            fontSize: 40
          }} />
          <Typography component={'h1'} variant='h4'>
            Pronóstico del Clima en Guayaquil
          </Typography>
        </Box>

      </Grid>
      {
        indicators
          .map(
            (indicator, idx) => idx < 4 && (
              <Grid key={idx} size={{ xs: 6, lg: 3 }}>
                <IndicatorWeather
                  weatherInfo={indicator} />
              </Grid>
            )
          )
      }

      {/* Indicadores */}

      {/* Tabla */}
      <Grid size={{ xs: 12 }} >
        {/* Grid Anidado */}
        <Grid container spacing={2}>

          <Grid size={{ xs: 12, lg: 8 }}>

            <LineChartWeather itemsIn={items} selectedMetric={selectedMetric}/>
          </Grid>
          <Grid size={{ xs: 12, lg: 4 }}>
            <ControlWeather updateMetric={setSelectedMetric}/>
          </Grid>
        </Grid>
      </Grid>

      {/* Tabla */}
      <Grid size={{ xs: 12 }}>

        <TableWeather itemsIn={items} />
      </Grid>

    </Grid>
  )
}

export default App
