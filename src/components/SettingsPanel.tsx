import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setTemperatureUnit } from '@/store/settingsSlice';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const SettingsPanel = () => {
  const dispatch = useAppDispatch();
  const temperatureUnit = useAppSelector((state) => state.settings.temperatureUnit);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Settings className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Temperature Unit</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => dispatch(setTemperatureUnit('celsius'))}
          className={temperatureUnit === 'celsius' ? 'bg-accent' : ''}
        >
          Celsius (°C)
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => dispatch(setTemperatureUnit('fahrenheit'))}
          className={temperatureUnit === 'fahrenheit' ? 'bg-accent' : ''}
        >
          Fahrenheit (°F)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
