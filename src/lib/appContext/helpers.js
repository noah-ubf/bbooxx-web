import { fetchURI } from '@lib/requests';
import { getDescriptorFromList } from "@lib/descriptor";

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
