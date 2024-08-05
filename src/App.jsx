import { create } from 'zustand';
import './App.css';
import Artists from './components/Artists';
import Cursor from './components/Cursor';
import LoaderCustom from './components/LoaderCustom';
import { HelmetProvider } from 'react-helmet-async';
import SEOHelmet from './components/seo/SEOHelmet';

export const useStore = create((set) => ({
  activeCursor: false,
  setActiveCursor: (activeCursor) => set({ activeCursor }),
  isLoaded: false,
  setIsLoaded: (isLoaded) => set({ isLoaded }),
  isScrollLocked: false,
  setIsScrollLocked: (isScrollLocked) => set({ isScrollLocked }),
  totalAssets: 15,
  textures: {},
  setTextures: (key, texture) =>
    set((state) => ({
      textures: { ...state.textures, [key]: texture },
    })),
}));

function App() {
  const isLoaded = useStore((state) => state.isLoaded);

  return (
    <>
      <HelmetProvider>
        <SEOHelmet />
        {!isLoaded && <LoaderCustom />}
        <Artists />
        <Cursor />
      </HelmetProvider>
    </>
  );
}

export default App;
