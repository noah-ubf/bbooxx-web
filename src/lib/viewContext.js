import { createContext, useContext, useMemo, useState } from "react";

const ViewContext = createContext({});

export const ViewContextProvider = ({ children }) => {
  const [showStrongs, setShowStrongs] = useState(false);
  const [loading, setLoading] = useState(false);

  const context = useMemo(() => ({
    store: {
      showStrongs,
      loading,
    },

    handlers: {
      toggleStrongs: () => setShowStrongs(!showStrongs),
      startLoading: () => setLoading(true),
      finishLoading: () => setLoading(false),
    }
  }), [
    loading,
    showStrongs,
  ]);

  return <ViewContext.Provider value={context}>{children}</ViewContext.Provider>
}

export const useViewContext = () => useContext(ViewContext);