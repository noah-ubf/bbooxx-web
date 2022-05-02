import getId from './getId';

const mem = ( allData, setAllData ) => {
  return (module, text) => {
    if (!text || text === '') return;
    const newTabId = getId();
    const newTab = {
      id: newTabId,
      source: {type: 'search', module: module.shortName, text},
      loaded: false,
      description: {i18n: 'searchResults', params: {module: module.shortName, text}},
    };

    setAllData({
      ...allData,
      tabs: {...allData.tabs, [newTabId]: newTab},
      areas: allData.areas.map((area) => (
        area.id === 'centerCol' ? { ...area, tabIds: [...area.tabIds, newTabId], activeTab: newTabId } : area
      )),
      mobileActiveTab: newTabId,
      lastActiveDataTab: (allData.mobileActiveTab !== 'tabs') ? newTabId: allData.lastActiveDataTab,
    });
    window.location.hash = `#${newTabId}`;
  }
}

export default mem;