import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { fetchURI } from '@lib/requests';
import { getDescriptorFromList, parseDescriptor } from "@lib/descriptor";

const AppContext = createContext({});

const initialTabs = window.localStorage.getItem('tabs')
? JSON.parse(window.localStorage.getItem('tabs'))
: {
  modules: {
    id: 'modules',
    type: 'modules',
    description: {i18n: 'library'},
    locked: true,
  },
  initial: {
    id: 'initial',
    locked: true,
    description: '*',
    verses: [],
  },
  memo: {
    id: 'memo',
    type: 'memo',
    description: {i18n: 'notes'},
    locked: true,
  },
  settings: {
    id: 'settings',
    type: 'settings',
    description: {i18n: 'settings'},
    locked: true,
    hidden: true,
  },
};

const initialAreas = window.localStorage.getItem('areas')
? JSON.parse(window.localStorage.getItem('areas'))
: [
  {
    id: 'leftCol',
    activeTab: 'modules',
    tabIds: ['modules'],
  },
  {
    id: 'centerCol',
    activeTab: 'initial',
    tabIds: ['initial'],
  },
  {
    id: 'rightCol',
    activeTab: 'memo',
    tabIds: ['memo'],
  },
  {
    id: 'bottomCol',
    activeTab: null,
    tabIds: [],
  },
];

const initialMobileActiveTab = window.localStorage.getItem('mobileActiveTab');


let ID = new Date().getTime();
const getId = () => {
  return `${ID++}`;
}

