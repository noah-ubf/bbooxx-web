const mem = (
  {areas},
  {setAreas}
) => {
  return (tab, tgtAreaId, receiveId=null) => {
    if (receiveId === 'initial' || receiveId === tab) return;
    const srcArea = areas.find((a) => a.tabIds.indexOf(tab) !== -1);
    const tgtArea = areas.find((a) => a.id === tgtAreaId);
    if (srcArea === tgtArea && !receiveId) return;

    setAreas(areas.map((area) => {
      if (area.id === srcArea.id || area.id === tgtArea.id) {
        const newTabIds = [];

        area.tabIds.forEach((id) => {
          if (id === tab) return;
          if (id === receiveId) {
            return newTabIds.push(tab, receiveId);
          }
          newTabIds.push(id);
        });

        if (!receiveId && area.id === tgtArea.id) {
          newTabIds.push(tab);
        }

        const newActiveTab = (area.id === tgtArea.id)
        ? tab
        : newTabIds[Math.max(0, Math.min(srcArea.tabIds.indexOf(tab), newTabIds.length - 1))];

        return { ...area, tabIds: newTabIds, activeTab: newActiveTab };
      } else {
        return area;
      }
    }));
  }
}

export default mem;