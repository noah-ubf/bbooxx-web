import { makeStyles } from "@mui/styles";
import classNames from "classnames";
import NumbersIcon from '@mui/icons-material/Numbers';
// import { IconButton } from "@mui/material";
// import MenuBookIcon from '@mui/icons-material/MenuBook';
import StorageIcon from '@mui/icons-material/Storage';
import SettingsIcon from '@mui/icons-material/Settings';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import "@translations/i18n";
import Popover from '@mui/material/Popover';
import { useSprings, animated } from '@react-spring/web'
import { useDrag } from '@use-gesture/react'

import { useViewContext } from "@lib/viewContext";
import { useAppContext } from "@lib/appContext";
import { IconButton } from "@mui/material";
import US from "@ressources/US.png";
import UA from "@ressources/UA.png";
import { useEffect, useRef, useState } from "react";
import Settings from "./Settings";
import ModuleSelector from "./ModuleSelector";
import ModuleList from "./ModuleList";

const useStyles = makeStyles((theme) => ({
  menuWrapper: {
    height: 40,
    background: '#ddddff',
    flexShrink: 0,
    display: 'flex',
    justifyContent: 'stretch',
    alignItems: 'center',
    padding: theme.spacing(1),
    position: 'relative',
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
  },
  iconButton: {
    '&:not([disabled]) svg': {
      color: '#339999',
    },
    // padding: '0 !important',
  },
  floatMenu: {
    [theme.breakpoints.down('sm')]: {
      position: 'fixed',
      bottom: '2rem',
      left: '50vw',
      width: '120px',
      marginLeft: '-60px',
      borderRadius: '40px',
      background: '#99ffff',
      transform: 'scale(140%)',
    },
  },
  mobileHidden: {
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
  progressWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 3,
  },
  progress: {
    height: '100%',
    background: '#339999',
  },
}));

const isBasic = (tab) => ['initial', 'collection'].includes(tab.id);
const hasVerses = (tab) => (tab.loaded && tab.verses.length > 0)

const MenuWrapper = ({children}) => {
  const { t } = useTranslation();
  const tr = (key) => (key.i18n ? t(key.i18n, key.params) : key);
  const classes = useStyles();
  const ref = useRef();
  const { store: { showStrongs }, handlers: { toggleStrongs } } = useViewContext();
  const {
    store: { modules, mobileActiveTab, tabs },
    getters: { getNearChapterDescriptors },
    handlers: { loadText, toggleTab }
  } = useAppContext();
  const activeTabTitle = tabs[mobileActiveTab] ? tr(tabs[mobileActiveTab].description) : '';
  const [touched, setTouched] = useState(false);

  const [textSelectorAnchorEl, setTextSelectorAnchorEl] = useState(null);
  const handleShowTextSelector = (e) => {
    e.stopPropagation();
    if (!tabs[mobileActiveTab] || !tabs[mobileActiveTab].verses) return;
    const hash = window.location.hash.split('/')[0];
    window.location.hash = `${hash}/textSelector`;
    setTextSelectorAnchorEl(e.currentTarget);
  }
  function handleHideTextSelector() {
    // window.history.back();
    setTextSelectorAnchorEl(null);
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
  const currentModule = modules.find(m => m.shortName === currentModuleName);

  const nearest = getNearChapterDescriptors(descriptor);

  const percentage = nearest && nearest.current
    ? (nearest.current.chapter / nearest.current.chapterCount) * 100
    : false;

  useEffect(() => {
    const onHashChange = () => {
      const hashParts = window.location.hash.split('/');

      setTimeout(() => {
        if (hashParts[1] === "textSelector") setTextSelectorAnchorEl(ref.current);
        if (hashParts[1] === "settings") setSettingsAnchorEl(ref.current);
      }, 0);
    }

    window.addEventListener("load", onHashChange);
    window.addEventListener("hashchange", onHashChange);
    return () => {
      window.removeEventListener("load", onHashChange);
      window.removeEventListener("hashchange", onHashChange);
    }
  }, [settingsAnchorEl, textSelectorAnchorEl]);


  const bind = useDrag(async ({ active, movement: [mx], direction: [xDir], cancel }) => {
    if (active && Math.abs(mx) > window.innerWidth / 4) {
      xDir > 0 ? handlePrev() : handleNext();
      cancel();
    }
  }, {
    axis: 'x',
  });

  const handlePrev = () => {
    if (!nearest || !nearest.prev) return;
    loadText(nearest.prev.descriptor, nearest.prev.descriptor, mobileActiveTab);
  }

  const handleNext = async () => {
    if (!nearest || !nearest.next) return;
    loadText(nearest.next.descriptor, nearest.next.descriptor, mobileActiveTab);
  }

  useEffect(() => {
    let interval = null;
    const handleInteraction = () => {
      setTouched(true);

      if(interval) clearTimeout(interval);
      interval = setTimeout(() => {
        setTouched(false);
        interval = null;
      }, 3000);
    }

    document.addEventListener('scroll', handleInteraction);
    document.addEventListener('touchend', handleInteraction);

    return () => {
      document.removeEventListener('scroll', handleInteraction);
      document.addEventListener('touchend', handleInteraction);
    }
  });

  if (!tab) {
    setTimeout(() => toggleTab(Object.keys(tabs)[0]), 0);
    return null
  }

  return (
    <div ref={ref} className={classes.menuWrapper}>
      {/* <span
        className={classNames(classes.menuButton, classes.mobile)}
        onClick={() => setAppView(mobileAppView === 'menu' ? 'content' : 'menu')}
      >
        <MenuBookIcon />
      </span> */}

      {/* <Typography component="h2">BBOOXX</Typography> */}

      <span
        className={classNames(classes.menuButton, classes.mobile)}
        onClick={() => toggleTab('tabs')}
      >
        <StorageIcon />
      </span>

      {tab.verses &&
        <div className={classNames(classes.floatMenu, {[classes.mobileHidden]: !touched})}>
          <IconButton
            className={classNames(classes.iconButton)}
            onClick={handlePrev}
            disabled={!nearest || !nearest.prev}
          >
            <ArrowBackIosNewIcon />
          </IconButton>

          <IconButton
            className={classNames(classes.iconButton, classes.mobile)}
            onClick={handleShowTextSelector}
          >
            <LibraryBooksIcon />
          </IconButton>

          <IconButton
            className={classNames(classes.iconButton)}
            onClick={handleNext}
            disabled={!nearest || !nearest.next}
          >
            <ArrowForwardIosIcon />
          </IconButton>
        </div>
      }

      <IconButton onClick={toggleStrongs} >
        <NumbersIcon color={showStrongs ? 'secondary' : 'action'} />
      </IconButton>

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

      {
        !!percentage && <div className={classes.progressWrapper}>
          <div className={classes.progress} style={{width: `${percentage}%`}}></div>
        </div>
      }

      {textSelectorOpen &&
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
      }

      {settingsOpen &&
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
      }
    </div>
  );
}

export default MenuWrapper;