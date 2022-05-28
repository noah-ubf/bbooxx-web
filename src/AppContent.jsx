import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles'

import Layout from '@components/Layout';
import { getTheme } from './theme';
import { useViewContext } from '@lib/viewContext';
import {useAppContext} from "@lib/appContext";

function AppContent() {
  const { store: { mode } } = useViewContext();
  const { handlers: { toggleTab, getActiveTab } } = useAppContext();
  const myTheme = useMemo(() => createTheme(getTheme(mode)), [mode]);

  const hash = window.location.hash.split('/')[0];
  const id = hash.substring(1);
  const idRef = useRef();
  const toggleTabRef = useRef();
  idRef.current = id;
  toggleTabRef.current = toggleTab;

  useEffect(() => {
    // console.log('USE_EFFECT', id)
    // toggleTab(idRef.current);
    const onHashChange = () => {
      // console.log('HASH CHANGE:', idRef.current);
      // const activeTab = getActiveTab();
      // if (!activeTab || activeTab.id !== id) {
        toggleTabRef.current(idRef.current);
      // }
    }
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, [toggleTab, getActiveTab, id]);

  useLayoutEffect(() => {
    document.body.style.background = mode === 'light' ? '#ffffff' : '#000000';
  }, [mode]);

  return (
    <ThemeProvider theme={myTheme}>
      <Layout/>
    </ThemeProvider>
  );
}

export default AppContent;