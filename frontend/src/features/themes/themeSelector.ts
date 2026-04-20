import { RootState } from '../../store';

export const selectThemeMode = (state: RootState): boolean => state.theme.mode