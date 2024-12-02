import Paper from '@mui/material/Paper';
import { LineChart } from '@mui/x-charts/LineChart';
import { useState, useEffect } from 'react';
import Item from '../interface/Item';
import { MyProp } from '../interface/MyProp';
import { LineSeriesType } from '@mui/x-charts';
import { formatTime } from '../utils/utils';

const uData = [4000, 3000, 2000, 2780, 1890, 2390, 3490];
const pData = [2400, 1398, 9800, 3908, 4800, 3800, 4300];
const xLabels = [
    'Page A',
    'Page B',
    'Page C',
    'Page D',
    'Page E',
    'Page F',
    'Page G',
];

export default function LineChartWeather(props: MyProp) {
    const [rows, setRows] = useState<Item[]>([])

    const [dateRanges, setDateRanges] = useState<string[]>([])
    const [humidity, setHumidity] = useState<number[]>([])
    const [precipitation, setPrecipitation] = useState<number[]>([])
    const [clouds, setClouds] = useState<number[]>([])
    useEffect(() => {
        setRows(props.itemsIn)
        console.log(rows)
        const humidityArray: number[] = []
        const precipitationArray: number[] = []
        const cloudsArray: number[] = []
        const dateRangesArray: string[] = []
        rows.forEach((row) => {
            humidityArray.push(parseFloat(row.humidity) ?? 0)
            precipitationArray.push(parseInt(row.precipitation) ?? 0)
            cloudsArray.push(parseInt(row.clouds) ?? 0)
            const startDate = new Date(row.dateStart)
            const endDate = new Date(row.dateEnd)
            console.log(row)
            const startTime = formatTime(startDate);
            const endTime = formatTime(endDate);
            const timeRange = `${startTime}\n - \n ${endTime}`;
            dateRangesArray.push(timeRange);
        })
        setHumidity(humidityArray)
        setPrecipitation(precipitationArray)
        setClouds(cloudsArray)
        setDateRanges(dateRangesArray)
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
                width={400}
                height={250}
                series={[
                    { data: humidity, label: 'Humedad' },
                    { data: clouds, label: 'Nubosidad' },
                ]}
                xAxis={[{ scaleType: 'point', data: dateRanges }]}
            />
        </Paper>
    );
}