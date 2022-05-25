import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { isArray } from 'lodash';

import { fetchURI } from '@lib/requests';

import { AREA_IDS, defaultTabs, getAreas } from './defaults';
import { loadTabContent, nearChapterDescriptorsGetter } from './helpers';
import getId from './getId';
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

const getLegacyTabs = () => {
  const AREA_MAP = {
    leftCol: '@left',
    centerCol: '@center',
    rightCol: '@right',
    bottomCol: '@bottom',
  }
  const tabs = getStorageJSON('tabs');
  const areas = getStorageJSON('areas');
  const initialMobileActiveTab = window.localStorage.getItem('mobileActiveTab');
  const newTabs = [];
  Object.keys(tabs).forEach((t) => {
    const area = areas.find((a) => a.tabIds.includes(t));
    const order = area ? area.tabIds.findIndex((id) => id === t) : -1;
    const newTab = {
      ...tabs[t],
      areaId: area ? AREA_MAP[area.id] : undefined,
      active: t === initialMobileActiveTab,
      activeInArea: area && area.activeTab === t,
    };
    newTabs.push({newTab, order});
  });
  newTabs.sort((a,b) => (a.order - b.order));
  return newTabs.map(({newTab}) => newTab);
}

const getStoredTabs = () => {
  const storedTabs = getStorageJSON('tabs');
  const isLegacy = !isArray(storedTabs);
  const tabs = isLegacy ? getLegacyTabs() : storedTabs;
  defaultTabs.forEach((t) => {
    if (!tabs.find((tt) => tt.id === t.id)) {
      tabs.push(t);
    }
  });
  if (isLegacy) {
    window.localStorage.removeItem('areas');
    window.localStorage.removeItem('mobileActiveTab');
  }
  return tabs.map((t) => t.id === 'strongs' ? {...t, hidden: false} : t);
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
  allDataRef.current = allData;

  // console.log({allData})

  const setTabs = useCallback((tabs) => {
    const activeBefore = allData.tabs.find((t) => t.active);
    const activeAfter = tabs.find((t) => t.active);
    if (activeBefore?.id !== activeAfter?.id) {
      window.location.hash = `#${activeAfter?.id}`;
    }

    setAllData({ ...allData, tabs });
  }, [allData]);

  const context = useMemo(() => {
    window.localStorage.setItem('tabs', JSON.stringify(cleanTabs(allData.tabs)));

    const getTab = (id, tabs = allData.tabs) => tabs.find((t) => t.id === id);

    const getTabIndex = (id, tabs = allData.tabs) => tabs.findIndex((t) => t.id === id);

    const focusTab = (tabId, tabs = allData.tabs) => {
      const tab = getTab(tabId, tabs);
      return tabs.map((t) => {
        if (t.id === tabId) return { ...t, active: true, activeInArea: true };
        if (t.areaId === tab.areaId) return { ...t, active: false, activeInArea: false };
        return { ...t, active: false };
      })
    }

    const fixActiveInArea = (areaId, tabs = allData.tabs) => {
      const activeInArea = tabs.find((t) => t.areaId === areaId && t.activeInArea)
      return activeInArea ? tabs : tabs.map((t,i) => i>0 ? t : { ...t, activeInArea: true } );
    }

    const loadText = (descriptor, description, tabId='initial') => {
      const tab = getTab(tabId);
      if (!tab) return;
      const tabs = allData.tabs.map((t) => {
        if (t.id === tabId) {
          return {...t, loaded: false, descriptor, description, active: true, activeInArea: true };
        } else if (t.areaId === tab.areaId) {
          return {...t, active: false, activeInArea: false };
        }
        return t;
      });
      setTabs(tabs);
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

        getActiveTab: () => allData.tabs.find((t) => t.active),

        getAreaActiveTab: (areaId) => allData.tabs.find((t) => t.areaId === areaId && t.activeInArea),

        loadText,

        cloneTab: (tabId, clean, renameTo=false) => {
          const tab = getTab(tabId);
          if (!tab) return;
          const newTabId = getId();
          const newTab = { ...tab, id: newTabId, locked: true, description: renameTo || tab.description };
          const description = tabId === 'initial' ? '*' : tab.description;
          const tabs2 = allData.tabs.map((t) => (t.id === tabId && clean) ? {...t, descriptor: '', description, verses: []} : t)
          // window.location.hash = `#${tabId}`;
          setTabs(focusTab(newTabId, [...tabs2, newTab]));
      
          setTimeout(() => {
            const newTabs = allDataRef.current.tabs.map((t) => t.id === newTabId ? {...t, locked: false} : t);
            setTabs(newTabs);
          }, 2000);
        },

        search: (module, text) => {
          if (!text || text === '') return;
          const tabId = getId();
          const newTab = {
            id: tabId,
            source: {type: 'search', module: module.shortName, text},
            loaded: false,
            description: {i18n: 'searchResults', params: {module: module.shortName, text}},
            areaId: AREA_IDS.center
          };
          const tabs3 = focusTab(tabId, [ ...allData.tabs, newTab ]);
          const tabs4 = fixActiveInArea(AREA_IDS.center, tabs3);
          // window.location.hash = `#${tabId}`;
          setTabs(tabs4);
        },

        toggleTab: (tabId) => {
          setTabs(focusTab(tabId));
        },

        closeTab: (tabId) => {
          const tab = getTab(tabId);
          if (!tab) return;
          const areaId = tab.areaId;
          const tabs2 = remove(allData.tabs, getTabIndex(tabId))
          const tabs4 = fixActiveInArea(areaId, tabs2);
          setTabs(tabs4);
        },

        showReferences: (verse) => {
          // const descriptor = `(${verse.module})`
          //   + verse.xrefs.map((x) => (x[2] === x[5] ? `${x[0]}.${x[1]}:${x[2]}` : `${x[0]}.${x[1]}:${x[2]}-${x[5]}`)).join(';');
          const newTabId = getId();

          const descriptor = verse.descriptor;
      
          const newTab = {
            id: newTabId,
            source: {type: 'xrefs', descriptor},
            loaded: false,
            description: {i18n: 'refs', params: {descriptor: verse.descriptor}},
            areaId: AREA_IDS.right,
          };
      
          const tabs3 = focusTab(newTabId, [ ...allData.tabs, newTab ]);
          const tabs4 = fixActiveInArea(AREA_IDS.center, tabs3);
          setTabs(tabs4);
        },

        moveTab: (tabId, tgtAreaId, receiveId=null) => {
          const tab = getTab(tabId);
          const srcAreaId = tab.areaId;
          const tabs1 = allData.tabs.filter((t) => t.id !== tabId);
          const newTab = {...tab, areaId: tgtAreaId, active: true, activeInArea: true, };
          const tabs2 = receiveId
            ? insert(tabs1, getTabIndex(receiveId, tabs1), [newTab])
            : [...tabs1, newTab]
          const tabs3 = focusTab(tabId, tabs2);
          const tabs4 = fixActiveInArea(srcAreaId, tabs3);
          // window.location.hash = `#${tabId}`;
          setTabs(tabs4);
        },

        loadTabContent: async (tabId) => {
          const tab = getTab(tabId);
          const newData = await loadTabContent(tab);
          setAllData({
            ...allDataRef.current,
            tabs: allDataRef.current.tabs.map((t) => {
              return (t.id === tabId) ? {...t, ...newData, active: true, activeInArea: true, loaded: true } : t;
            })
          });
        },

        loadStrongs: (strongsNum) => {
          const module = allData.modules.find((m) => m.type === 'strongs')
          if (!module) return;
          const book = strongsNum[0] === 'H' ? 'Heb' : 'Grk';
          const num = strongsNum.substring(1);
          const descriptor = `(${module.shortName})${book}.${num}`;
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
          setTabs(allData.tabs.map((t) => t.id === tabId ? { ...t, content } : t));
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
          console.log({tab});
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
            descriptor: descr ? [descr, verse.descriptor].join(';') : verse.descriptor,
            loaded: false,
          };
          const newTabs = allData.tabs.map((t) => t.id === tabId ? { ...t, ...data } : t);
          setTabs(newTabs);
        },

        removeVerse: (pos, tabId) => {
          const tab = getTab(tabId);
          const verses = remove(tab.verses, pos);
          const descriptor = verses.map(({descriptor}) => descriptor).join(';');
          setTabs(allData.tabs.map((t) => t.id === tabId ? { ...tab, descriptor, verses } : t));
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
            setTabs(allData.tabs.map((t) => t.id === tabIdFrom ? {...t, verses} : t))
          } else {
            const versesFrom = remove(tabFrom.verses, pos);
            const versesTo = insert(tabTo.verses, posTo, [verse]);
            setTabs(allData.tabs.map((t) => {
              if (t.id === tabIdFrom) return {...t, verses: versesFrom};
              if (t.id === tabIdTo) return {...t, verses: versesTo};
              return t;
            }))
          }
        },

        addToMemo: (verse) => {
          const tab = getTab('memo');
          const content = [
            '<div>',
            tab.content,
            verse.text,
            `<p><strong>${verse.descriptor}</strong></p>`,
            '</div>',
          ].join('');
          setTabs(allData.tabs.map((t) => t.id === 'memo' ? {...tab, content} : t));
        }
      },
    })}, [allData, setTabs]
  );

  return <AppContext.Provider value={context}>{children}</AppContext.Provider>
}

export const useAppContext = () => useContext(AppContext);