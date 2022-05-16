import { makeStyles } from "@mui/styles";
import CloseIcon from '@mui/icons-material/Close';
// import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
// import LockIcon from '@mui/icons-material/Lock';
// import ShareIcon from '@mui/icons-material/Share';
// import classNames from "classnames";
import { useTranslation } from "react-i18next";

import {useAppContext} from "@lib/appContext";
import { NiftyTabs, NiftyTab } from '@components/NiftyTabs';
import TabContent from "@components/TabContent";
import TabNameDialog from '@components/TabNameDialog';
import "@translations/i18n";
import { useState } from "react";

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
    // [theme.breakpoints.down('md')]: {
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
    border: theme.palette.border.light,
    padding: '.2rem',
    marginRight: '.5rem',
  },
  locked: {
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
        color: theme.palette.text.main,
      },
    },
  },
  status: {
    fontSize: '.6rem',
    padding: '.1rem',
    background: theme.palette.background.main,
    textAlign: 'right',
  },
}));

// const isInitial = (tab) => ['initial'].includes(tab.id);
const isBasic = (tab) => ['initial', 'collection'].includes(tab.id);
const hasVerses = (tab) => (!!tab.descriptor)

const LayoutArea = ({ area }) => {
  const { t } = useTranslation();
  const tr = (key) => (key.i18n ? t(key.i18n, key.params) : key);

  const classes = useStyles();
  const { tabs } = area;
  const visibleTabs = tabs.filter((t) => !t.hidden);
  const {
    handlers: { getActiveTab, toggleTab, closeTab, moveTab, cloneTab, renameTab }
  } = useAppContext();
  const activeTab = getActiveTab()
  const activeTabInArea = area.tabs.find((t) => t.activeInArea) || area.tabs[0];
  const activeTabId = activeTab?.id;
  // const activeTabInAreaId = activeTabInArea?.id
  const activeTabValue = visibleTabs.find((t) => t.id === activeTabId) ? activeTabId : false;

  const [dialogOpen, setDialogOpen] = useState(false);
  const [[tabId, dialogText, isRename], setDialogProps] = useState([]);

  const allowDrop = (e) => e.preventDefault();
  const drag = (e) => e.dataTransfer.setData("tabId", e.target.id);
  const drop1 = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const tabId = e.dataTransfer.getData("tabId");
    if (tabId) {
      moveTab(tabId, area.id);
    }
  }
  const drop2 = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const tabId = e.dataTransfer.getData("tabId");
    if (tabId) {
      moveTab(tabId, area.id, e.target.closest('[draggable]').id);
    }
  }

  const handlePin = (tab) => {
    if (tab.id === 'collection') {
      setDialogProps([tab.id, tab.description, false]);
      setDialogOpen(true);
    } else {
      cloneTab(tab.id, true);
    }
  }

  const handleRename = (tab) => {
    setDialogProps([tab.id, tab.description, true]);
    setDialogOpen(true);
  }

  const handleConfirmPin = (text) => {
    if (isRename) renameTab(tabId, text);
    else cloneTab(tabId, true, text);
    setDialogOpen(false);
  }

  return (
    <div
      className={classes.layoutArea}
      onDrop={drop1}
      onDragOver={allowDrop}
    >
      { (visibleTabs.length > 0) &&
        <NiftyTabs
          className={classes.tab}
          value={activeTabValue}
          onChange={(e, newValue) => toggleTab(newValue)}
          variant="scrollable"
          scrollButtons="auto"
        >
        {
          visibleTabs.map((tab, i) => (
          (!isBasic(tab) || hasVerses(tab)) &&
            <NiftyTab key={i}
              id={ tab.id }
              wrapped
              value={tab.id}
              label={
                <div className={classes.tabContent}>
                  <span className={tab.locked ? classes.locked : null}>
                    { tr(tab.description) }
                  </span>

                  {(isBasic(tab) && hasVerses(tab)) && (
                    <PushPinOutlinedIcon onClick={() => handlePin(tab)} /> 
                  )}

                  {/* <ShareIcon onClick={() => shareTab(tab)} /> */}

                  {(!isBasic(tab) && tab.custom && tab.activeInArea) && (
                    <DriveFileRenameOutlineIcon onClick={(e) => {e.stopPropagation(); handleRename(tab)}} />
                  )}

                  {(!tab.locked && tab.activeInArea) && (
                    <CloseIcon onClick={(e) => {e.stopPropagation(); closeTab(tab.id)}} />
                  )}
                </div>
              }
              onDrop={tab.id === 'initial' ? undefined : drop2}
              onDragOver={allowDrop}
              draggable={tab.id !== 'initial'}
              onDragStart={drag}
            />
          ))
        }
        </NiftyTabs>
      }
      <TabContent tab={activeTabInArea} />

      {dialogOpen && <TabNameDialog
        open={dialogOpen}
        onConfirm={handleConfirmPin}
        onCancel={() => setDialogOpen(false)}
        description={dialogText}
      />}
    </div>
  );
}

export default LayoutArea;