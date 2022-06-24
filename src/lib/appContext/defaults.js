export const AREA_IDS = {
  none: '@none',
  left: '@left',
  center: '@center',
  right: '@right',
  bottom: '@bottom',
}

export const defaultTabs = [
  {
    id: 'tabs',
    type: 'tabs',
    description: {i18n: 'tablist'},
    locked: true,
    hidden: true,
    areaId: AREA_IDS.none,
  },
  {
    id: 'modules',
    type: 'modules',
    description: {i18n: 'library'},
    locked: true,
    areaId: AREA_IDS.left,
    active: true,
    activeInArea: true,
  },
  {
    id: 'initial',
    locked: true,
    description: '*',
    verses: [],
    areaId: AREA_IDS.center,
    active: false,
    activeInArea: true,
  },
  {
    id: 'collection',
    locked: true,
    description: {i18n: 'collection'},
    verses: [],
    custom: true,
    areaId: AREA_IDS.right,
    active: false,
    activeInArea: false,
  },
  {
    id: 'memo',
    type: 'memo',
    description: {i18n: 'notes'},
    locked: true,
    areaId: AREA_IDS.right,
    active: false,
    activeInArea: true,
  },
  {
    id: 'settings',
    type: 'settings',
    description: {i18n: 'settings'},
    locked: true,
    hidden: true,
  },
  {
    id: 'strongs',
    type: 'strongs',
    description: {i18n: 'strongs'},
    locked: true,
    verses: [],
    areaId: AREA_IDS.bottom,
    active: false,
    activeInArea: true,
  },
];

export const getAreas = (tabs) => {
  const areas = {};
  Object.values(AREA_IDS).forEach((id) => areas[id] = ({id, tabs: []}))
  tabs.forEach((tab) => {
    if (!tab.areaId || !areas[tab.areaId]) return;
    areas[tab.areaId].tabs.push(tab);
  });
  return areas;
};
