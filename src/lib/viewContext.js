import { createContext, useContext, useMemo, useState } from "react";

const ViewContext = createContext({});

export const ViewContextProvider = ({ children }) => {
  const [showStrongs, setShowStrongs] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState(window.localStorage.getItem('mode') || 'light');
  const [topTab, setTopTab] = useState(false);

  const context = useMemo(() => ({
    store: {
      showStrongs,
      loading,
      mode,
      topTab,
    },

    handlers: {
      toggleStrongs: () => setShowStrongs(!showStrongs),
      startLoading: () => setLoading(true),
      finishLoading: () => setLoading(false),
      toggleMode: () => {
        const newMode = mode === 'light' ? 'dark' : 'light';
        setMode(newMode);
        window.localStorage.setItem('mode', newMode);
      },
      setTopTab: (tab=false) => setTopTab(tab),
    }
  }), [
    loading,
    showStrongs,
    mode,
    topTab,
  ]);

  return <ViewContext.Provider value={context}>{children}</ViewContext.Provider>
}

export const useViewContext = () => useContext(ViewContext);