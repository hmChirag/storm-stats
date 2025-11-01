import { useState } from 'react';
import { CloudSun, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CityCard } from '@/components/CityCard';
import { SearchBar } from '@/components/SearchBar';
import { WeatherDetail } from '@/components/WeatherDetail';
import { SettingsPanel } from '@/components/SettingsPanel';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { fetchWeatherByCity } from '@/store/weatherSlice';

const Index = () => {
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const favorites = useAppSelector((state) => state.favorites.cities);
  const dispatch = useAppDispatch();

  const handleRefreshAll = () => {
    favorites.forEach(city => {
      dispatch(fetchWeatherByCity(city));
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-primary to-accent rounded-lg">
                <CloudSun className="h-8 w-8 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Weather Analytics
                </h1>
                <p className="text-sm text-muted-foreground">Real-time weather insights for your favorite cities</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="icon"
                onClick={handleRefreshAll}
                title="Refresh all cities"
              >
                <RefreshCw className="h-5 w-5" />
              </Button>
              <SettingsPanel />
            </div>
          </div>
          
          <SearchBar />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <CloudSun className="h-24 w-24 text-muted-foreground mb-6" />
            <h2 className="text-2xl font-bold mb-2">No Cities Added Yet</h2>
            <p className="text-muted-foreground mb-6">
              Search and add cities to start tracking weather data
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Your Cities</h2>
              <p className="text-sm text-muted-foreground">
                Updates every 60 seconds • {favorites.length} {favorites.length === 1 ? 'city' : 'cities'}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((city) => (
                <CityCard 
                  key={city} 
                  city={city}
                  onClick={() => setSelectedCity(city)}
                />
              ))}
            </div>
          </>
        )}
      </main>

      {/* Weather Detail Modal */}
      {selectedCity && (
        <WeatherDetail 
          city={selectedCity}
          open={!!selectedCity}
          onClose={() => setSelectedCity(null)}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-border mt-20 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Weather data powered by OpenWeatherMap API</p>
          <p className="mt-2">Built with React, Redux Toolkit & Recharts</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
