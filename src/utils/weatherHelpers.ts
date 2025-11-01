export const celsiusToFahrenheit = (celsius: number): number => {
  return (celsius * 9/5) + 32;
};

export const formatTemperature = (temp: number, unit: 'celsius' | 'fahrenheit'): string => {
  const displayTemp = unit === 'fahrenheit' ? celsiusToFahrenheit(temp) : temp;
  return `${Math.round(displayTemp)}°${unit === 'celsius' ? 'C' : 'F'}`;
};

export const getWeatherIconUrl = (iconCode: string): string => {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
};

export const formatDate = (timestamp: number): string => {
  return new Date(timestamp * 1000).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
};

export const formatTime = (timestamp: number): string => {
  return new Date(timestamp * 1000).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
};

export const getWeatherCondition = (description: string): string => {
  const lower = description.toLowerCase();
  if (lower.includes('clear')) return 'clear';
  if (lower.includes('cloud')) return 'cloudy';
  if (lower.includes('rain') || lower.includes('drizzle')) return 'rainy';
  if (lower.includes('snow')) return 'snowy';
  if (lower.includes('thunder')) return 'stormy';
  if (lower.includes('mist') || lower.includes('fog')) return 'foggy';
  return 'default';
};

export const getWindDirection = (degrees: number): string => {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(degrees / 45) % 8;
  return directions[index];
};
