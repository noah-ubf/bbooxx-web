import getId from './getId';

const mem = (
  {areas, tabs},
  {setAreas, setActiveTab, setTabs}
) => {
  return (module, text) => {
    if (!text || text === '') return;
    const newTabId = getId();
    const newTab = {
      id: newTabId,
      source: {type: 'search', module: module.BibleShortName, text},
      loaded: false,
      description: {i18n: 'searchResults', params: {module: module.BibleShortName, text}},
    };
    setTabs({...tabs, [newTabId]: newTab});
    setAreas(areas.map((area) => (
      area.id === 'centerCol' ? { ...area, tabIds: [...area.tabIds, newTabId], activeTab: newTabId } : area
    )));
    setActiveTab(newTabId);
  }
}

export default mem;