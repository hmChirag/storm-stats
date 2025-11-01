import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useAppSelector } from '@/store/hooks';
import { formatDate, formatTemperature, celsiusToFahrenheit } from '@/utils/weatherHelpers';
import { ForecastData } from '@/store/weatherSlice';

interface TemperatureChartProps {
  forecast: ForecastData;
}

export const TemperatureChart = ({ forecast }: TemperatureChartProps) => {
  const temperatureUnit = useAppSelector((state) => state.settings.temperatureUnit);

  const chartData = forecast.list
    .filter((_, index) => index % 4 === 0) // Show every 12 hours
    .slice(0, 14)
    .map((item) => ({
      time: formatDate(item.dt),
      temp: temperatureUnit === 'fahrenheit' ? celsiusToFahrenheit(item.temp) : item.temp,
      feels_like: temperatureUnit === 'fahrenheit' ? celsiusToFahrenheit(item.feels_like) : item.feels_like,
    }));

  return (
    <div className="p-6 bg-card border border-border rounded-lg">
      <h3 className="text-xl font-bold mb-4">Temperature Trend</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis 
            dataKey="time" 
            stroke="hsl(var(--foreground))"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="hsl(var(--foreground))"
            style={{ fontSize: '12px' }}
            label={{ 
              value: temperatureUnit === 'celsius' ? '°C' : '°F', 
              angle: -90, 
              position: 'insideLeft',
              style: { fill: 'hsl(var(--foreground))' }
            }}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
            }}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="temp" 
            stroke="hsl(var(--primary))" 
            strokeWidth={3}
            name="Temperature"
            dot={{ fill: 'hsl(var(--primary))' }}
          />
          <Line 
            type="monotone" 
            dataKey="feels_like" 
            stroke="hsl(var(--accent))" 
            strokeWidth={2}
            strokeDasharray="5 5"
            name="Feels Like"
            dot={{ fill: 'hsl(var(--accent))' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
