export interface WeatherIndicator {
    from: string,
    to: string,
    details: {
        symbol: string,
        precipitation: string,
        windDirection: string,
        windSpeed: string,
        windGust: string,
        temperature: string,
        feels_like: string,
        pressure: string,
        humidity: string,
        clouds: string,
        visibility: string,
    }

}
