import { useState, useEffect } from 'react';
import { Cloud, Heart, Droplets, Wind, Eye } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchWeatherByCity } from '@/store/weatherSlice';
import { addFavorite, removeFavorite } from '@/store/favoritesSlice';
import { formatTemperature, getWeatherIconUrl, getWeatherCondition } from '@/utils/weatherHelpers';
import { cn } from '@/lib/utils';

interface CityCardProps {
  city: string;
  onClick?: () => void;
}

export const CityCard = ({ city, onClick }: CityCardProps) => {
  const dispatch = useAppDispatch();
  const weatherData = useAppSelector((state) => state.weather.cities[city]);
  const loading = useAppSelector((state) => state.weather.loading[city]);
  const favorites = useAppSelector((state) => state.favorites.cities);
  const temperatureUnit = useAppSelector((state) => state.settings.temperatureUnit);
  const isFavorite = favorites.includes(city);

  useEffect(() => {
    dispatch(fetchWeatherByCity(city));
    
    const interval = setInterval(() => {
      dispatch(fetchWeatherByCity(city));
    }, 60000); // Refresh every 60 seconds

    return () => clearInterval(interval);
  }, [city, dispatch]);

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isFavorite) {
      dispatch(removeFavorite(city));
    } else {
      dispatch(addFavorite(city));
    }
  };

  if (loading && !weatherData) {
    return (
      <Card className="p-6 animate-pulse">
        <div className="h-40 bg-muted rounded-lg" />
      </Card>
    );
  }

  if (!weatherData) {
    return null;
  }

  const condition = getWeatherCondition(weatherData.description);
  const gradientClass = condition === 'clear' 
    ? 'bg-gradient-to-br from-accent to-primary' 
    : condition === 'cloudy'
    ? 'bg-gradient-to-br from-muted to-card'
    : 'bg-gradient-to-br from-primary to-secondary';

  return (
    <Card 
      className={cn(
        "group relative overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl",
        "border-border/50 backdrop-blur-sm"
      )}
      onClick={onClick}
    >
      <div className={cn("absolute inset-0 opacity-10", gradientClass)} />
      
      <div className="relative p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-2xl font-bold text-foreground">{weatherData.name}</h3>
            <p className="text-sm text-muted-foreground">{weatherData.country}</p>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={handleFavoriteToggle}
            className="hover:bg-background/50"
          >
            <Heart className={cn("h-5 w-5", isFavorite && "fill-destructive text-destructive")} />
          </Button>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <img 
              src={getWeatherIconUrl(weatherData.icon)} 
              alt={weatherData.description}
              className="w-20 h-20"
            />
            <div>
              <p className="text-5xl font-bold text-foreground">
                {formatTemperature(weatherData.temp, temperatureUnit)}
              </p>
              <p className="text-sm text-muted-foreground capitalize mt-1">
                {weatherData.description}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Droplets className="h-4 w-4 text-primary" />
            <div>
              <p className="text-muted-foreground">Humidity</p>
              <p className="font-semibold">{weatherData.humidity}%</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Wind className="h-4 w-4 text-primary" />
            <div>
              <p className="text-muted-foreground">Wind</p>
              <p className="font-semibold">{weatherData.wind_speed} m/s</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4 text-primary" />
            <div>
              <p className="text-muted-foreground">Visibility</p>
              <p className="font-semibold">{(weatherData.visibility / 1000).toFixed(1)} km</p>
            </div>
          </div>
        </div>

        <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm rounded-full px-3 py-1">
          <Cloud className="h-4 w-4 inline mr-1" />
          <span className="text-xs font-medium">{weatherData.clouds}%</span>
        </div>
      </div>
    </Card>
  );
};
