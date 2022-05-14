import { useLayoutEffect, useMemo } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles'

import Layout from '@components/Layout';
import { getTheme } from './theme';
import { useViewContext } from '@lib/viewContext';

function AppContent() {
  const { store: { mode } } = useViewContext();
  const myTheme = useMemo(() => createTheme(getTheme(mode)), [mode]);

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