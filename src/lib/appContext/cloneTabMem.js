import getId from './getId';

const mem = (
  {areas, tabs},
  {setAreas, setTabs}
) => {
  return (tabId, clean, renameTo=false) => {
    if (!tabs[tabId]) return;
    const newTabId = getId();
    const newTab = { ...tabs[tabId], id: newTabId, locked: true };
    const description = tabId === 'initial' ? '*' : newTab.description;
    const newTabs = {
      ...tabs,
      [newTabId]: newTab,
      [tabId]: (clean ? {...tabs[tabId], descriptor: '', description, verses: []} : tabs[tabId])
    };

    setTabs(newTabs);

    setAreas(areas.map((area) => {
      if (area.tabIds.indexOf(tabId) === -1) return area;
      return { ...area, tabIds: [...area.tabIds, newTabId], activeTab: newTabId };
    }));

    setTimeout(() => {
      setTabs({
        ...newTabs,
        [newTabId]: {...newTab, locked: false, description: renameTo || newTab.description},
      });
      }, 2000);
  }
}

export default mem;