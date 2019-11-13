interface measurement {
  id: string
  label: string
  location: 'indoor' | 'outdoor'
  locationEmoji: '🏠' | '🏙️'
  value: number
  unit: string
}
