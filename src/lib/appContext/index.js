import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { isArray } from 'lodash';

import { fetchURI } from '@lib/requests';

import { AREA_IDS, defaultTabs, getAreas } from './defaults';
import { loadTabContent, nearChapterDescriptorsGetter } from './helpers';
import { getDescriptorFromList, compactDescriptor } from '../descriptor';
import getId from './getId';
import { tab } from "@testing-library/user-event/dist/tab";
// import { t } from "i18next";

const insert = (arr, index, newItems) => [
  ...arr.slice(0, index),
  ...newItems,
  ...arr.slice(index)
]

const remove = (arr, index) => [
  ...arr.slice(0, index),
  ...arr.slice(index+1)
]

const moveToTop = (arr, index) => [
  arr[index],
  ...arr.slice(0, index),
  ...arr.slice(index+1)
]

const compare = (a, b) => {
  if (a === b) return 0;
  return a > b ? 1 : -1;
}

const AppContext = createContext({});

const getStorageJSON = (key) => {
  try {
    return window.localStorage.getItem(key)
    ? JSON.parse(window.localStorage.getItem(key))
    : false;
  } catch (e) {
    return false;
  }
}

const getStoredTabs = () => {
  const tabs = getStorageJSON('tabs');
  defaultTabs.forEach((t) => {
    if (!tabs.find((tt) => tt.id === t.id)) {
      tabs.push(t);
    }
  });
  if (!tabs[0].order) return tabs.map((t, i) => ({...t, order: i+1 }))
  return tabs;
}

const storedTabs = getStoredTabs();

const cleanTabs = (tabs) => {
  return tabs.map((tab) => tab.verses ? {...tab, verses: undefined, loaded: false} : {...tab, loaded: false});
}

