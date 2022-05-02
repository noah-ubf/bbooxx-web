import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";

import { fetchURI } from '@lib/requests';

import closeTabMem from './closeTabMem';
import showReferencesMem from './showReferencesMem';
import cloneTabMem from './cloneTabMem';
import searchMem from './searchMem';
import nearChapterDescriptorsMem from './nearChapterDescriptorsMem';
import toggleTabMem from './toggleTabMem';
import { defaultTabs, defaultAreas } from './defaults';
import { loadTabContent, AppState } from './helpers';

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
      const defaultAreaId = defaultAreas.find((a) => a.tabIds.includes(tabId));
      const area = defaultAreaId && initialAreas.find((a) => a.id === defaultAreaId);
      if (defaultAreaId && area) {
        area.tabIds.push(defaultAreaId)
      } else {
        initialAreas[initialAreas.length - 1].tabIds.push(tabId);
      }
    }
  }
});

const initialMobileActiveTab = window.localStorage.getItem('mobileActiveTab');

const cleanTabs = (tabs) => {
  const newTabs = {};
  Object.keys(tabs).forEach((key) => {
    newTabs[key] = tabs[key].verses ? {...tabs[key], verses: undefined, loaded: false} : tabs[key];
  });
  return newTabs;
}

export const AppContextProvider = ({ children }) => {
  const [allData, setAllData] = useState({
    loaded: false,
    modules: [],
    tabs: initialTabs,
    areas: initialAreas,
    mobileActiveTab: initialMobileActiveTab || 'modules',
    lastActiveDataTab: 'modules',
  });
  const allDataRef = useRef();
  allDataRef.current = allData;

  window.localStorage.setItem('mobileActiveTab', allData.mobileActiveTab);
  window.localStorage.setItem('tabs', JSON.stringify(cleanTabs(allData.tabs)));
  window.localStorage.setItem('areas', JSON.stringify(allData.areas));

  useEffect(() => {
    const onHashChange = () => {
      const hash = window.location.hash.split('/')[0];
      setAllData({
        ...allDataRef.current,
        mobileActiveTab: hash.substring(1),
      });
    }
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const context = useMemo(() => {
    const stateProcessor = new AppState(allData);

    const loadText = (descriptor, description, tabId='initial') => {
      setAllData({
        ...allData,
        tabs: { ...allData.tabs, [tabId]: { ...allData.tabs[tabId], loaded: false, descriptor, description } },
        areas: allData.areas.map((area) => (
          area.tabIds.indexOf(tabId) !== -1 ? { ...area, activeTab: tabId } : area
        )),
        mobileActiveTab: tabId,
        lastActiveDataTab: (tabId !== 'tabs') ? tabId: allData.lastActiveDataTab,
      });
      window.location.hash = `#${tabId}`;
    };

    return ({
      store: allData,

      getters: {
        getNearChapterDescriptors: nearChapterDescriptorsMem(allData),
      },

      handlers: {
        loadText,
        cloneTab: cloneTabMem(allData, setAllData),
        search: searchMem(allData, setAllData),
        toggleTab: toggleTabMem(allData, setAllData),
        closeTab: closeTabMem(allData, setAllData),
        showReferences: showReferencesMem(allData, setAllData),
        moveTab: (tab, tgtAreaId, receiveId) => {
          setAllData(stateProcessor.moveTab(tab, tgtAreaId, receiveId).getData());
        },
        loadTabContent: async (tabId) => {
          const newTab = await loadTabContent(allData.tabs[tabId]);
          setAllData({
            ...allDataRef.current,
            tabs: {...allDataRef.current.tabs, [tabId]: newTab}
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
          const tab = allData.tabs[tabId];
          if (!tab || tab.type !== 'memo') return;
          if (tab.content === content) return;
          setAllData({
            ...allData,
            tabs: {...allData.tabs, [tabId]: {...allData.tabs[tabId], content}}
          });
        },

        resetTabs: () => {
          window.localStorage.removeItem('mobileActiveTab');
          window.localStorage.removeItem('tabs');
          window.localStorage.removeItem('areas');
          window.location.reload();
        },

        renameTab: (tabId, description) => {
          setAllData({
            ...allData,
            tabs: {...allData.tabs, [tabId]: {...allData.tabs[tabId], description}},
          });
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

        copyToCollection: async (verse, tabId='collection') => {
          if (!verse || ! verse.descriptor) return;
          console.log('V: ', {verse});
          const tab = allData.tabs[tabId];
          const descr = tab.descriptor;
          setAllData({
            ...allData,
            tabs: {
              ...allData.tabs,
              [tabId]: {
                ...tab,
                descriptor: descr ? [descr, verse.descriptor].join(';') : verse.descriptor,
                loaded: false,
                // verses: [...tabs[tabId].verses, verse],
              }
            }
          });
        },

        removeVerse: (pos, tabId) => {
          const tab = allData.tabs[tabId];
          const newVerses = tab.verses.filter((v, i) => (i !== pos));

          setAllData({
            ...allData,
            tabs: {
              ...allData.tabs,
              [tabId]: {
                ...tab,
                descriptor: newVerses.map(({descriptor}) => descriptor).join(';'),
                verses: newVerses,
              }
            }
          });
        },

        moveVerse: (tabIdFrom, pos, tabIdTo, posTo=-1) => {
          const tabFrom = allData.tabs[tabIdFrom];
          const tabTo = allData.tabs[tabIdTo];
          if (!tabTo.custom) return;
          const verse = tabFrom.verses[pos];
          if (!verse) return;
          const newVersesFrom = tabFrom.custom
            ? tabFrom.verses.filter((v, i) => (i !== pos))
            : tabFrom.verses;
          let versesTo = tabTo.verses;
          if (tabIdFrom === tabIdTo) {
            if (posTo >= pos) posTo--;
            versesTo = newVersesFrom;
          }

          const newVersesTo = posTo === -1
            ? [...versesTo, verse]
            : [...versesTo.slice(0, posTo), verse, ...versesTo.slice(posTo)];

          const newTabs = {
            ...allData.tabs,
            [tabIdTo]: {
              ...tabTo,
              descriptor: newVersesTo.map(({descriptor}) => descriptor).join(';'),
              verses: newVersesTo,
            },
          }

          if (tabIdFrom !== tabIdTo) {
            newTabs[tabIdFrom] = {
              ...tabFrom,
              descriptor: newVersesFrom.map(({descriptor}) => descriptor).join(';'),
              verses: newVersesFrom,
            }
          }

          setAllData({ ...allData, tabs: newTabs });
        },

        addToMemo: (verse) => {
          const tab = allData.tabs['memo'];
          setAllData({
            ...allData,
            tabs: {
              ...allData.tabs,
              memo: {
                ...tab,
                content: [
                  tab.content,
                  verse.text,
                  `<p><strong>${verse.descriptor}</strong></p>`
                ].join(''),
              },
            },
          });
        }
      },
    })}, [ allData ]
  );

  return <AppContext.Provider value={context}>{children}</AppContext.Provider>
}

export const useAppContext = () => useContext(AppContext);