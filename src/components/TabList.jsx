import { makeStyles } from "@mui/styles";
import CloseIcon from '@mui/icons-material/Close';
// import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined';
import LockIcon from '@mui/icons-material/Lock';
import SettingsIcon from '@mui/icons-material/Settings';
import { useTranslation } from "react-i18next";
import { Divider } from "@mui/material";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import i18n from "i18next";

import {useAppContext} from "@lib/appContext";
import "@translations/i18n";
import US from "@ressources/US.png";
import UA from "@ressources/UA.png";

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
    store: { tabs, mobileActiveTab, mobileAppView },
    handlers: { cloneTab, closeTab, toggleTab, resetTabs }
  } = useAppContext();

  const tabsArray = Object.keys(tabs)
    .map((key) => ({id: key, ...tabs[key]}))
    .filter((tab) => (tab && !tab.hidden && (tab.id !== 'initial' || tab.verses.length > 0)))
    .sort((a,b) => (a.locked ? a : b));

  return (
    <div className={classes.tabList} >
      <List>
        {
          tabsArray.map((tab) => (
            <ListItem key={tab.id} disablePadding>
              <ListItemButton>
                <ListItemText primary={tr(tab.description)} onClick={() => toggleTab(tab.id)}/>
                <ListItemIcon>
                  { tab.locked
                    ? (tab.id === 'initial' ? <PushPinOutlinedIcon onClick={() => cloneTab(tab.id, true)} /> : <LockIcon />)
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
    </div>
  );
}

export default TabList;