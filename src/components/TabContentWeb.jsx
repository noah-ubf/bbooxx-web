import { Input } from '@mui/material';
import { useState, useRef, useEffect } from 'react';
import { makeStyles } from '@mui/styles';
import IconButton from '@mui/material/IconButton';
import LanguageIcon from '@mui/icons-material/Language';
import { useTranslation } from "react-i18next";

import {useAppContext} from '@lib/appContext';

const useStyles = makeStyles((theme) => ({
  webRoot: {
    flexGrow: 1,
    flexShrink: 1,
    display: 'flex',
    justifyContent: 'stretch',
    alignItems: 'stretch',
    flexDirection: 'column',
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
  iframe: {
    flexGrow: 1,
    flexShrink: 1,
    background: 'white',
  },
}));

const TabContentWeb = ({ tab }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const {
    handlers: { loadUrl },
  } = useAppContext();
  const [inputFocused, setInputFocused] = useState(false);
  const [url, setUrl] = useState(tab?.url || '');
  const iframeRef = useRef();

  useEffect(() => {
    if (iframeRef.current) iframeRef.current.src = tab.url;
  }, [tab.url]);

  const handleRead = () => {
    loadUrl(tab.id, url);
  }

  const keyDown = (callback) => (e) => {
    if (e.key === 'Enter') {
      callback?.();
    }
  }

  return (
    <div className={classes.webRoot}>
        <div className={classes.tools}>
          <div className={classes.searchWrapper}>
            <div className={classes.searchInputWrapper}>
              <Input 
                className={classes.searchInput}
                onKeyDown={keyDown(handleRead)}
                onChange={(e) => setUrl(e.target.value)}
                value={url ?? ''}
                placeholder={t('URL')}
                onFocus={() => setInputFocused(true)}
                onBlur={() => setInputFocused(false)}
              />
              <IconButton
                className={classes.iconButton}
                onClick={handleRead}
                aria-label="search"
              >
                <LanguageIcon />
              </IconButton>
            </div>
          </div>
        </div>
        { url
          ? <iframe ref={iframeRef} className={classes.iframe} title='iframe' />
          : <div>No URL specified</div>
        }
    </div>
  );
}

export default TabContentWeb