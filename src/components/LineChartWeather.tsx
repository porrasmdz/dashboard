import Paper from '@mui/material/Paper';
import { LineChart } from '@mui/x-charts/LineChart';
import { useState, useEffect } from 'react';
import Item from '../interface/Item';
import { MyProp } from '../interface/MyProp';
import { LineSeriesType } from '@mui/x-charts';
import { formatTime } from '../utils/utils';


export default function LineChartWeather(props: MyProp) {
    const [rows, setRows] = useState<Item[]>([])
    const metrics = ["all", "humid", "temp", "wind", "cloud"]
    const [dateRanges, setDateRanges] = useState<string[]>([])
    const [humidity, setHumidity] = useState<number[]>([])
    const [precipitation, setPrecipitation] = useState<number[]>([])
    const [temperature, setTemperature] = useState<number[]>([])
    const [wind, setWind] = useState<number[]>([])
    const [clouds, setClouds] = useState<number[]>([])
    const [series, setSeries] = useState<any[]>([])
    useEffect(() => {
        setRows(props.itemsIn)
        const humidityArray: number[] = []
        const precipitationArray: number[] = []
        const cloudsArray: number[] = []
        const temperatureArray: number[] = []
        const windArray: number[] = []
        const dateRangesArray: string[] = []
        rows.forEach((row) => {
            humidityArray.push(parseFloat(row.humidity) ?? 0)
            precipitationArray.push(parseInt(row.precipitation) ?? 0)
            cloudsArray.push(parseInt(row.clouds) ?? 0)
            temperatureArray.push((parseInt(row.temperature) ?? 0) - 273.15)
            windArray.push(parseInt(row.wind) ?? 0)
            const startDate = new Date(row.dateStart)
            const endDate = new Date(row.dateEnd)
            const startTime = formatTime(startDate);
            const endTime = formatTime(endDate);
            const timeRange = `${startTime}\n - \n ${endTime}`;
            dateRangesArray.push(timeRange);
        })

        setHumidity(humidityArray)
        setPrecipitation(precipitationArray)
        setClouds(cloudsArray)
        setDateRanges(dateRangesArray)
        setWind(windArray)
        setTemperature(temperatureArray)

        if (props.selectedMetric === undefined ||
            props.selectedMetric === null ||
            metrics[props.selectedMetric] === 'all') {
            setSeries([
                { data: humidity, label: 'Humedad' },
                { data: temperature, label: 'Temperatura' },
                { data: wind, label: 'Viento' },
                { data: clouds, label: 'Nubosidad' },
            ])
        }
        else if (metrics[props.selectedMetric] === 'humid') {
        
            setSeries([
                { data: humidity, label: 'Humedad' },
                
            ])
        }
        else if (metrics[props.selectedMetric] === 'temp') {
            setSeries([
                { data: temperature, label: 'Temperatura' },
                
            ])

        }
        else if (metrics[props.selectedMetric] === 'wind') {
            setSeries([
                { data: wind, label: 'Viento' },
            ])

        }
        else if (metrics[props.selectedMetric] === 'cloud') {
            setSeries([
                { data: clouds, label: 'Nubosidad' },
            ])
        }
    }, [props])
    return (
        <Paper
            sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column'
            }}
        >

            {/* Componente para un gráfico de líneas */}
            <LineChart
                height={350}
                sx={{
                    width: '100%',
                }}
                series={
                    series
                }
                xAxis={[{ scaleType: 'point', data: dateRanges }]}
            />
        </Paper>
    );
}