export const AppContextProvider = ({ children }) => {
  const [allData, setAllData] = useState({
    loaded: false,
    modules: [],
    tabs: storedTabs,
  });
  const allDataRef = useRef();
  const setTabsRef = useRef();
  allDataRef.current = allData;

  // console.log({allData})

  const setTabs = useCallback((tabs, ) => {
    const activeBefore = allData.tabs.find((t) => t.active);
    const activeAfter = tabs.find((t) => t.active);
    if (activeBefore?.id !== activeAfter?.id) {
      window.location.hash = `#${activeAfter?.id}`;
    }

    setAllData({ ...allData, tabs });
  }, [allData]);

  setTabsRef.current = setTabs;

  const context = useMemo(() => {
    window.localStorage.setItem('tabs', JSON.stringify(cleanTabs(allData.tabs)));

    const getTab = (id, tabs = allDataRef.current.tabs) => tabs.find((t) => t.id === id);

    const getTabIndex = (id, tabs = allDataRef.current.tabs) => tabs.findIndex((t) => t.id === id);

    const getActiveTab = (tabs = allDataRef.current.tabs) => tabs
      .filter((t) => !(t.id === 'collection' && !t?.verses?.[0]))
      .sort((a, b) => compare(a.order, b.order))[0];

    const focusTab = (tabId, tabs = allDataRef.current.tabs) => {
      const tab = getTab(tabId, tabs);
      if (tab?.order === 1) return tabs;
      return tabs.map((t) => {
        if (t.id === tab.id) return { ...t, order: 1 };
        if (t.order > tab.order) return t;
        return { ...t, order: t.order + 1 };
      });
    }

    const fixOrder = (tabs) => {
      return tabs.sort((a, b) => compare(a.order, b.order)).map((t, i) => t.order === i+1 ? t : { ...t, order: i+1});
    }

    const loadText = (descriptor, description, tabId='initial') => {
      const tab = getTab(tabId);
      if (!tab) return;
      const tabs = allData.tabs.map((t) => {
        if (t.id === tabId) {
          return {...t, loaded: false, descriptor, description };
        }
        return t;
      });
      setTabsRef.current(focusTab(tabId, tabs));
      window.location.hash = `#${tabId}`;
    };

    return ({
      store: {
        ...allData,     
        areas: getAreas(allData.tabs),
      },

      getters: {
        getNearChapterDescriptors: nearChapterDescriptorsGetter(allData),
      },

      handlers: {
        getTab,

        getActiveTab,

        getAreaActiveTab: (areaId) => getActiveTab(allData.tabs.filter((t) => t.areaId === areaId)),

        loadText,

        createEmptyTab: (type, areaId, focus=true) => {
          const tabId = getId();
          const newTab = {
            id: tabId,
            type,
            loaded: true,
            areaId,
            descriptor: '',
            verses: [],
            order: allData.tabs.length + 1,
          };
          if (type === 'search') {
            newTab.source = {type: 'search', module: 'UKR', text: ''}
            newTab.description = {i18n: 'searchResults', params: {module: 'UKR', text: ''}}
          } else if (type === 'custom') {
            newTab.custom = true;
            newTab.description = {i18n: 'newList'};
          } else if (type === 'web') {
            newTab.description = {i18n: 'website'};
          } else return;

          const tabs = [...allData.tabs, newTab];

          setTabsRef.current(focus ? focusTab(newTab.id, tabs) : tabs);
          return newTab;
        },

        cloneTab: (tabId, clean, renameTo=false) => {
          const tab = getTab(tabId);
          if (!tab) return;
          const newTabId = getId();
          const newTab = {
            ...tab,
            id: newTabId,
            locked: true,
            description: renameTo || tab.description,
            order: allData.tabs.length + 1,
          };
          const description = tabId === 'initial' ? '*' : tab.description;
          const tabs2 = allData.tabs.map((t) => (t.id === tabId && clean) ? {...t, descriptor: '', description, verses: []} : t)
          // window.location.hash = `#${tabId}`;
          setTabsRef.current(focusTab(newTabId, [...tabs2, newTab]));
      
          setTimeout(() => {
            const newTabs = allDataRef.current.tabs.map((t) => t.id === newTabId ? {...t, locked: false} : t);
            setTabsRef.current(newTabs);
          }, 2000);
        },

        search: (module, text, tabIdDest=null) => {
          if (!text || text === '') return;
          const isNewTab = !getTab(tabIdDest);
          const tabId = isNewTab ? getId() : tabIdDest;
          const newData = {
            source: {type: 'search', module, text},
            loaded: false,
            description: {i18n: 'searchResults', params: {module, text}},
          };
          const newTab = {
            id: tabId,
            areaId: AREA_IDS.center,
            ...newData,
            order: allData.tabs.length + 1,
          };
          const tabs2 = isNewTab
            ? [ ...allData.tabs, newTab ]
            : allData.tabs.map((t) => t.id === tabId ? {...t, ...newData} : t);
          const tabs3 = focusTab(tabId, tabs2);
          setTabsRef.current(tabs3);
        },

        toggleTab: (tabId) => {
          setTabsRef.current(focusTab(tabId));
        },

        closeTab: (tabId) => {
          const tab = getTab(tabId);
          if (!tab) return;
          const areaId = tab.areaId;
          const tabsInArea = allData.tabs.filter((t) => t.areaId === areaId);
          const prevIndex = tabsInArea.findIndex((t) => t.id === tabId);
          const tabs2 = remove(allData.tabs, getTabIndex(tabId))
          const tabs3 = fixOrder(tabs2);
          setTabsRef.current(tabs3);
        },

        showReferences: (verse) => {
          const newTabId = getId();
          const descriptor = verse.descriptor;
      
          const newTab = {
            id: newTabId,
            source: {type: 'xrefs', descriptor},
            loaded: false,
            description: {i18n: 'refs', params: {descriptor: verse.descriptor}},
            areaId: AREA_IDS.right,
            order: allData.tabs.length + 1
          };
     
          const tabs3 = focusTab(newTabId, [ ...allData.tabs, newTab ]);
          setTabsRef.current(tabs3);
        },

        moveTab: (tabId, tgtAreaId, receiveId=null) => {
          const tab = getTab(tabId);
          const srcAreaId = tab.areaId;
          const tabs1 = allData.tabs.filter((t) => t.id !== tabId);
          const newTab = {...tab, areaId: tgtAreaId };
          const tabs2 = receiveId
            ? insert(tabs1, getTabIndex(receiveId, tabs1), [newTab])
            : [...tabs1, newTab]
          const tabs3 = focusTab(tabId, tabs2);
          // window.location.hash = `#${tabId}`;
          setTabsRef.current(tabs3);
        },

        loadTabContent: async (tabId) => {
          const tab = getTab(tabId);
          const newData = await loadTabContent(tab);
          setAllData({
            ...allDataRef.current,
            tabs: allDataRef.current.tabs.map((t) => {
              return (t.id === tabId) ? {...t, ...newData, loaded: true } : t;
            })
          });
        },

        loadStrongs: (strongsNum) => {
          const getStrongsDescriptor = (strongsNum) => {
            const module = allData.modules.find((m) => m.type === 'strongs')
            if (!module) return;
            const book = strongsNum[0] === 'H' ? 'Heb' : 'Grk';
            const num = strongsNum.substring(1);
            const descriptor = `(${module.shortName})${book}.${num}`;
            return descriptor;
          }
          const descriptor = isArray(strongsNum)
            ? compactDescriptor(strongsNum.map(getStrongsDescriptor).join(';'))
            : getStrongsDescriptor(strongsNum);

          loadText(descriptor, descriptor, 'strongs');
        },

        fetchModules: async () => {
          if (!allData.loaded) {
            const modules = await fetchURI('modules');
            setAllData({ ...allData, modules, loaded: true });
          }
        },

        loadChapter: async (module, book, chapter, tabId='initial') => {
          const descriptor = `(${module.shortName})${book.name}.${chapter}`;
          return loadText(descriptor, descriptor, tabId);
        },

        updateMemo: (tabId, content) => {
          const tab = getTab(tabId);
          if (!tab || tab.type !== 'memo' || tab.content === content) return;
          setTabsRef.current(allData.tabs.map((t) => t.id === tabId ? { ...t, content } : t));
        },

        resetTabs: () => {
          window.localStorage.removeItem('tabs');
          window.location.reload();
        },

        renameTab: (tabId, description) => {
          setAllData({
            ...allData,
            tabs: allData.tabs.map((t) => t.id === tabId ? {...t, description} : t ),
          });
        },

        shareTab: async (tab) => {
          const text = encodeURIComponent(tab.descriptor);
          const url = `${window.location.origin}/?text=${text}`;

          if (url.length > 2000) return; // TODO: cannot share

          if ('clipboard' in navigator) {
            return await navigator.clipboard.writeText(url);
          } else {
            return document.execCommand('copy', true, url);
          }
        },

        copyToCollection: async (verse, tabId='collection') => {
          if (!verse || ! verse.descriptor) return;
          const tab = getTab(tabId);
          const descr = tab.descriptor;
          const data = {
            descriptor: descr ? compactDescriptor([descr, verse.descriptor].join(';')) : verse.descriptor,
            loaded: false,
          };
          const newTabs = allData.tabs.map((t) => t.id === tabId ? { ...t, ...data } : t);
          const activeTab = getActiveTab();
          setTabsRef.current(focusTab(activeTab.id, focusTab(tabId, newTabs)));
        },

        removeVerse: (pos, tabId) => {
          const tab = getTab(tabId);
          const verses = remove(tab.verses, pos);
          const descriptor = compactDescriptor(verses.map(({descriptor}) => descriptor).join(';'));
          setTabsRef.current(allData.tabs.map((t) => t.id === tabId ? { ...tab, descriptor, verses } : t));
        },

        moveVerse: (tabIdFrom, pos, tabIdTo, posTo=-1) => {
          const tabFrom = getTab(tabIdFrom);
          const tabTo = getTab(tabIdTo);
          if (!tabTo.custom) return;
          const verse = tabFrom.verses[pos];
          if (!verse) return;

          if (tabIdFrom === tabIdTo) {
            const verses = posTo >= pos
              ? remove(insert(tabFrom.verses, posTo, [verse]), pos)
              : insert(remove(tabFrom.verses, pos), posTo, [verse]);
              const descriptor = compactDescriptor(verses.map(({descriptor}) => descriptor).join(';'));
              setTabsRef.current(allData.tabs.map((t) => t.id === tabIdFrom ? {...t, verses, descriptor} : t))
          } else {
            const versesFrom = remove(tabFrom.verses, pos);
            const versesTo = insert(tabTo.verses, posTo, [verse]);
            const descriptorFrom = compactDescriptor(versesFrom.map(({descriptor}) => descriptor).join(';'));
            const descriptorTo = compactDescriptor(versesTo.map(({descriptor}) => descriptor).join(';'));
            setTabsRef.current(allData.tabs.map((t) => {
              if (t.id === tabIdFrom) return {...t, verses: versesFrom, descriptor: descriptorFrom};
              if (t.id === tabIdTo) return {...t, verses: versesTo, descriptor: descriptorTo};
              return t;
            }))
          }
        },

        addToMemo: (html, verse) => {
          const tab = getTab('memo');
          const content = html || [
            '<div>',
            tab.content,
            verse.text,
            `<p><strong>${verse.descriptor}</strong></p>`,
            '</div>',
          ].join('');
          const newTabs = allData.tabs.map((t) => t.id === 'memo' ? {...tab, content} : t);
          const activeTab = getActiveTab();
          setTabsRef.current(focusTab(activeTab.id, focusTab('memo', newTabs)));
        },

        loadUrl: (tabId, url) => {
          const tab = getTab(tabId);
          if (!tab || tab.type !== 'web') return;
          setTabsRef.current(allData.tabs.map((t) => t.id === tabId ? {...tab, url} : t));
          console.log('loadUrl:', tabId, tab, url)
        },
      },
    })}, [allData]
  );

  return <AppContext.Provider value={context}>{children}</AppContext.Provider>
}

export const useAppContext = () => useContext(AppContext);