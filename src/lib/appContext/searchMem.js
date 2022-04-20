import getId from './getId';
import { fetchURI } from '@lib/requests';
import { getDescriptorFromList } from "@lib/descriptor";

const mem = (
  {areas, tabs},
  {setAreas, setActiveTab, setTabs}
) => {
  return async (module, text) => {
    if (!text || text === '') return;
    const data = await fetchURI(`modules/${module.BibleShortName}/search/${encodeURIComponent(text)}`);
    const newTabId = getId();
    const newTab = {
      id: newTabId,
      descriptor: getDescriptorFromList(data),
      description: {i18n: 'searchResults', params: {module: module.BibleShortName, text}},
      verses: data
    };
    setTabs({...tabs, [newTabId]: newTab});
    setAreas(areas.map((area) => (
      area.id === 'centerCol' ? { ...area, tabIds: [...area.tabIds, newTabId], activeTab: newTabId } : area
    )));
    setActiveTab(newTabId);
  }
}

export default mem;