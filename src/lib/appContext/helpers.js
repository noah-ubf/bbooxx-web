import { fetchURI } from '@lib/requests';
import { getDescriptorFromList } from "@lib/descriptor";
import getId from './getId';

export const loadTabContent = async (tab) => {
  if (tab.loaded === false) {
    const {source={}, descriptor} = tab;
    const tabTemplate = { ...tab, loaded: true, verses: [] };
    switch(source && source.type) {
      case 'search': {
        if (!source.text) return {...tabTemplate, descriptor: ''};
        const data = await fetchURI(`modules/${source.module}/search/${encodeURIComponent(source.text)}`);
        return {
          ...tabTemplate,
          descriptor: getDescriptorFromList(data),
          verses: data,
        };
      }
      case 'refs': {
        if (!source.descriptor) return {...tabTemplate, descriptor: ''};
        const data = await fetchURI(`text/${encodeURIComponent(source.descriptor)}`);
        return {
          ...tabTemplate,
          descriptor: source.descriptor,
          verses: data,
        }
      }
      default: {
        if (!descriptor) return tabTemplate;
        const data = await fetchURI(`text/${encodeURIComponent(descriptor)}`);
        return {
          ...tabTemplate,
          descriptor,
          verses: data,
        };
      }
    }
  }
}

export class AppState {
  constructor({loaded, modules, tabs, areas, mobileActiveTab, lastActiveDataTab}) {
    this.data = {loaded, modules, tabs, areas, mobileActiveTab, lastActiveDataTab};
  }

  _getTab(tabId) {
    return this.data.tabs[tabId];
  }

  _addTabToArea(tabId, areaId, pos=-1) {
    const areas = this.data.areas.map((area) => {
      if (area.tabIds.includes(tabId)) {
        const tabIds = area.tabIds.filter((t) => (t !== tabId));
        const activeTab = tabIds.includes(area.activeTab)
          ? area.activeTab
          : tabIds[Math.max(0, Math.min(area.tabIds.indexOf(tabId), tabIds.length - 1))];
        return { ...area, tabIds, activeTab }
      }
      
      if (area.id === areaId) {
        const tabIds = pos === -1
          ? [...area.tabIds, tabId]
          : [...area.tabIds.slice(0,pos), tabId, area.tabIds.slice(pos)]
        return { ...area, tabIds};
      }
      return area;
    });
    this.data = {...this.data, areas};
    return this;
  }

  _addTabToTabs(tab) {
    this.data = {...this.data, tabs: {...this.data.tabs, [tab.id]: tab}};
    return this;
  }

  _removeTabFromAreas(tabId) {
    return this._addTabToArea(tabId, false);
  }

  _removeTabFromTabs(tabId) {
    const tabs = {};
    Object.keys(this.data.tabs).forEach((key) => {
      if (key !== tabId) tabs[key] = this.data.tabs[key];
    });
    this.data = {...this.data, tabs};
    return this;
  }

  _setMobileActiveTab(tabId) {
    if (!this.data.tabs[tabId]) return this;
    return {...this.data, }
  }

  _cleanLastActiveDataTab() {
    if (this.data.tabs[this.data.lastActiveDataTab]) return this;
    return {...this.data, lastActiveDataTab: 'modules'}
  }

  getData() {
    return this.data;
  }

  getTabArea(tabId) {
    return this.data.areas.find((a) => a.tabIds && a.tabIds.includes(tabId));
  }

  removeTab(tabId) {
    const tab = this._getTab(tabId);
    if (tab.locked) return this;
    this._removeTabFromAreas(tabId)
        ._removeTabFromTabs(tabId)
        ._setMobileActiveTab('tabs')
        ._cleanLastActiveDataTab();
  }

  moveTab(tabId, areaId, receiveId=null) {
    const tab = this._getTab(tabId);
    if (tab.locked) return this;
    const area = this.data.areas.find((a) => a.id === areaId);
    if (!area) return this;
    const pos = area.tabIds.indexOf(receiveId);
    return this._addTabToArea(tabId, areaId, pos);
  }
}
