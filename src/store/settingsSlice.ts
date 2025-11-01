import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type TemperatureUnit = 'celsius' | 'fahrenheit';

interface SettingsState {
  temperatureUnit: TemperatureUnit;
}

const loadSettings = (): SettingsState => {
  const stored = localStorage.getItem('weather_settings');
  return stored ? JSON.parse(stored) : { temperatureUnit: 'celsius' };
};

const initialState: SettingsState = loadSettings();

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setTemperatureUnit: (state, action: PayloadAction<TemperatureUnit>) => {
      state.temperatureUnit = action.payload;
      localStorage.setItem('weather_settings', JSON.stringify(state));
    },
  },
});

export const { setTemperatureUnit } = settingsSlice.actions;
export default settingsSlice.reducer;
