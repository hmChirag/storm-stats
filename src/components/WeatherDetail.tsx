import { useEffect } from 'react';
import { X, Wind, Droplets, Gauge, Eye, CloudRain, Sunrise, Sunset } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchForecast } from '@/store/weatherSlice';
import { formatTemperature, formatDate, formatTime, getWeatherIconUrl, getWindDirection } from '@/utils/weatherHelpers';
import { TemperatureChart } from './TemperatureChart';
import { HourlyForecast } from './HourlyForecast';

interface WeatherDetailProps {
  city: string;
  open: boolean;
  onClose: () => void;
}

export const WeatherDetail = ({ city, open, onClose }: WeatherDetailProps) => {
  const dispatch = useAppDispatch();
  const weatherData = useAppSelector((state) => state.weather.cities[city]);
  const forecastData = useAppSelector((state) => state.weather.forecasts[city]);
  const temperatureUnit = useAppSelector((state) => state.settings.temperatureUnit);
  const loading = useAppSelector((state) => state.weather.loading[`forecast_${city}`]);

  useEffect(() => {
    if (open && city) {
      dispatch(fetchForecast(city));
    }
  }, [open, city, dispatch]);

  if (!weatherData) return null;

  const dailyForecasts = forecastData?.list
    ? Object.values(
        forecastData.list.reduce((acc: any, item) => {
          const date = formatDate(item.dt);
          if (!acc[date]) {
            acc[date] = {
              date,
              temp_min: item.temp_min,
              temp_max: item.temp_max,
              description: item.description,
              icon: item.icon,
              humidity: item.humidity,
              wind_speed: item.wind_speed,
            };
          } else {
            acc[date].temp_min = Math.min(acc[date].temp_min, item.temp_min);
            acc[date].temp_max = Math.max(acc[date].temp_max, item.temp_max);
          }
          return acc;
        }, {})
      ).slice(0, 7)
    : [];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {weatherData.name}, {weatherData.country}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Weather */}
          <div className="flex items-center justify-between p-6 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg">
            <div className="flex items-center gap-4">
              <img 
                src={getWeatherIconUrl(weatherData.icon)} 
                alt={weatherData.description}
                className="w-24 h-24"
              />
              <div>
                <p className="text-6xl font-bold">
                  {formatTemperature(weatherData.temp, temperatureUnit)}
                </p>
                <p className="text-lg text-muted-foreground capitalize mt-2">
                  {weatherData.description}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Feels like {formatTemperature(weatherData.feels_like, temperatureUnit)}
                </p>
              </div>
            </div>
          </div>

          {/* Detailed Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-card border border-border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Droplets className="h-5 w-5 text-primary" />
                <span className="text-sm text-muted-foreground">Humidity</span>
              </div>
              <p className="text-2xl font-bold">{weatherData.humidity}%</p>
            </div>

            <div className="p-4 bg-card border border-border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Wind className="h-5 w-5 text-primary" />
                <span className="text-sm text-muted-foreground">Wind Speed</span>
              </div>
              <p className="text-2xl font-bold">{weatherData.wind_speed} m/s</p>
              <p className="text-xs text-muted-foreground mt-1">
                {getWindDirection(weatherData.wind_deg)}
              </p>
            </div>

            <div className="p-4 bg-card border border-border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Gauge className="h-5 w-5 text-primary" />
                <span className="text-sm text-muted-foreground">Pressure</span>
              </div>
              <p className="text-2xl font-bold">{weatherData.pressure} hPa</p>
            </div>

            <div className="p-4 bg-card border border-border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Eye className="h-5 w-5 text-primary" />
                <span className="text-sm text-muted-foreground">Visibility</span>
              </div>
              <p className="text-2xl font-bold">
                {(weatherData.visibility / 1000).toFixed(1)} km
              </p>
            </div>
          </div>

          {/* Hourly Forecast */}
          {forecastData && <HourlyForecast forecast={forecastData} />}

          {/* Temperature Chart */}
          {forecastData && <TemperatureChart forecast={forecastData} />}

          {/* 7-Day Forecast */}
          <div>
            <h3 className="text-xl font-bold mb-4">7-Day Forecast</h3>
            <div className="space-y-3">
              {dailyForecasts.map((day: any, index: number) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-4 bg-card border border-border rounded-lg hover:bg-accent/5 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <span className="text-sm font-medium min-w-24">{day.date}</span>
                    <img 
                      src={getWeatherIconUrl(day.icon)} 
                      alt={day.description}
                      className="w-12 h-12"
                    />
                    <span className="text-sm text-muted-foreground capitalize flex-1">
                      {day.description}
                    </span>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <Droplets className="h-4 w-4 text-primary" />
                      <span className="text-sm">{day.humidity}%</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-sm font-semibold">
                        {formatTemperature(day.temp_max, temperatureUnit)}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {formatTemperature(day.temp_min, temperatureUnit)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
