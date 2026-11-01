import { useContext } from 'react';
import { MusicContext, type MusicContextType } from './musicContextDef';

export function useMusic(): MusicContextType {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
}
