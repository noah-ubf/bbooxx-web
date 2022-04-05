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
import { useSprings, animated } from '@react-spring/web'
import { useDrag } from '@use-gesture/react'

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
  const {
    store: { modules, mobileAppView, mobileActiveTab, tabs },
    getters: { getNearChapterDescriptors },
    handlers: { setAppView, loadText }
  } = useAppContext();
  const activeTabTitle = tabs[mobileActiveTab] ? tr(tabs[mobileActiveTab].description) : '';

  const [textSelectorAnchorEl, setTextSelectorAnchorEl] = useState(null);
  const handleShowTextSelector = (e) => {
    if (!tabs[mobileActiveTab] || !tabs[mobileActiveTab].verses) return;
    const hash = window.location.hash.split('/')[0];
    window.location.hash = `${hash}/textSelector`;
    setTextSelectorAnchorEl(e.currentTarget);
  }
  const handleHideTextSelector = () => {
    setTextSelectorAnchorEl(null);
    window.history.back();
  }
  const textSelectorOpen = Boolean(textSelectorAnchorEl);

  const [settingsAnchorEl, setSettingsAnchorEl] = useState(null);
  const handleShowSettings = (e) => {
    const hash = window.location.hash.split('/')[0];
    window.location.hash = `${hash}/settings`;
    setSettingsAnchorEl(e.currentTarget);
  }
  const handleCloseSettings = () => {
    setSettingsAnchorEl(null);
    window.history.back();
  }
  const settingsOpen = Boolean(settingsAnchorEl);

  const tab = tabs[mobileActiveTab];
  const descriptor = tab && tab.descriptor;

  const getCurrentScripture = () => {
    if (!tab || !tab.verses) return [];
    const descriptorItems = tab.descriptor ? tab.descriptor.split(';') : null;
    const isMulty = descriptorItems && descriptorItems.length > 1;
    if (!descriptorItems || isMulty) return [0, 0];
    const parts = /^\(([^)]+)\)([^.]+)\.(\d+)/.exec(descriptorItems[0]);
    return [parts[1], parts[2], parts[3]];
  }
  const [currentModuleName, currentBook, currentChapter] = getCurrentScripture();
  const currentModule = modules.find(m => m.BibleShortName === currentModuleName);

  const nearest = getNearChapterDescriptors(descriptor);

  useEffect(() => {
    const onHashChange = () => {
      const hashParts = window.location.hash.split('/');
      setTextSelectorAnchorEl(hashParts[1] === "textSelector" ? textSelectorAnchorEl : null);
      setSettingsAnchorEl(hashParts[1] === "settings" ? settingsAnchorEl : null);
    }
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, [settingsAnchorEl, textSelectorAnchorEl]);


  const bind = useDrag(({ active, movement: [mx], direction: [xDir], cancel }) => {
    if (active && Math.abs(mx) > window.innerWidth / 4) {
      const direction = xDir > 0 ? 'prev' : 'next';
      if (nearest[direction]) {
        loadText(nearest[direction].descriptor, nearest[direction].descriptor, mobileActiveTab);
      }
      cancel();
    }
  }, {
    axis: 'x',
  });


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

      <div
        className={classNames(classes.tabName, classes.mobile)}
        onClick={handleShowTextSelector}
        {...bind()}
      >
        {activeTabTitle}
      </div>

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
              openChapter={currentChapter}
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