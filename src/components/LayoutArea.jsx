import { useRef, useState } from "react";
import classNames from "classnames";
import { makeStyles } from "@mui/styles";
import { IconButton } from "@mui/material";
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import { useTranslation } from "react-i18next";

import {useAppContext} from "@lib/appContext";
import { NiftyTabs, NiftyTab } from '@components/NiftyTabs';
import TabContent from "@components/TabContent";
import TabNameDialog from '@components/TabNameDialog';
import "@translations/i18n";
import usePopup from "../lib/usePopup";

const useStyles = makeStyles((theme) => ({
  layoutArea: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'stretch',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    padding: '.3rem 0',
    background: theme.palette.background.veryLight,
  },
  active: {
    background: 'none',
  },
  tabZone: {
    display: 'flex',
    flexDirection: 'row',
  },
  activeAreaTabs: {
    '& .MuiTab-root': {
      opacity: '1 !important',
    },
  },
  tab: {
    flexGrow: 1,
    '& .MuiTab-root': {
      opacity: .4,
    },
  },
  buttonWrapper: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
  iconButton: {
    height: 24,
    width: 24,
  },
  tabTitle: {
    maxWidth: '16em !important',
    display: 'inline-block',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    verticalAlign: 'middle',
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

const isBasic = (tab) => ['initial', 'collection'].includes(tab.id);
const hasVerses = (tab) => (!!tab.descriptor)

const LayoutArea = ({ area }) => {
  const { t } = useTranslation();
  const tr = (key) => (key.i18n ? t(key.i18n, key.params) : key);

  const classes = useStyles();
  const { tabs } = area;
  const visibleTabs = tabs.filter((t) => !t.hidden);
  const {
    handlers: { createEmptyTab, getActiveTab, toggleTab, closeTab, moveTab, cloneTab, renameTab }
  } = useAppContext();
  const activeTab = getActiveTab()
  const activeTabInArea = area.tabs.find((t) => t.activeInArea) || area.tabs[0];
  const activeTabInAreaValue = visibleTabs.find((t) => t.id === activeTabInArea?.id) ? activeTabInArea.id : false;
  const isAreaActive = activeTab?.id === activeTabInArea?.id;
  const isAreaActiveRef = useRef(isAreaActive);
  isAreaActiveRef.current = isAreaActive;

  const [dialogOpen, setDialogOpen] = useState(false);
  const [[tabId, dialogText, isRename], setDialogProps] = useState([]);

  const addTabRef = useRef();
  const addTab = usePopup('addTabPopup');
  const AddTabPopup = addTab.Popup;

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

  const handleAddSearchTab = () => {
    createEmptyTab('search', area.id);
    addTab.hide();
  }

  const handleAddCustomTab = () => {
    const tab = createEmptyTab('custom', area.id);
    addTab.hide();
    handleRename(tab);
  }
  
  return (
    <div
      className={classNames(classes.layoutArea, {[classes.active]: isAreaActive})}
      onDrop={drop1}
      onDragOver={allowDrop}
      onClick={() => setTimeout(() => isAreaActiveRef.current || toggleTab(activeTabInAreaValue), 0)}
    >
      { (visibleTabs.length > 0) &&
      <div className={classes.tabZone}>
        <NiftyTabs
          className={classNames(classes.tab, {[classes.activeAreaTabs]: isAreaActive})}
          value={activeTabInAreaValue}
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
                  <span className={classNames(classes.tabTitle, {[classes.locked]: tab.locked})}>
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
        <div className={classes.buttonWrapper}>
          <IconButton
            ref={addTabRef}
            className={classes.iconButton}
            onClick={() => addTab.show(addTabRef)}
          >
            <AddIcon />
          </IconButton>
        </div>
      </div>
      }
      <TabContent tab={activeTabInArea} active={isAreaActive}/>

      {dialogOpen && <TabNameDialog
        open={dialogOpen}
        onConfirm={handleConfirmPin}
        onCancel={() => setDialogOpen(false)}
        description={dialogText}
      />}

      <AddTabPopup>
        <MenuItem onClick={handleAddSearchTab}>
          <ListItemIcon>
            <SearchIcon/>
          </ListItemIcon>
          <ListItemText>{t('newSearchTab')}</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleAddCustomTab}>
          <ListItemIcon>
            <FormatListBulletedIcon/>
          </ListItemIcon>
          <ListItemText>{t('newList')}</ListItemText>
        </MenuItem>
      </AddTabPopup>
    </div>
  );
}

export default LayoutArea;