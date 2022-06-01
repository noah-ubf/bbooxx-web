import { Input, Select, MenuItem } from '@mui/material';
import { useState, useEffect, useRef } from 'react';
import { makeStyles } from '@mui/styles';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { useTranslation } from "react-i18next";

import ModuleList from '@components/ModuleList';
import VerseList from '@components/VerseList';
import Settings from '@components/Settings';
import {useAppContext} from '@lib/appContext';
import Memo from '@components/Memo';
import TabList from '@components/TabList';

const useStyles = makeStyles((theme) => ({
  content: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 100,
    flexShrink: 100,
    alignItems: 'stretch',
    justifyContent: 'stretch',
    overflow: 'hidden',
    border: theme.palette.border.light,
    padding: '.2rem',
    marginRight: '.5rem',
    [theme.breakpoints.down('md')]: {
      marginRight: 0,
    },
  },
  tools: {
    alignItems: 'stretch',
    color: theme.palette.text.main,
    background: theme.palette.background.active,
    position: 'relative',
    padding: theme.spacing(1.2, 1),
    borderRadius: theme.spacing(1),
  },
  searchWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'stretch',
    flexWrap: 'wrap',
    marginRight: theme.spacing(-.5),
  },
  moduleSelect: {
    marginRight: theme.spacing(1),
  },
  searchInputWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'stretch',
    flexWrap: 'nowrap',
    flexGrow: 1,
    flexShrink: .6,
  },
  searchInput: {
    whiteSpace: 'nowrap',
    flexGrow: 1,
    flexShrink: 1,
  },
}));

const TabContent = ({tab}) => {
  const classes = useStyles();
  const {
    store: { modules },
    handlers: { loadText, search, updateMemo, toggleTab, removeVerse },
  } = useAppContext();
  const [searchString, setSearchString] = useState('');
  const [descriptor, setDescriptor] = useState('');
  const [selectedModule, setSelectedModule] = useState('');
  const ref = useRef();
  const { t } = useTranslation();
  const xxx = tab?.verses || tab?.id;

  useEffect(() => {
    window.scrollTo(0, 0);
    if (ref.current) ref.current.scrollTop = 0
  }, [xxx])

  useEffect(() => {
    setSelectedModule(tab?.source?.module);
    setSearchString(tab?.source?.text || '');
    setDescriptor(tab?.descriptor);
  }, [tab])

  if (!tab) return (
    <div className={classes.content}>
      &nbsp;
    </div>
  );

  const handleFocus = () => {
    if (!tab.active) toggleTab(tab.id);
  }

  const handleSearch = () => {
    if (selectedModule) {
      search(selectedModule, searchString, tab.id);
    }
  }

  const handleRead = () => {
    if (descriptor!=='') {
      loadText(descriptor, descriptor, tab.id);
    }
  }

  const keyDown = (callback) => (e) => {
    if (e.key === 'Enter') {
      callback?.();
    }
  }

  const renderTools = () => {
    if (tab?.source?.type === 'search') {
      return (
        <div className={classes.tools}>
          <div className={classes.searchWrapper}>
            { !!tab?.source?.module &&
              <Select
                key={tab.id}
                className={classes.moduleSelect}
                size="small"
                value={selectedModule ?? ''}
                onChange={(e) => setSelectedModule(e.target.value)}
              >
                {
                  modules.map((m) => (
                    <MenuItem key={m.shortName} value={m.shortName}>
                      {m.shortName}
                    </MenuItem>
                  ))
                }
              </Select>
            }
            <div className={classes.searchInputWrapper}>
              <Input 
                className={classes.searchInput}
                onKeyDown={keyDown(handleSearch)}
                onChange={(e) => setSearchString(e.target.value)}
                value={searchString ?? ''}
                placeholder={t('search')}
              />
              <IconButton
                className={classes.iconButton}
                onClick={handleSearch}
                aria-label="search"
              >
                <SearchIcon />
              </IconButton>
            </div>
          </div>
        </div>
      );
    } else if (tab.custom) {
      return(
        <div className={classes.tools}>
          <div className={classes.searchWrapper}>
            <div className={classes.searchInputWrapper}>
              <Input 
                className={classes.searchInput}
                onKeyDown={keyDown(handleRead)}
                onChange={(e) => setDescriptor(e.target.value)}
                value={descriptor ?? ''}
                placeholder={t('read')}
              />
              <IconButton
                className={classes.iconButton}
                onClick={handleRead}
                aria-label="search"
              >
                <MenuBookIcon />
              </IconButton>
            </div>
          </div>
        </div>
      );
    } else {
    }
    return false;
  }

  switch(tab.type) {
    case 'memo': return <Memo value={tab.content || ''} onChange={(e) => updateMemo(tab.id, e)} onFocus={handleFocus}/>;
    case 'modules': return <ModuleList/>;
    case 'settings': return <Settings/>;
    case 'tabs': return <TabList />;
    default:
      return !!tab && (
        <div className={classes.content} tabIndex={1} ref={ref} onFocus={handleFocus}>
          { renderTools() }
          <VerseList
            tab={ tab }
            onRemove={tab.custom ? (i) => removeVerse(i, tab.id) : null}
          />
        </div>
      );
  }
}

export default TabContent;