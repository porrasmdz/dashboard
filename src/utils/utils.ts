import moment from "moment-timezone";

export function formatTime(date: Date): string {
  const hours = date.getHours().toString().padStart(2, '0'); // Asegura 2 dígitos
  const minutes = date.getMinutes().toString().padStart(2, '0'); // Asegura 2 dígitos
  return `${hours}:${minutes}`;
}

export function groupIndicatorsDataByDay(rawXML: string, userDate: Date, forecastedDays = 4) {
  moment.tz.setDefault("America/Guayaquil")
  const startDate = new Date(userDate);
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + forecastedDays);
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(rawXML, "application/xml");
  const timeNodes = Array.from(xmlDoc.getElementsByTagName("time"));

  const groupedData: { [key: string]: any } = {};
  timeNodes.forEach(node => {
    const fromAttr = node.getAttribute("from") ?? ""
    const toAttr = node.getAttribute("to") ?? ""
    if (fromAttr === "" || toAttr === "") {
      alert("Error obteniendo atributo to or from de time")
      return;
    }
    const fromDate = new Date(fromAttr);
    const toDate = new Date(toAttr);


    if (moment(fromDate).isSameOrAfter(startDate, "day") &&
      moment(fromDate).isBefore(endDate, "day"))//fromDate >= startDate && fromDate < endDate) {
    {
      const dayKey = fromDate.toISOString().split("T")[0].toString();
      if (!groupedData[dayKey]) {
        groupedData[dayKey] = [];
      }

      const dataObject = {
        from: fromDate,
        to: toDate,
        details: {
          symbol: node.querySelector("symbol")?.getAttribute("name"),
          precipitation: node.querySelector("precipitation")?.getAttribute("probability"),
          windDirection: node.querySelector("windDirection")?.getAttribute("name"),
          windSpeed: node.querySelector("windSpeed")?.getAttribute("mps"),
          windGust: node.querySelector("windGust")?.getAttribute("gust"),
          temperature: node.querySelector("temperature")?.getAttribute("value"),
          feels_like: node.querySelector("feels_like")?.getAttribute("value"),
          pressure: node.querySelector("pressure")?.getAttribute("value"),
          humidity: node.querySelector("humidity")?.getAttribute("value"),
          clouds: node.querySelector("clouds")?.getAttribute("value"),
          visibility: node.querySelector("visibility")?.getAttribute("value")
        }
      };

      groupedData[dayKey].push(dataObject);
    }
  });

  return Object.keys(groupedData)
    .sort()
    .map(key => groupedData[key]);
}

export function kelvinToCelsiusString(temperature: number) {
  const celsius = temperature - 273.15;
  return `${celsius.toFixed(2)}°C`;
}
export function pcntToString(decimal: number): string {
  const percentage = decimal * 100;
  return `${percentage.toFixed(0)}%`;
}
export function getDayOfWeek(dateString: string) {
  const date = new Date(dateString); // Convertir la cadena a un objeto Date
  const formatter = new Intl.DateTimeFormat('es-ES', { weekday: 'long' }); // Formato en español
  return formatter.format(date).charAt(0).toUpperCase() + formatter.format(date).slice(1); // Capitalizar
}