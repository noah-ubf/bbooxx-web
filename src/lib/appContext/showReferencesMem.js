import getId from './getId';

const mem = ( allData, setAllData ) => {
  return async (verse) => {
    const descriptor = `(${verse.module})`
      + verse.xrefs.map((x) => (x[2] === x[5] ? `${x[0]}.${x[1]}:${x[2]}` : `${x[0]}.${x[1]}:${x[2]}-${x[5]}`)).join(';');
    const newTabId = getId();

    const newTabs = {
      ...allData.tabs,
      [newTabId]: {
        id: newTabId,
        source: {type: 'refs', descriptor},
        loaded: false,
        description: {i18n: 'refs', params: {descriptor: verse.descriptor}},
      }
    };

    const newAreas = allData.areas.map((area) => (
      area.id === 'rightCol'
        ? { ...area, tabIds: [...area.tabIds, newTabId], activeTab: newTabId }
        : area
    ));

    setAllData({
      ...allData,
      tabs: newTabs,
      areas: newAreas,
      mobileActiveTab: newTabId,
      lastActiveDataTab: (allData.mobileActiveTab !== 'tabs') ? newTabId: allData.lastActiveDataTab,
    });
  }
}

export default mem;