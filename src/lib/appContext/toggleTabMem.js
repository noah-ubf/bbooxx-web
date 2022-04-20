const mem = (
  {areas},
  {setAreas, setActiveTab}
) => {
  return (tabId) => {
    setAreas(areas.map((area) => (
      area.tabIds.includes(tabId) ? { ...area, activeTab: tabId } : area
    )));
    setActiveTab(tabId);
  }
}

export default mem;