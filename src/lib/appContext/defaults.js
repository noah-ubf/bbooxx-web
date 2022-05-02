export const defaultTabs = {
  tabs: {
    id: 'tabs',
    type: 'tabs',
    description: {i18n: 'tablist'},
    locked: true,
    hidden: true,
  },
  modules: {
    id: 'modules',
    type: 'modules',
    description: {i18n: 'library'},
    locked: true,
  },
  initial: {
    id: 'initial',
    locked: true,
    description: '*',
    verses: [],
  },
  collection: {
    id: 'collection',
    locked: true,
    description: {i18n: 'collection'},
    verses: [],
    custom: true,
  },
  memo: {
    id: 'memo',
    type: 'memo',
    description: {i18n: 'notes'},
    locked: true,
  },
  settings: {
    id: 'settings',
    type: 'settings',
    description: {i18n: 'settings'},
    locked: true,
    hidden: true,
  },
  strongs: {
    id: 'strongs',
    type: 'strongs',
    description: {i18n: 'strongs'},
    locked: true,
    hidden: true,
    verses: [],
  },
};

export const defaultAreas = [
  {
    id: 'leftCol',
    activeTab: 'modules',
    tabIds: ['modules'],
  },
  {
    id: 'centerCol',
    activeTab: 'initial',
    tabIds: ['initial'],
  },
  {
    id: 'rightCol',
    activeTab: 'memo',
    tabIds: ['collection', 'memo'],
  },
  {
    id: 'bottomCol',
    activeTab: null,
    tabIds: ['strongs'],
  },
]