import { makeStyles } from "@mui/styles";
import classNames from "classnames";
// import NumbersIcon from '@mui/icons-material/Numbers';
// import { IconButton } from "@mui/material";
// import MenuBookIcon from '@mui/icons-material/MenuBook';
import StorageIcon from '@mui/icons-material/Storage';
import SettingsIcon from '@mui/icons-material/Settings';
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import "@translations/i18n";
import Popover from '@mui/material/Popover';

// import { useViewContext } from "@lib/viewContext";
import { useAppContext } from "@lib/appContext";
import { IconButton } from "@mui/material";
import US from "@ressources/US.png";
import UA from "@ressources/UA.png";
import { useEffect, useState } from "react";
import Settings from "./Settings";
import ModuleSelector from "./ModuleSelector";
import ModuleList from "./ModuleList";
import { BOLD } from "draft-js/lib/DefaultDraftInlineStyle";

const useStyles = makeStyles((theme) => ({
  menuWrapper: {
    height: 40,
    background: '#ddddff',
    flexShrink: 0,
    display: 'flex',
    justifyContent: 'stretch',
    alignItems: 'center',
    padding: theme.spacing(1),
  },
  childrenWrapper: {
    flexGrow: 1,
    flexShrink: 1,
  },
  tabName: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    margin: theme.spacing(1),
    lineHeight: '38px',
    color: '#339999',
    fontWeight: 'bold',
  },
  menuButton: {
    color: '#339999',
    display: 'inline-block',
    verticalAlign: 'middle',
    marginLeft: theme.spacing(1),
  },
  mobile: {
    display: 'none',
    [theme.breakpoints.down('sm')]: {
      display: 'inline-block',
    }
  },
  desktop: {
    [theme.breakpoints.down('sm')]: {
      display: 'none !important',
    }
  }
}));

const MenuWrapper = ({children}) => {
  const { t } = useTranslation();
  const tr = (key) => (key.i18n ? t(key.i18n, key.params) : key);
  const classes = useStyles();
  // const { store: { showStrongs }, handlers: { toggleStrongs } } = useViewContext();
  const { store: { modules, mobileAppView, mobileActiveTab, tabs }, handlers: { setAppView } } = useAppContext();
  const activeTabTitle = tabs[mobileActiveTab] ? tr(tabs[mobileActiveTab].description) : '';

  const [textSelectorAnchorEl, setTextSelectorAnchorEl] = useState(null);
  const handleShowTextSelector = (e) => {
    window.location.hash = "#textSelector";
    setTextSelectorAnchorEl(e.currentTarget);
  }
  const handleHideTextSelector = () => {
    setTextSelectorAnchorEl(null);
    window.history.back();
  }
  const textSelectorOpen = Boolean(textSelectorAnchorEl);

  const [settingsAnchorEl, setSettingsAnchorEl] = useState(null);
  const handleShowSettings = (e) => {
    window.location.hash = "#settings";
    setSettingsAnchorEl(e.currentTarget);
  }
  const handleCloseSettings = () => {
    setSettingsAnchorEl(null);
    window.history.back();
  }
  const settingsOpen = Boolean(settingsAnchorEl);

  const getCurrentScripture = () => {
    const descriptorItems = tabs[mobileActiveTab].descriptor ? tabs[mobileActiveTab].descriptor.split(';') : null;
    const isMulty = descriptorItems && descriptorItems.length > 1;
    if (!descriptorItems || isMulty) return [0, 0];
    const parts = /^\(([^)]+)\)([^.]+)\./.exec(descriptorItems[0]);
    console.log(parts);
    return [parts[1], parts[2]];
  }
  const [currentModuleName, currentBook] = getCurrentScripture();
  const currentModule = modules.find(m => m.BibleShortName === currentModuleName);


  useEffect(() => {
    const onHashChange = () => {
      setTextSelectorAnchorEl(window.location.hash === "#textSelector" ? textSelectorAnchorEl : null);
      setSettingsAnchorEl(window.location.hash === "#settings" ? settingsAnchorEl : null);
    }
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, [settingsAnchorEl, textSelectorAnchorEl]);


  return (
    <div className={classes.menuWrapper}>
      {/* <IconButton onClick={toggleStrongs} >
        <NumbersIcon color={showStrongs ? 'secondary' : 'action'} />
      </IconButton> */}
      {/* <span
        className={classNames(classes.menuButton, classes.mobile)}
        onClick={() => setAppView(mobileAppView === 'menu' ? 'content' : 'menu')}
      >
        <MenuBookIcon />
      </span> */}

      {/* <Typography component="h2">BBOOXX</Typography> */}

      <span
        className={classNames(classes.menuButton, classes.mobile)}
        onClick={() => setAppView(mobileAppView === 'tablist' ? 'content' : 'tablist')}
      >
        <StorageIcon />
      </span>

      <div className={classes.childrenWrapper}>
        {children}
      </div>

      <span
        className={classNames(classes.tabName, classes.mobile)}
        onClick={handleShowTextSelector}
      >
        {activeTabTitle}
      </span>

      <IconButton
        className={classNames(classes.iconButton, classes.desktop)}
        onClick={() => i18n.changeLanguage('ua')}
      >
        <img src={UA} alt={'Українська'} />
      </IconButton>

      <IconButton
        className={classNames(classes.iconButton, classes.desktop)}
        onClick={() => i18n.changeLanguage('en')}
      >
        <img src={US} alt={'English'} />
      </IconButton>

      <IconButton
        className={classNames(classes.iconButton, classes.desktop)}
        onClick={handleShowSettings}
      >
        <SettingsIcon />
      </IconButton>

      <Popover
        id={'textSelectorPopover'}
        open={textSelectorOpen}
        anchorEl={textSelectorAnchorEl}
        onClose={handleHideTextSelector}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        { currentModule
          ? (
            <ModuleSelector
              module={currentModule}
              isOpen={true}
              openBook={currentBook}
              tabId={mobileActiveTab}
              onChapterSelected={handleHideTextSelector} 
            />
          )
          : <ModuleList tabId={mobileActiveTab} onChapterSelected={handleHideTextSelector} />
        }
      </Popover>

      <Popover
        id={'settingsPopover'}
        open={settingsOpen}
        anchorEl={settingsAnchorEl}
        onClose={handleCloseSettings}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Settings/>
      </Popover>
    </div>
  );
}

export default MenuWrapper;