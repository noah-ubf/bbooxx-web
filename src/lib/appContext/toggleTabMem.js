const mem = ( allData, setAllData ) => {
  return (tabId) => {
    setAllData({
      ...allData,
      areas: allData.areas.map((area) => (
        area.tabIds.includes(tabId) ? { ...area, activeTab: tabId } : area
      )),
      mobileActiveTab: tabId,
      lastActiveDataTab: (allData.mobileActiveTab !== 'tabs') ? tabId: allData.lastActiveDataTab,
    });
    window.location.hash = `#${tabId}`;
  }
}

export default mem;