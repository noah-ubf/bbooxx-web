import { createContext, useContext, useMemo, useState } from "react";

const ViewContext = createContext({});

export const ViewContextProvider = ({ children }) => {
  const [showStrongs, setShowStrongs] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState(window.localStorage.getItem('mode') || 'light');

  const context = useMemo(() => ({
    store: {
      showStrongs,
      loading,
      mode,
    },

    handlers: {
      toggleStrongs: () => setShowStrongs(!showStrongs),
      startLoading: () => setLoading(true),
      finishLoading: () => setLoading(false),
      toggleMode: () => {
        const newMode = mode === 'light' ? 'dark' : 'light';
        setMode(newMode);
        window.localStorage.setItem('mode', newMode);
      }
    }
  }), [
    loading,
    showStrongs,
    mode,
  ]);

  return <ViewContext.Provider value={context}>{children}</ViewContext.Provider>
}

export const useViewContext = () => useContext(ViewContext);