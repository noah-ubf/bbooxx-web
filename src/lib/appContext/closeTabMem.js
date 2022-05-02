const mem = ( allData, setAllData ) => {
  return (tabId) => {
    let newActiveTab;
    const newAreas = allData.areas.map((area) => {
      if (area.tabIds.indexOf(tabId) !== -1) {
        const newTabs = area.tabIds.filter((t) => (t !== tabId));
        if (area.activeTab !== tabId) {
          return { ...area, tabIds: newTabs };
        }
        newActiveTab = newTabs[Math.max(0, Math.min(area.tabIds.indexOf(tabId), newTabs.length - 1))];
        return { ...area, tabIds: newTabs, activeTab: newActiveTab }
      }
      return area;
    });
    const newTabs = {};
    Object.keys(allData.tabs).forEach((key) => {
      if (key !== tabId) newTabs[key] = allData.tabs[key];
    });

    setAllData({
      ...allData,
      tabs: newTabs,
      areas: newAreas,
      mobileActiveTab: newActiveTab,
      lastActiveDataTab: (allData.mobileActiveTab !== 'tabs') ? newActiveTab.id: allData.lastActiveDataTab,
    });
    window.location.hash = `#${tabId}`;

  }
}

export default mem;