import { useState, useEffect, useRef } from 'react';
import { Search, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAppDispatch } from '@/store/hooks';
import { addFavorite } from '@/store/favoritesSlice';
import { toast } from 'sonner';

interface Suggestion {
  name: string;
  state?: string;
  country?: string;
  lat: number;
  lon: number;
  displayName: string;
}

const CitySearch = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const dispatch = useAppDispatch();
  const abortRef = useRef<AbortController | null>(null);

  const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY as string;
  const GEOCODE_URL = 'https://api.openweathermap.org/geo/1.0/direct';

  useEffect(() => {
    if (!API_KEY) {
      console.warn('VITE_OPENWEATHER_API_KEY not set. Autocomplete disabled.');
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    if (query.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const timer = setTimeout(async () => {
      if (abortRef.current) abortRef.current.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const url = `${GEOCODE_URL}?q=${encodeURIComponent(query)}&limit=5&appid=${API_KEY}`;
        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) throw new Error(`Geocode API ${res.status}`);
        const data = (await res.json()) as any[];
        const mapped = data.map((d) => {
          const displayName = d.state
            ? `${d.name}, ${d.state}, ${d.country}`
            : `${d.name}, ${d.country}`;
          return {
            name: d.name,
            state: d.state,
            country: d.country,
            lat: d.lat,
            lon: d.lon,
            displayName,
          } as Suggestion;
        });
        setSuggestions(mapped);
        setShowSuggestions(mapped.length > 0);
      } catch (err) {
        if ((err as any).name === 'AbortError') return;
        console.error('Geocode error', err);
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => {
      clearTimeout(timer);
    };
  }, [query, API_KEY]);

  const handleSearch = (city: string | Suggestion) => {
    const name = typeof city === 'string' ? city.trim() : city.displayName;
    if (!name) return;
    dispatch(addFavorite(name));
    toast.success(`Added ${name} to your favorites`);
    setQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search for a city..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 bg-card border-border"
          />
        </div>
        <Button type="submit" className="bg-primary hover:bg-primary/90">
          Add City
        </Button>
      </form>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-card border border-border rounded-lg shadow-lg overflow-hidden">
          {suggestions.map((city) => (
            <button
              key={`${city.lat}-${city.lon}`}
              onClick={() => handleSearch(city)}
              className="w-full px-4 py-3 text-left hover:bg-accent/10 transition-colors flex items-center gap-2"
            >
              <MapPin className="h-4 w-4 text-primary" />
              <span className="text-foreground">{city.displayName}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CitySearch;
