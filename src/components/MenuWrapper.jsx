import { makeStyles } from "@mui/styles";
import classNames from "classnames";
// import { IconButton } from "@mui/material";
// import MenuBookIcon from '@mui/icons-material/MenuBook';
import StorageIcon from '@mui/icons-material/Storage';
import SettingsIcon from '@mui/icons-material/Settings';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import Divider from '@mui/material/Divider';
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import "@translations/i18n";

import { useAppContext } from "@lib/appContext";
import { IconButton } from "@mui/material";
import US from "@ressources/US.png";
import UA from "@ressources/UA.png";
import { useEffect, useRef, useState } from "react";
import Settings from "./Settings";
import ViewOptions from "./ViewOptions";
import ModuleSelector from "./ModuleSelector";
import ModuleList from "./ModuleList";
import usePopup from "../lib/usePopup";

const useStyles = makeStyles((theme) => ({
  menuWrapper: {
    height: 40,
    background: theme.palette.background.verse,
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
    color: theme.palette.text.active,
    fontWeight: 'bold',
  },
  popupTitle: {
    margin: theme.spacing(1),
    lineHeight: 1.2,
    color: theme.palette.text.active,
    fontWeight: 'bold',
    paddingBottom: '1em',
    borderBottom: theme.palette.border.tab,
  },
  menuButton: {
    color: theme.palette.text.active,
    display: 'inline-block',
    verticalAlign: 'middle',
    marginLeft: theme.spacing(1),
  },
  mobile: {
    display: 'none',
    [theme.breakpoints.down('md')]: {
      display: 'inline-block',
    }
  },
  desktop: {
    [theme.breakpoints.down('md')]: {
      display: 'none !important',
    }
  },
  iconButton: {
    '&:not([disabled]) svg': {
      color: theme.palette.text.active,
    },
    // padding: '0 !important',
  },
  floatMenu: {
    [theme.breakpoints.down('md')]: {
      position: 'absolute',
      top: '100vh',
      left: '50vw',
      width: '50vw',
      marginLeft: '-25vw',
      borderRadius: '7vw',
      background: theme.palette.background.highlighted,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      transition: 'top .4s ease-out',
      '& svg': {
        height: '10vw',
        width: '10vw',
        maxHeight: '8vh',
        maxWidth: '8vh',
      }
    },
  },
  floatMenuVisible: {
    [theme.breakpoints.down('md')]: {
      top: '80vh',
      transition: 'top .4s ease-in',
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
    background: theme.palette.text.active,
  },
  sizeLimiter: {
    maxWidth: '75vw',
  },
  divider: {
    marginTop: 40,
  },
}));

// const isBasic = (tab) => ['initial', 'collection'].includes(tab.id);
// const hasVerses = (tab) => (tab.loaded && tab.verses.length > 0)

const MenuWrapper = ({children}) => {
  const { t } = useTranslation();
  const tr = (key) => (key.i18n ? t(key.i18n, key.params) : key);
  const classes = useStyles();
  const ref = useRef();
  const textSelectorOrigin = useRef();
  const viewOptionsOrigin = useRef();
  const settingsMenuOrigin = useRef();
  const {
    store: { modules },
    getters: { getNearChapterDescriptors },
    handlers: { getActiveTab, loadText, toggleTab }
  } = useAppContext();
  const activeTab = getActiveTab();
  const activeTabTitle = activeTab ? tr(activeTab.description) : '';
  const [touched, setTouched] = useState(false);

  const textSelector = usePopup('textSelectorPopup');
  const handleShowTextSelector = (e) => {
    e.stopPropagation();
    if (!activeTab || !activeTab.verses) return;
    textSelector.show(textSelectorOrigin);
  }
  const TextSelectorPopup = textSelector.Popup;
  const textSelectorRef = useRef();
  textSelectorRef.current = textSelector;

  const viewOptions = usePopup('viewOptionsPopup');
  const handleShowViewOptions = (e) => {
    e.stopPropagation();
    if (!activeTab || !activeTab.verses) return;
    viewOptions.show(viewOptionsOrigin);
  }
  const ViewOptionsPopup = viewOptions.Popup;
  const viewOptionsRef = useRef();
  viewOptionsRef.current = viewOptions;

  const settings = usePopup('settingsPopup');
  const SettingsPopup = settings.Popup;

  const descriptor = activeTab && activeTab.descriptor;

  const nearest = getNearChapterDescriptors(descriptor);
  const currentModule = modules.find(m => m.shortName === nearest?.current?.module);
  const currentBook = nearest?.current?.book;
  const currentChapter = nearest?.current?.chapter;

  const percentage = nearest && nearest.current
    ? (nearest.current.chapter / nearest.current.chapterCount) * 100
    : false;

  const handlePrev = () => {
    if (!nearest || !nearest.prev) return;
    loadText(nearest.prev.descriptor, nearest.prev.descriptor, activeTab?.id);
  }

  const handleNext = async () => {
    if (!nearest || !nearest.next) return;
    loadText(nearest.next.descriptor, nearest.next.descriptor, activeTab?.id);
  }

  useEffect(() => {
    let interval = null;
    const handleInteraction = () => {
      if (!touched) setTouched(true);

      if(interval) clearTimeout(interval);
      interval = setTimeout(() => {
        if (
          !textSelectorRef.current?.open
          && !viewOptionsRef.current?.open
        ) {
          setTouched(false);
          interval = null;
        } else {
          handleInteraction();
        }
      }, 3000);
    }

    document.addEventListener('scroll', handleInteraction);
    document.addEventListener('touchend', handleInteraction);

    return () => {
      document.removeEventListener('scroll', handleInteraction);
      document.addEventListener('touchend', handleInteraction);
    }
  });

  return (
    <div ref={ref} className={classes.menuWrapper}>
      <span
        className={classNames(classes.menuButton, classes.mobile)}
        onClick={() => toggleTab('tabs')}
      >
        <StorageIcon />
      </span>

      {activeTab?.verses &&
        <div className={classNames(classes.floatMenu, {[classes.floatMenuVisible]: touched})}>
          <IconButton
            className={classNames(classes.iconButton)}
            onClick={handlePrev}
            disabled={!nearest || !nearest.prev}
          >
            <ArrowBackIosNewIcon />
          </IconButton>

          <IconButton
            ref={textSelectorOrigin}
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

      <div className={classes.childrenWrapper}>
        {children}
      </div>

      <div
        ref={viewOptionsOrigin}
        className={classNames(classes.tabName, classes.mobile)}
        onClick={handleShowViewOptions}
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
        ref={settingsMenuOrigin}
        className={classNames(classes.iconButton, classes.desktop)}
        onClick={() => settings.show(settingsMenuOrigin)}
      >
        <SettingsIcon />
      </IconButton>

      {
        !!percentage && <div className={classes.progressWrapper}>
          <div className={classes.progress} style={{width: `${percentage}%`}}></div>
        </div>
      }

      <TextSelectorPopup>
        <div className={classes.sizeLimiter}>
          { currentModule
            ? (
              <ModuleSelector
                module={currentModule}
                isOpen={true}
                openBook={currentBook}
                openChapter={currentChapter}
                tabId={activeTab?.id}
                onChapterSelected={textSelector.hide} 
              />
            )
            : <ModuleList tabId={activeTab?.id} onChapterSelected={textSelector.hide} />
          }
        </div>
      </TextSelectorPopup>

      <ViewOptionsPopup>
        <div className={classes.sizeLimiter}>
          <div className={classes.popupTitle}>
            {activeTabTitle}
          </div>
          <ViewOptions/>
        </div>
      </ViewOptionsPopup>

      <SettingsPopup>
        <ViewOptions/>
        <br/>
        <Divider className={classes.divider} />
        <Settings/>
      </SettingsPopup>
    </div>
  );
}

export default MenuWrapper;