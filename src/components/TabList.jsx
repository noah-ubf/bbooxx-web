import { makeStyles } from "@mui/styles";
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import SettingsIcon from '@mui/icons-material/Settings';
import LinkIcon from '@mui/icons-material/Link';
import EditIcon from '@mui/icons-material/Edit';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import TagIcon from '@mui/icons-material/Tag';
import { useTranslation } from "react-i18next";
import { Divider } from "@mui/material";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import i18n from "i18next";

import { useAppContext } from "@lib/appContext";
import { AREA_IDS }  from "@lib/appContext/defaults";
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
  const tr = (key) => (key?.i18n ? t(key.i18n, key.params) : key);
  const classes = useStyles();
  const {
    store: { tabs, lastActiveDataTab },
    handlers: { cloneTab, closeTab, createEmptyTab, toggleTab, renameTab }
  } = useAppContext();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [[tabId, dialogText, isRename], setDialogProps] = useState([]);

  const tabsArray = tabs.filter((tab) => (
      !tab.hidden
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

  const handleAddSearchTab = () => {
    createEmptyTab('search', AREA_IDS.center);
  }

  const handleAddCustomTab = () => {
    const tab = createEmptyTab('custom', AREA_IDS.right, false);
    handleRename(tab);
  }

  const renderTabIcon = (tab) => {
    if (tab?.source?.type === 'search') return (
      <ListItemIcon>
        <SearchIcon/>
      </ListItemIcon>
    );
    if (tab?.source?.type === 'xrefs') return (
      <ListItemIcon>
        <LinkIcon/>
      </ListItemIcon>
    );
    if (tab?.type === 'memo') return (
      <ListItemIcon>
        <EditIcon/>
      </ListItemIcon>
    );
    if (tab?.custom) return (
      <ListItemIcon>
        <FormatListBulletedIcon/>
      </ListItemIcon>
    );
    if (tab?.type === 'strongs') return (
      <ListItemIcon>
        <TagIcon/>
      </ListItemIcon>
    );
    if (!tab?.type) return (
      <ListItemIcon>
        <TextSnippetIcon/>
      </ListItemIcon>
    );
  }

  return (
    <div className={classes.tabList} >
      <List>
        {
          tabsArray.map((tab) => (
            <ListItem
              key={tab.id}
              disablePadding
              selected={tab.id === lastActiveDataTab}
            >
              <ListItemButton>
                { renderTabIcon(tab) }
                <ListItemText primary={tr(tab.description)} onClick={() => toggleTab(tab.id)}/>
                {(tab.id !== 'collection' && tab.custom) && (
                  <ListItemIcon>
                    <DriveFileRenameOutlineIcon onClick={(e) => {e.stopPropagation(); handleRename(tab)}} />
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
        <ListItem onClick={handleAddSearchTab}>
          <ListItemIcon>
            <SearchIcon/>
          </ListItemIcon>
          <ListItemText>{t('newSearchTab')}</ListItemText>
        </ListItem>
        <ListItem onClick={handleAddCustomTab}>
          <ListItemIcon>
            <FormatListBulletedIcon/>
          </ListItemIcon>
          <ListItemText>{t('newList')}</ListItemText>
        </ListItem>
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