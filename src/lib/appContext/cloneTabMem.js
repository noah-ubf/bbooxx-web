import getId from './getId';

const mem = ( allData, setAllData ) => {
  return (tabId, clean, renameTo=false) => {
    const tab = allData.tabs[tabId];
    if (!tab) return;
    const newTabId = getId();
    // const newTab = { ...tab, id: newTabId, locked: true };
    const newTab = { ...tab, id: newTabId, locked: false, description: renameTo || newTab.description };
    const description = tabId === 'initial' ? '*' : newTab.description;
    const newTabs = {
      ...allData.tabs,
      [newTabId]: newTab,
      [tabId]: (clean ? {...tab, descriptor: '', description, verses: []} : tab)
    };

    setAllData({
      ...allData,
      tabs: newTabs,
      areas: allData.areas.map((area) => {
        if (area.tabIds.indexOf(tabId) === -1) return area;
        return { ...area, tabIds: [...area.tabIds, newTabId], activeTab: newTabId };
      })
    });

    // setTimeout(() => {
    //   setTabs({
    //     ...newTabs,
    //     [newTabId]: {...newTab, locked: false, description: renameTo || newTab.description},
    //   });
    //   }, 2000);
  }
}

export default mem;