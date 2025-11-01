import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

const API_KEY = '3aa8e6c05e4b3b47d8e2e1f69d8b8af7'; // OpenWeatherMap API key
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export interface WeatherData {
  id: number;
  name: string;
  country: string;
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  humidity: number;
  pressure: number;
  wind_speed: number;
  wind_deg: number;
  description: string;
  icon: string;
  clouds: number;
  visibility: number;
  dt: number;
  timezone: number;
}

export interface ForecastData {
  city: string;
  list: Array<{
    dt: number;
    temp: number;
    temp_min: number;
    temp_max: number;
    feels_like: number;
    humidity: number;
    pressure: number;
    wind_speed: number;
    description: string;
    icon: string;
    pop: number;
  }>;
}

interface WeatherState {
  cities: Record<string, WeatherData>;
  forecasts: Record<string, ForecastData>;
  loading: Record<string, boolean>;
  error: Record<string, string | null>;
  lastUpdated: Record<string, number>;
}

const initialState: WeatherState = {
  cities: {},
  forecasts: {},
  loading: {},
  error: {},
  lastUpdated: {},
};

export const fetchWeatherByCity = createAsyncThunk(
  'weather/fetchByCity',
  async (city: string, { getState }) => {
    const state: any = getState();
    const lastUpdate = state.weather.lastUpdated[city];
    const now = Date.now();
    
    // Check if data is less than 60 seconds old
    if (lastUpdate && now - lastUpdate < 60000) {
      return null; // Skip fetch if data is recent
    }

    const response = await axios.get(`${BASE_URL}/weather`, {
      params: {
        q: city,
        appid: API_KEY,
        units: 'metric',
      },
    });

    const data = response.data;
    return {
      id: data.id,
      name: data.name,
      country: data.sys.country,
      temp: data.main.temp,
      feels_like: data.main.feels_like,
      temp_min: data.main.temp_min,
      temp_max: data.main.temp_max,
      humidity: data.main.humidity,
      pressure: data.main.pressure,
      wind_speed: data.wind.speed,
      wind_deg: data.wind.deg,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      clouds: data.clouds.all,
      visibility: data.visibility,
      dt: data.dt,
      timezone: data.timezone,
    };
  }
);

export const fetchForecast = createAsyncThunk(
  'weather/fetchForecast',
  async (city: string) => {
    const response = await axios.get(`${BASE_URL}/forecast`, {
      params: {
        q: city,
        appid: API_KEY,
        units: 'metric',
      },
    });

    const data = response.data;
    return {
      city,
      list: data.list.map((item: any) => ({
        dt: item.dt,
        temp: item.main.temp,
        temp_min: item.main.temp_min,
        temp_max: item.main.temp_max,
        feels_like: item.main.feels_like,
        humidity: item.main.humidity,
        pressure: item.main.pressure,
        wind_speed: item.wind.speed,
        description: item.weather[0].description,
        icon: item.weather[0].icon,
        pop: item.pop,
      })),
    };
  }
);

export const searchCities = createAsyncThunk(
  'weather/searchCities',
  async (query: string) => {
    const response = await axios.get(`http://api.openweathermap.org/geo/1.0/direct`, {
      params: {
        q: query,
        limit: 5,
        appid: API_KEY,
      },
    });
    return response.data;
  }
);

const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {
    clearError: (state, action: PayloadAction<string>) => {
      delete state.error[action.payload];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeatherByCity.pending, (state, action) => {
        state.loading[action.meta.arg] = true;
        state.error[action.meta.arg] = null;
      })
      .addCase(fetchWeatherByCity.fulfilled, (state, action) => {
        const city = action.meta.arg;
        state.loading[city] = false;
        if (action.payload) {
          state.cities[city] = action.payload;
          state.lastUpdated[city] = Date.now();
        }
      })
      .addCase(fetchWeatherByCity.rejected, (state, action) => {
        const city = action.meta.arg;
        state.loading[city] = false;
        state.error[city] = action.error.message || 'Failed to fetch weather data';
      })
      .addCase(fetchForecast.pending, (state, action) => {
        state.loading[`forecast_${action.meta.arg}`] = true;
      })
      .addCase(fetchForecast.fulfilled, (state, action) => {
        const city = action.meta.arg;
        state.loading[`forecast_${city}`] = false;
        state.forecasts[city] = action.payload;
      })
      .addCase(fetchForecast.rejected, (state, action) => {
        const city = action.meta.arg;
        state.loading[`forecast_${city}`] = false;
        state.error[`forecast_${city}`] = action.error.message || 'Failed to fetch forecast';
      });
  },
});

export const { clearError } = weatherSlice.actions;
export default weatherSlice.reducer;
