import { useLayoutEffect } from 'react';

import AppContent from './AppContent';
import { AppContextProvider } from '@lib/appContext';
import { ViewContextProvider } from '@lib/viewContext';
import { fetchURI } from '@lib/requests';

function App() {
  useLayoutEffect(() => {
    window.addEventListener("beforeunload", function (e) {
      fetchURI('exit');
    })
  });

  return (
    <AppContextProvider>
      <ViewContextProvider>
        <AppContent/>
      </ViewContextProvider>
    </AppContextProvider>
  );
}

export default App;