export const AppContextProvider = ({ children }) => {
  const [loaded, setLoaded] = useState(false);
  const [modules, setModules] = useState([]);
  const [tabs, setTabs] = useState(initialTabs);
  const [areas, setAreas] = useState(initialAreas);
  const [mobileActiveTab, setMobileActiveTab] = useState(initialMobileActiveTab || 'modules');
  const [mobileAppView, setMobileAppView] = useState('content');
  
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
    const loadText = async (descriptor, description, tabId='initial') => {
      const encodedDescriptor = encodeURIComponent(descriptor);
      const data = await fetchURI(`text/${encodedDescriptor}`);
      setTabs({ ...tabs, [tabId]: { ...tabs[tabId], descriptor, description, verses: data } });
      setAreas(areas.map((area) => (
        area.tabIds.indexOf(tabId) !== -1 ? { ...area, activeTab: tabId } : area
      )));
      setMobileAppView('content');
      setActiveTab(tabId);
    };

    return ({
      store: {
        loaded,
        modules,
        tabs,
        areas,
        mobileActiveTab,
        mobileAppView,
      },

      getters: {
        getNearChapterDescriptors: (descriptor) => {
          const parsed = parseDescriptor(descriptor);
          if (parsed.length !== 1 || parsed[0].verses) return null; // only 1 chapter is supported
          const { module, book, chapter } = parsed[0];
          const currentModule = modules.find(m => m.BibleShortName === module);
          if (!currentModule) return null;
          const bookIndex = currentModule.books.findIndex((b) => b.FullName === book || b.ShortName.indexOf(book) !== -1);
          if (bookIndex === -1) return null;

          const prev = chapter > 1
            ? { bookIndex, chapter: chapter - 1 }
            : bookIndex === 0
              ? null
              : { bookIndex: bookIndex-1, chapter: currentModule.books[bookIndex-1].ChapterQty };

          const next = chapter < currentModule.books[bookIndex].ChapterQty
            ? { bookIndex, chapter: chapter + 1 }
            : bookIndex === currentModule.books.length - 1
              ? null
              : { bookIndex: bookIndex+1, chapter: 1 };

          const prevBook = prev && currentModule.books[prev.bookIndex];
          const nextBook = next && currentModule.books[next.bookIndex];
          const prevDescriptor = prev && `(${module})${prevBook.FullName}.${prev.chapter}`;
          const nextDescriptor = next && `(${module})${nextBook.FullName}.${next.chapter}`;
  
          return {
            prev: prev && {module, book: prevBook.FullName, chapter: prev.chapter, descriptor: prevDescriptor},
            current: {module, book, chapter, descriptor},
            next: next && {module, book: nextBook.FullName, chapter: next.chapter, descriptor: nextDescriptor},
          };
          },
      },

      handlers: {
        setAppView: (view) => setMobileAppView(view),

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

        loadText,

        cloneTab: (tabId, clean) => {
          if (!tabs[tabId]) return;
          const newTabId = getId();
          const newTab = { ...tabs[tabId], id: newTabId, locked: true };
          const newTabs = {
            ...tabs,
            [newTabId]: newTab,
            [tabId]: (clean ? {...tabs[tabId], descriptor: '', description: '*', verses: []} : tabs[tabId])
          };

          setTabs(newTabs);

          setAreas(areas.map((area) => {
            if (area.tabIds.indexOf(tabId) === -1) return area;
            return { ...area, tabIds: [...area.tabIds, newTabId], activeTab: newTabId };
          }));

          setTimeout(() => {
            setTabs({
              ...newTabs,
              [newTabId]: {...newTab, locked: false},
            });
            }, 2000);
        },

        search: async (module, text) => {
          if (!text || text === '') return;
          const data = await fetchURI(`modules/${module.BibleShortName}/search/${encodeURIComponent(text)}`);
          const newTabId = getId();
          const newTab = {
            id: newTabId,
            descriptor: getDescriptorFromList(data),
            description: {i18n: 'searchResults', params: {module: module.BibleShortName, text}},
            verses: data
          };
          setTabs({...tabs, [newTabId]: newTab});
          setAreas(areas.map((area) => (
            area.id === 'centerCol' ? { ...area, tabIds: [...area.tabIds, newTabId], activeTab: newTabId } : area
          )));
          setActiveTab(newTabId);
          setMobileAppView('content');
        },

        toggleTab: (tabId) => {
          setAreas(areas.map((area) => (
            area.tabIds.indexOf(tabId) !== -1 ? { ...area, activeTab: tabId } : area
          )));
          setActiveTab(tabId);
          setMobileAppView('content');
        },

        closeTab: (tabId) => {
          let newActiveTab;
          setAreas(areas.map((area) => {
            if (area.tabIds.indexOf(tabId) !== -1) {
              const newTabs = area.tabIds.filter((t) => (t !== tabId));
              if (area.activeTab !== tabId) {
                return { ...area, tabIds: newTabs };
              }
              newActiveTab = newTabs[Math.max(0, Math.min(area.tabIds.indexOf(tabId), newTabs.length - 1))];
              return { ...area, tabIds: newTabs, activeTab: newActiveTab }
            }
            return area;
          }));
          const newTabs = {};
          Object.keys(tabs).forEach((key) => {
            if (key !== tabId) newTabs[key] = tabs[key];
          });
          setTabs(newTabs);
          setActiveTab(newActiveTab);
        },

        showReferences: async (verse) => {
          const descriptor = `(${verse.module})`
            + verse.xrefs.map((x) => (x[2] === x[5] ? `${x[0]}.${x[1]}:${x[2]}` : `${x[0]}.${x[1]}:${x[2]}-${x[5]}`)).join(';');
          const encodedDescriptor = encodeURIComponent(descriptor);
          const data = await fetchURI(`text/${encodedDescriptor}`);
          const newTabId = getId();

          setTabs({
            ...tabs,
            [newTabId]: {
              id: newTabId,
              descriptor,
              description: {i18n: 'refs', params: {descriptor: verse.descriptor}},
              verses: data
            }
          });

          setAreas(areas.map((area) => (
            area.id === 'rightCol'
              ? { ...area, tabIds: [...area.tabIds, newTabId], activeTab: newTabId }
              : area
          )));

          setActiveTab(newTabId);
          setMobileAppView('content');
        },

        moveTab: (tab, tgtAreaId, receiveId=null) => {
          if (receiveId === 'initial' || receiveId === tab) return;
          const srcArea = areas.find((a) => a.tabIds.indexOf(tab) !== -1);
          const tgtArea = areas.find((a) => a.id === tgtAreaId);
          if (srcArea === tgtArea && !receiveId) return;

          setAreas(areas.map((area) => {
            if (area.id === srcArea.id || area.id === tgtArea.id) {
              const newTabIds = [];
    
              area.tabIds.forEach((id) => {
                if (id === tab) return;
                if (id === receiveId) {
                  return newTabIds.push(tab, receiveId);
                }
                newTabIds.push(id);
              });

              if (!receiveId && area.id === tgtArea.id) {
                newTabIds.push(tab);
              }

              const newActiveTab = (area.id === tgtArea.id)
              ? tab
              : newTabIds[Math.max(0, Math.min(srcArea.tabIds.indexOf(tab), newTabIds.length - 1))];

              return { ...area, tabIds: newTabIds, activeTab: newActiveTab };
            } else {
              return area;
            }
          }));
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
      },
    })}, [
      loaded,
      modules,
      areas,
      tabs,
      mobileActiveTab,
      mobileAppView,
    ]
  );

  return <AppContext.Provider value={context}>{children}</AppContext.Provider>
}

export const useAppContext = () => useContext(AppContext);