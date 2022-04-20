const mem = (
  {areas, tabs, mobileActiveTab},
  {setAreas, setActiveTab, setTabs}
) => {
  return (tabId) => {
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
    if (mobileActiveTab !== 'tabs') setActiveTab(newActiveTab);
    setTabs(newTabs);
  }
}

export default mem;