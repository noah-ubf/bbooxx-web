import { createContext, useContext, useMemo, useState } from "react";

const ViewContext = createContext({});

export const ViewContextProvider = ({ children }) => {
  const [showStrongs, setShowStrongs] = useState(false);

  const context = useMemo(() => ({
    store: {
      showStrongs,
    },

    handlers: {
      toggleStrongs: () => setShowStrongs(!showStrongs),
    }
  }), [
    showStrongs,
  ]);

  return <ViewContext.Provider value={context}>{children}</ViewContext.Provider>
}

export const useViewContext = () => useContext(ViewContext);