import { Input } from "@mui/material";
import { useState } from "react";
import { makeStyles } from "@mui/styles";
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';

import { useAppContext } from "@lib/appContext";
import BookSelector from "@components/BookSelector";

const useStyles = makeStyles((theme) => ({
  moduleSelector: {
    border: 'solid #99d5cc 2px',
    margin: '.1rem .3rem .8rem .1rem',
    minWidth: 150,
    padding: 0,

    [theme.breakpoints.down('sm')]: {
      margin: '.2rem',
    },
  },
  module: {
    minHeight: '1.1rem',
    lineHeight: '1.1rem',
    fontSize: '.8rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    padding: '.2rem .3rem',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    userSelect: 'none',

    '&:hover': {
      background: 'silver',
    },

    [theme.breakpoints.down('sm')]: {
      minHeight: '2rem',
      lineHeight: '2rem',
      fontSize: '1.2rem',
    },
  },
  content: {
    padding: '.1rem',
  },
  searchWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'stretch',
    padding: '0 .5rem',
  },
  searchInput: {
    flexGrow: 1,
    flexShrink: 1,
  },
}));

const ModuleSelector = ({module, tabId, isOpen=false, openBook=null, openChapter=null, onChapterSelected}) => {
  const [open, setOpen] = useState(isOpen);
  const [searchString, setSearchString] = useState(false);
  const { handlers: { search } } = useAppContext();
  const classes = useStyles();

  const keyDown = (e) => {
    if (e.key === 'Enter') {
      search(module, searchString);
    }
  }

  return (
    <div className={classes.moduleSelector}>
      <div className={classes.module} onClick={() => setOpen(!open)}>{ module.BibleName }</div>
      { open &&
        <div className={classes.content}>
          <div className={classes.searchWrapper}>
            <Input 
              className={classes.searchInput}
              onKeyDown={keyDown}
              onChange={(e) => setSearchString(e.target.value)}
              placeholder={'Search'}
            />
            <IconButton
              className={classes.iconButton}
              onClick={() => search(module, searchString)}
              aria-label="search"
            >
              <SearchIcon />
            </IconButton>
          </div>
          {
            module.books.map((book, i) => (
              <BookSelector key={i}
                module={module}
                book={book}
                isOpen={book.FullName === openBook || book.ShortName.indexOf(openBook) !== -1}
                tabId={tabId}
                onChapterSelected={onChapterSelected}
                openChapter={(book.FullName === openBook || book.ShortName.indexOf(openBook) !== -1) ? openChapter : null}
              />
            ))
          }
        </div>
      }
    </div>
  );
}

export default ModuleSelector;