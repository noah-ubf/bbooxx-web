import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { fetchURI } from '@lib/requests';

import closeTabMem from './closeTabMem';
import showReferencesMem from './showReferencesMem';
import cloneTabMem from './cloneTabMem';
import searchMem from './searchMem';
import nearChapterDescriptorsMem from './nearChapterDescriptorsMem';
import moveTabMem from './moveTabMem';
import toggleTabMem from './toggleTabMem';
import { defaultTabs, defaultAreas } from './defaults';

const AppContext = createContext({});

const getInitialTabs = () => {
  try {
    return window.localStorage.getItem('tabs')
    ? JSON.parse(window.localStorage.getItem('tabs'))
    : defaultTabs;
  } catch (e) {
    return defaultTabs;
  }
}

const initialTabs = getInitialTabs();

const initialAreas = window.localStorage.getItem('areas')
? JSON.parse(window.localStorage.getItem('areas'))
: defaultAreas;

// When a developer adds new tab to default:
Object.keys(defaultTabs).forEach((tabId) => {
  if (!initialTabs[tabId]) {
    initialTabs[tabId] = defaultTabs[tabId];
    if (initialAreas.every((area) => !area.tabIds.includes(tabId))) {
      initialAreas[initialAreas.length - 1].tabIds.push(tabId);
    }
  }
});

const initialMobileActiveTab = window.localStorage.getItem('mobileActiveTab');

export const AppContextProvider = ({ children }) => {
  const [loaded, setLoaded] = useState(false);
  const [modules, setModules] = useState([]);
  const [tabs, setTabs] = useState(initialTabs);
  const [areas, setAreas] = useState(initialAreas);
  const [mobileActiveTab, setMobileActiveTab] = useState(initialMobileActiveTab || 'modules');
  
  window.localStorage.setItem('mobileActiveTab', mobileActiveTab);
  window.localStorage.setItem('tabs', JSON.stringify(tabs));
  window.localStorage.setItem('areas', JSON.stringify(areas));

  const setActiveTab = (tabId) => {
    setMobileActiveTab(tabId);
    window.location.hash = `#${tabId}`;
  }

  useEffect(() => {
    const onHashChange = () => {
      const hash = window.location.hash.split('/')[0];
      setMobileActiveTab(hash.substring(1));
    }
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  // console.log({areas, tabs, mobileActiveTab});

  const context = useMemo(() => {
    const allData = {loaded, modules, tabs, areas, mobileActiveTab};
    const allSetters = {setLoaded, setModules, setTabs, setAreas, setMobileActiveTab, setActiveTab};

    const loadText = async (descriptor, description, tabId='initial') => {
      const encodedDescriptor = encodeURIComponent(descriptor);
      const data = await fetchURI(`text/${encodedDescriptor}`);
      setTabs({ ...tabs, [tabId]: { ...tabs[tabId], descriptor, description, verses: data } });
      setAreas(areas.map((area) => (
        area.tabIds.indexOf(tabId) !== -1 ? { ...area, activeTab: tabId } : area
      )));
      setActiveTab(tabId);
    };

    return ({
      store: allData,

      getters: {
        getNearChapterDescriptors: nearChapterDescriptorsMem(allData),
      },

      handlers: {
        loadText,
        cloneTab: cloneTabMem(allData, allSetters),
        search: searchMem(allData, allSetters),
        toggleTab: toggleTabMem(allData, allSetters),
        closeTab: closeTabMem(allData, allSetters),
        showReferences: showReferencesMem(allData, allSetters),
        moveTab: moveTabMem(allData, allSetters),

        fetchModules: async () => {
          if (!loaded) {
            const data = await fetchURI('modules');
            setModules(data);
            setLoaded(true);
          }
        },

        loadChapter: async (module, book, chapter, tabId='initial') => {
          const descriptor = `(${module.BibleShortName})${book.FullName}.${chapter}`;
          return loadText(descriptor, descriptor, tabId);
        },

        updateMemo: (tabId, content) => {
          if (!tabs[tabId] || tabs[tabId].type !== 'memo') return;

          if (tabs[tabId].content === content) return;
          setTabs({...tabs, [tabId]: {...tabs[tabId], content}});
        },

        resetTabs: () => {
          window.localStorage.removeItem('mobileActiveTab');
          window.localStorage.removeItem('tabs');
          window.localStorage.removeItem('areas');
          window.location.reload();
        },

        renameTab: (tabId, description) => {
          setTabs({...tabs, [tabId]: {...tabs[tabId], description}});
        },

        shareTab: async (tab) => {
          // const url = `${window.location.origin}/?text=${encodeURIComponent(tab.descriptor)}&title=${encodeURIComponent(tab.description)}`;
          const url = `${window.location.origin}/?text=${tab.descriptor}&title=${tab.description}`;
          // navigator.clipboard.writeText(this.state.textToCopy)}
          if ('clipboard' in navigator) {
            return await navigator.clipboard.writeText(url);
          } else {
            return document.execCommand('copy', true, url);
          }
        },

        copyToCollection: (verse, tabId='collection') => {
          const descr = tabs[tabId].descriptor;
          setTabs({
            ...tabs,
            [tabId]: {
              ...tabs[tabId],
              descriptor: descr ? [descr, verse.descriptor].join(';') : verse.descriptor,
              verses: [...tabs[tabId].verses, verse],
            }
          });
        },

        removeVerse: (pos, tabId) => {
          const newVerses = tabs[tabId].verses.filter((v, i) => (i != pos));

          setTabs({
            ...tabs,
            [tabId]: {
              ...tabs[tabId],
              descriptor: newVerses.map(({descriptor}) => descriptor).join(';'),
              verses: newVerses,
            }
          });
        },

        addToMemo: (verse) => {
          console.log({verse, memo: tabs.memo.content});
          setTabs({
            ...tabs,
            memo: {
              ...tabs.memo,
              content: [
                tabs.memo.content,
                verse.text,
                `<p><strong>${verse.descriptor}</strong></p>`
              ].join(''),
            },
          });
        }
      },
    })}, [
      loaded,
      modules,
      areas,
      tabs,
      mobileActiveTab,
    ]
  );

  return <AppContext.Provider value={context}>{children}</AppContext.Provider>
}

export const useAppContext = () => useContext(AppContext);