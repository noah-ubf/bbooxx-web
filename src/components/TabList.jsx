import { makeStyles } from "@mui/styles";
import CloseIcon from '@mui/icons-material/Close';
// import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
// import LockIcon from '@mui/icons-material/Lock';
import SettingsIcon from '@mui/icons-material/Settings';
import { useTranslation } from "react-i18next";
import { Divider } from "@mui/material";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import i18n from "i18next";
import { CircularProgress } from "@mui/material";

import {useAppContext} from "@lib/appContext";
import TabNameDialog from '@components/TabNameDialog';
import "@translations/i18n";
import US from "@ressources/US.png";
import UA from "@ressources/UA.png";
import { useState } from "react";

const useStyles = makeStyles((theme) => ({
  tabList: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    alignItems: 'stretch',
    justifyContent: 'space-between',
    width: '100%',
    minHeight: '100%',
    overflow: 'hidden',
    padding: '.2rem',
  },
}));

const TabList = () => {
  const { t } = useTranslation();
  const tr = (key) => (key.i18n ? t(key.i18n, key.params) : key);
  const classes = useStyles();
  const {
    store: { tabs, mobileActiveTab, lastActiveDataTab },
    handlers: { cloneTab, closeTab, toggleTab, resetTabs, renameTab }
  } = useAppContext();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [[tabId, dialogText, isRename], setDialogProps] = useState([]);

  const tabsArray = Object.keys(tabs)
    .map((key) => ({id: key, ...tabs[key]}))
    .filter((tab) => (
      tab
      && !tab.hidden
      && (!['initial', 'collection'].includes(tab.id) || (!!tab.descriptor)))
    )
    .sort((a,b) => (a.locked ? a : b));

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
    <div className={classes.tabList} >
      <List>
        {
          tabsArray.map((tab) => (
            <ListItem key={tab.id} disablePadding selected={tab.id === lastActiveDataTab}>
              <ListItemButton>
                <ListItemText primary={tr(tab.description)} onClick={() => toggleTab(tab.id)}/>
                {(tab.id !== 'collection' && tab.custom) && (
                  <ListItemIcon>
                    <DriveFileRenameOutlineIcon onClick={(e) => {e.stopPropagation(); handleRename(tab)}} />
                  </ListItemIcon>
                )}
                {(tab.loaded === false) && (
                  <ListItemIcon>
                    <CircularProgress size={20} color={'grey'} />
                  </ListItemIcon>
                )}
                <ListItemIcon>
                  { tab.locked
                    ? (['initial', 'collection'].includes(tab.id) ? <PushPinOutlinedIcon onClick={() => handlePin(tab)} /> : false)
                    : <CloseIcon onClick={() => closeTab(tab.id)}/>
                  }
                </ListItemIcon>
              </ListItemButton>
            </ListItem>
          ))
        }
      </List>

      <List>
        <Divider />
        <ListItem />
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText
              primary={t('settings')}
              onClick={() => toggleTab('settings')}
            />
          </ListItemButton>
        </ListItem>
        { !tabs['settings'] &&
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText
                primary={t('reset')}
                onClick={() => {if (window.confirm(t('resetData'))) resetTabs()}}
              />
            </ListItemButton>
          </ListItem>
        }
        <ListItem>
          <ListItemButton>
            <ListItemIcon onClick={() => i18n.changeLanguage('ua')}>
              <img src={UA} alt={'Українська'} />
            </ListItemIcon>
            <ListItemText primary={''} />
            <ListItemIcon onClick={() => i18n.changeLanguage('en')}>
              <img src={US} alt={'English'} />
            </ListItemIcon>
          </ListItemButton>
        </ListItem>
      </List>

      <TabNameDialog
        open={dialogOpen}
        onConfirm={handleConfirmPin}
        onCancel={() => setDialogOpen(false)}
        description={dialogText}
      />
    </div>
  );
}

export default TabList;