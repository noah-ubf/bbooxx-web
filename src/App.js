import { useLayoutEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles'

import { AppContextProvider } from '@lib/appContext';
import { ViewContextProvider } from '@lib/viewContext';
import Layout from '@components/Layout';
import { fetchURI } from '@lib/requests';

const myTheme = createTheme({
});

function App() {

  useLayoutEffect(() => {
    window.addEventListener("beforeunload", function (e) {
      fetchURI('exit');
    })
  });

  return (
    <AppContextProvider>
      <ViewContextProvider>
        <ThemeProvider theme={myTheme}>
          <Layout/>
        </ThemeProvider>
      </ViewContextProvider>
    </AppContextProvider>
  );
}

export default App;