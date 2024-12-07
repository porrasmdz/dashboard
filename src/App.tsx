import './App.css'
import Grid from '@mui/material/Grid2'
import IndicatorWeather from './components/IndicatorWeather'
import TableWeather from './components/TableWeather'
import ControlWeather from './components/ControlWeather'
import LineChartWeather from './components/LineChartWeather'
import { useEffect, useState } from 'react';
import Item from './interface/Item'


interface Indicator {
  title?: String;
  subtitle?: String;
  value?: String;
}

function App() {


  {/* Variable de estado y función de actualización */ }
  let [indicators, setIndicators] = useState<Indicator[]>([])
  let [owm, setOWM] = useState(localStorage.getItem("openWeatherMap"))

  const [items, setItems] = useState<Item[]>([])

  {/* Variable de estado y función de actualización */ }
  useEffect(() => {
    let request = async () => {

      {/* Referencia a las claves del LocalStorage: openWeatherMap y expiringTime */ }
      let savedTextXML = localStorage.getItem("openWeatherMap") || "";
      let expiringTime = localStorage.getItem("expiringTime");
      const dataToItems : Item[] = []
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

        {/* Arreglo para agregar los resultados */ }

        let dataToIndicators: Indicator[] = new Array<Indicator>();

        {/* 
          Análisis, extracción y almacenamiento del contenido del XML 
          en el arreglo de resultados
        */}

        let name = xml.getElementsByTagName("name")[0].innerHTML || ""
        dataToIndicators.push({ "title": "Location", "subtitle": "City", "value": name })

        let location = xml.getElementsByTagName("location")[1]

        let latitude = location.getAttribute("latitude") || ""
        dataToIndicators.push({ "title": "Location", "subtitle": "Latitude", "value": latitude })

        let longitude = location.getAttribute("longitude") || ""
        dataToIndicators.push({ "title": "Location", "subtitle": "Longitude", "value": longitude })

        let altitude = location.getAttribute("altitude") || ""
        dataToIndicators.push({ "title": "Location", "subtitle": "Altitude", "value": altitude })

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
          const resultItem : Item = {
            dateStart: timeFrom,
            dateEnd: timeTo,
            precipitation: probability,
            humidity: humidityVal,
            clouds: cloudsAll
          } 
          dataToItems.push(resultItem)
        });
        
        {/* Modificación de la variable de estado mediante la función de actualización */ }
        setIndicators(dataToIndicators)
        setItems(dataToItems)
      }


    }
    request();
  }, [owm])
  return (
    <Grid container spacing={5}>
      {/* Indicadores */}
      {/* <Grid size=> ... </Grid> */}
      {/*     <Grid size={{ xs: 12, lg: 3 }}><IndicatorWeather title={'Indicator 1'} subtitle={'Unidad 1'} value={"1.23"} /></Grid>
      <Grid size={{ xs: 12, lg: 3 }}><IndicatorWeather title={'Indicator 2'} subtitle={'Unidad 2'} value={"3.12"} /></Grid>
      <Grid size={{ xs: 12, lg: 3 }}><IndicatorWeather title={'Indicator 3'} subtitle={'Unidad 3'} value={"2.31"} /></Grid>
      <Grid size={{ xs: 12, lg: 3 }}><IndicatorWeather title={'Indicator 4'} subtitle={'Unidad 4'} value={"3.21"} /></Grid>
      */}
      {
        indicators
          .map(
            (indicator, idx) => (
              <Grid key={idx} size={{ xs: 12, lg: 3 }}>
                <IndicatorWeather
                  title={indicator["title"]}
                  subtitle={indicator["subtitle"]}
                  value={indicator["value"]} />
              </Grid>
            )
          )
      }

      {/* Indicadores */}

      {/* Tabla */}
      <Grid size={{ xs: 12, lg: 8 }}>
        {/* Grid Anidado */}
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, lg: 3 }}>
            <ControlWeather />
          </Grid>
          <Grid size={{ xs: 12, lg: 9 }}>
            <TableWeather itemsIn={items}/>
          </Grid>
        </Grid>
      </Grid>

      {/* Gráfico */}
      <Grid size={{ xs: 12, lg: 4 }}>
        <LineChartWeather itemsIn={items} />
      </Grid>

    </Grid>
  )
}

export default App
