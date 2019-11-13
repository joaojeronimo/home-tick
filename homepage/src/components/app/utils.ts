const measurementSettings = {
  SDS_P1: {
    label: 'PM10',
    unit: 'µg/m³',
  },
  SDS_P2: {
    label: 'PM2.5',
    unit: 'µg/m³',
  },
  humidity: {
    label: 'humidity',
    unit: '%',
  },
  temperature: {
    label: 'temperature',
    unit: '°C',
  },
}

type measurementID = 'SDS_P1' | 'SDS_P2' | 'humidity' | 'temperature'

export const mapMeasurement = (location: 'indoor' | 'outdoor') => ({
  id,
  value,
}: {
  id: measurementID
  value: number
}) => ({
  location,
  locationEmoji: location === 'indoor' ? '🏠' : '🏙️',
  id,
  value,
  ...measurementSettings[id],
})
