import { makeStyles } from "@mui/styles";
import CloseIcon from '@mui/icons-material/Close';
// import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined';
import LockIcon from '@mui/icons-material/Lock';
// import ShareIcon from '@mui/icons-material/Share';
// import classNames from "classnames";
import { useTranslation } from "react-i18next";

import {useAppContext} from "@lib/appContext";
import { NiftyTabs, NiftyTab } from '@components/NiftyTabs';
import TabContent from "@components/TabContent";
import "@translations/i18n";

const useStyles = makeStyles((theme) => ({
  layoutArea: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'stretch',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    padding: '.2rem',
  },
  tab: {
    // [theme.breakpoints.down('sm')]: {
    //   display: 'none',
    // },
  },
  content: {
    display: 'flex',
    flexDirection: 'row',
    flexGrow: 100,
    flexShrink: 100,
    alignItems: 'stretch',
    justifyContent: 'stretch',
    overflow: 'hidden',
    border: 'solid 2px #ddddff',
    padding: '.2rem',
    marginRight: '.5rem',
  },
  initial: {
    fontWeight: 'bold',
    fontSize: 'larger',
  },
  tabContent: {
    '& svg': {
      verticalAlign: 'middle',
      width: 18,
      height: 18,
      marginLeft: 5,
      marginBottom: 2,
      '&:first-child': {
        width: 14,
        height: 14,
        marginLeft: 0,
        marginRight: 5,
        color: 'black',
      },
    },
  },
  status: {
    fontSize: '.6rem',
    padding: '.1rem',
    background: '#eeeeee',
    textAlign: 'right',
  },
}));

const LayoutArea = ({ area }) => {
  const { t } = useTranslation();
  const tr = (key) => (key.i18n ? t(key.i18n, key.params) : key);

  const classes = useStyles();
  const { activeTab, tabIds } = area;
  const { store: { tabs }, handlers: { toggleTab, closeTab, moveTab, cloneTab, updateMemo } } = useAppContext();

  const allowDrop = (e) => e.preventDefault();
  const drag = (e) => e.dataTransfer.setData("text", e.target.id);
  const drop1 = (e) => {
    e.preventDefault();
    const [srcType, __, tabId] = e.dataTransfer.getData("text").split('__');
    if (srcType === 'ntab') {
      moveTab(tabId, area.id);
    }
  }
  const drop2 = (e) => {
    e.preventDefault();
    const [srcType, __, tabId] = e.dataTransfer.getData("text").split('__');
    if (srcType === 'ntab') {
      const [tgtType, areaId, receiveId] = e.target.closest('[draggable]').id.split('__');
      moveTab(tabId, areaId, receiveId);
    }
  }

  return (
    <div
      className={classes.layoutArea}
      onDrop={drop1}
      onDragOver={allowDrop}
    >
      { (tabIds.length > 0) &&
        <NiftyTabs
          className={classes.tab}
          value={activeTab}
          onChange={(e, newValue) => toggleTab(newValue)}
          variant="scrollable"
          scrollButtons="auto"
        >
        {
          tabIds.map((tabId, i) => (
          !!tabs[tabId] && (tabId !== 'initial' || tabs[tabId].verses.length > 0) &&
            <NiftyTab key={i}
              id={ ['ntab', area.id, tabId].join('__') }
              wrapped
              value={tabId}
              label={
                <div className={classes.tabContent}>
                  {(tabs[tabId].locked) && <LockIcon title={'Default tab'} /> }

                  <span className={tabId === 'initial' ? classes.initial : null}>
                    { tr(tabs[tabId].description) }
                  </span>

                  {(tabId === 'initial' && tabId === activeTab && tabs[tabId].verses.length > 0) && (
                    <PushPinOutlinedIcon onClick={() => cloneTab(tabId, true)} /> 
                  )}

                  {/* <ShareIcon onClick={() => shareTab(tabs[tabId])} /> */}

                  {(!tabs[tabId].locked && tabId === activeTab) && (
                    <CloseIcon onClick={(e) => {e.stopPropagation(); closeTab(tabId)}} />
                  )}
                </div>
              }
              onDrop={tabId === 'initial' ? undefined : drop2}
              onDragOver={allowDrop}
              draggable={tabId !== 'initial'}
              onDragStart={drag}
            />
          ))
        }
        </NiftyTabs>
      }
      <TabContent tabId={activeTab} />
    </div>
  );
}

export default LayoutArea;