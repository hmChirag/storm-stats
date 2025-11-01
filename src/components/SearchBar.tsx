import { useState, useEffect } from 'react';
import { Search, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAppDispatch } from '@/store/hooks';
import { addFavorite } from '@/store/favoritesSlice';
import { toast } from 'sonner';

export const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const dispatch = useAppDispatch();

  const popularCities = [
    'London', 'New York', 'Tokyo', 'Paris', 'Sydney', 
    'Dubai', 'Singapore', 'Mumbai', 'Toronto', 'Berlin',
    'Madrid', 'Rome', 'Amsterdam', 'Barcelona', 'Seoul'
  ];

  useEffect(() => {
    if (query.length > 0) {
      const filtered = popularCities.filter(city => 
        city.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 5));
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [query]);

  const handleSearch = (city: string) => {
    if (city.trim()) {
      dispatch(addFavorite(city));
      toast.success(`Added ${city} to your favorites`);
      setQuery('');
      setShowSuggestions(false);
    }
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
              key={city}
              onClick={() => handleSearch(city)}
              className="w-full px-4 py-3 text-left hover:bg-accent/10 transition-colors flex items-center gap-2"
            >
              <MapPin className="h-4 w-4 text-primary" />
              <span className="text-foreground">{city}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
