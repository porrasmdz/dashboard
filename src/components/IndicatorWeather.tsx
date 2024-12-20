import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { WeatherIndicator } from "../interface/WeatherIndicator";
import { useEffect, useState } from "react";
import { getDayOfWeek, kelvinToCelsiusString, pcntToString } from "../utils/utils";
import { Box, SvgIcon, SvgIconProps } from "@mui/material";
import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostat';

export default function IndicatorWeather({ weatherInfo }: { weatherInfo: WeatherIndicator[] }) {
    const [weekDay, setWeekDay] = useState<string>("unknown")
    const [temperature, setTemperature] = useState<string>("unknown")
    const [apTemperature, setApTemperature] = useState<string>("unknown")
    const [rain, setRain] = useState<string>("unknown")
    const getAvg = (key: string) => {
        //@ts-ignore
        return weatherInfo.reduce((sum, currVal) => sum + Number(currVal.details[key]), 0) / weatherInfo.length
    }
    useEffect(() => {
        const averages = {
            temperature: getAvg('temperature'),
            feels_like: getAvg('feels_like'),
            precipitation: getAvg('precipitation'),
        }
        setWeekDay(getDayOfWeek(weatherInfo[weatherInfo.length - 1].from))
        setTemperature(kelvinToCelsiusString(averages["temperature"]))
        setApTemperature(kelvinToCelsiusString(averages["feels_like"]))
        setRain(pcntToString(averages["precipitation"]))

    }, [])
    const currentDay = new Intl.DateTimeFormat('es-ES', { weekday: 'long' }).format(new Date());
    const isToday = weekDay.toLowerCase() === currentDay.toLowerCase();

    return (<Paper
        sx={{
            p: '1.2rem 0rem 1.2rem 1rem',
            display: 'flex',
            flexDirection: 'row',
            // background: 'text.secondary'
            backgroundColor: !isToday ? 'slate' : 'text.secondary',
            color: isToday ? 'white' : 'inherit',
        }}
    >
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                textAlign: 'left',
                width: '66%',
                gap: 0
            }}>
            <Typography component="h2" variant="h6"
                color={isToday ? 'white' : 'primary'}
                >
                {weekDay} {isToday && "(Hoy)"}
            </Typography>
            <Typography component="p" variant="h4">
                {temperature}
            </Typography>
            <Typography color={isToday ? 'white' : 'text.secondary'}>
                T. Aparente: {apTemperature}
            </Typography>
            <Typography color={isToday ? 'white' : 'text.secondary'} >
                Prob. Lluvia: {rain}
            </Typography>
        </Box>
        <Box height={'100%'} margin={'auto'} color={'transparent'} >

            <ThermometerIcon
                className="lucide lucide-thermometer"
                fill="none" stroke={isToday ? 'white' : 'black'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                sx={{
                    
                    fontSize: 60,
                    padding: 0,
                    scale: 1.5,
                    margin: 'auto'
                }} />
        </Box>
    </Paper>);
}


const ThermometerIcon: React.FC<SvgIconProps> = (props) => {
    return (
        <SvgIcon {...props} >
            <path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z" />
        </SvgIcon>
    );
};