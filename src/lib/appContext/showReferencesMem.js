import getId from './getId';

const mem = (
  {areas, tabs},
  {setAreas, setActiveTab, setTabs}
) => {
  return async (verse) => {
    const descriptor = `(${verse.module})`
      + verse.xrefs.map((x) => (x[2] === x[5] ? `${x[0]}.${x[1]}:${x[2]}` : `${x[0]}.${x[1]}:${x[2]}-${x[5]}`)).join(';');
    const newTabId = getId();

    setTabs({
      ...tabs,
      [newTabId]: {
        id: newTabId,
        source: {type: 'refs', descriptor},
        loaded: false,
        description: {i18n: 'refs', params: {descriptor: verse.descriptor}},
      }
    });

    setAreas(areas.map((area) => (
      area.id === 'rightCol'
        ? { ...area, tabIds: [...area.tabIds, newTabId], activeTab: newTabId }
        : area
    )));

    setActiveTab(newTabId);
  }
}

export default mem;