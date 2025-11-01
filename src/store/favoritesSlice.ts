import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FavoritesState {
  cities: string[];
}

const loadFavorites = (): string[] => {
  const stored = localStorage.getItem('weather_favorites');
  return stored ? JSON.parse(stored) : ['London', 'New York', 'Tokyo', 'Paris'];
};

const initialState: FavoritesState = {
  cities: loadFavorites(),
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    addFavorite: (state, action: PayloadAction<string>) => {
      if (!state.cities.includes(action.payload)) {
        state.cities.push(action.payload);
        localStorage.setItem('weather_favorites', JSON.stringify(state.cities));
      }
    },
    removeFavorite: (state, action: PayloadAction<string>) => {
      state.cities = state.cities.filter(city => city !== action.payload);
      localStorage.setItem('weather_favorites', JSON.stringify(state.cities));
    },
    reorderFavorites: (state, action: PayloadAction<string[]>) => {
      state.cities = action.payload;
      localStorage.setItem('weather_favorites', JSON.stringify(state.cities));
    },
  },
});

export const { addFavorite, removeFavorite, reorderFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;
