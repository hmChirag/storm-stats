import { useAppSelector } from '@/store/hooks';
import { formatTime, formatTemperature, getWeatherIconUrl } from '@/utils/weatherHelpers';
import { ForecastData } from '@/store/weatherSlice';
import { ScrollArea } from '@/components/ui/scroll-area';

interface HourlyForecastProps {
  forecast: ForecastData;
}

export const HourlyForecast = ({ forecast }: HourlyForecastProps) => {
  const temperatureUnit = useAppSelector((state) => state.settings.temperatureUnit);

  const hourlyData = forecast.list.slice(0, 12); // Next 36 hours

  return (
    <div className="p-6 bg-card border border-border rounded-lg">
      <h3 className="text-xl font-bold mb-4">Hourly Forecast</h3>
      <ScrollArea className="w-full">
        <div className="flex gap-4 pb-4">
          {hourlyData.map((item, index) => (
            <div 
              key={index}
              className="flex flex-col items-center gap-2 p-4 bg-accent/5 border border-border rounded-lg min-w-[100px] hover:bg-accent/10 transition-colors"
            >
              <span className="text-sm font-medium">
                {formatTime(item.dt)}
              </span>
              <img 
                src={getWeatherIconUrl(item.icon)} 
                alt={item.description}
                className="w-12 h-12"
              />
              <span className="text-lg font-bold">
                {formatTemperature(item.temp, temperatureUnit)}
              </span>
              <span className="text-xs text-muted-foreground">
                {Math.round(item.pop * 100)}% rain
              </span>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
