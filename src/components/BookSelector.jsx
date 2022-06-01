import { Container,Input } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { makeStyles } from "@mui/styles";
import { useTranslation } from "react-i18next";

import {useAppContext} from "@lib/appContext";
import classNames from "classnames";
import { useViewContext } from '@lib/viewContext';

const useStyles = makeStyles((theme) => ({
  bookSelector: {
    border: theme.palette.border.highlighted,
    marginBottom: '.1rem',
  },
  book: {
    minHeight: '1.1rem',
    lineHeight: '1.1rem',
    fontSize: '.8rem',
    cursor: 'pointer',
    padding: '.1rem',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    userSelect: 'none',

    [theme.breakpoints.down('md')]: {
      minHeight: '2rem',
      lineHeight: '2rem',
      fontSize: '1.5rem',
    },

    '&:hover': {
      background: theme.palette.background.hover,
    }
  },
  content: {
    padding: '.1rem',
  },
  chapter: {
    display: 'inline-block',
    fontSize: '.75rem',
    width: '1.5rem',
    height: '1.5rem',
    lineHeight: '1.5rem',
    border: theme.palette.border.highlighted,
    borderRadius: 2,
    cursor: 'pointer',
    textAlign: 'center',
    margin: '0 2px 2px 0',
    padding: 0,
    userSelect: 'none',

    '&:hover': {
      background: theme.palette.background.hover,
    },

    [theme.breakpoints.down('md')]: {
      fontSize: '1.3rem',
      width: '2rem',
      height: '2rem',
      lineHeight: '2rem',
      '&:nth-child(n+100)': {
        fontSize: '1rem',
      },
    },
  },
  selectedChapter: {
    background: theme.palette.background.selected,
  },
  wideChapter: {
    width: '3rem',
    fontSize: '.75rem',
  },
}));

const BookSelector = ({module, book, openChapter=null, tabId, isOpen, onChapterSelected}) => {
  const [open, setOpen] = useState(isOpen);
  const [searchString, setSearchString] = useState('');
  const { t } = useTranslation();
  const classes = useStyles();
  const ref = useRef();
  const { handlers: { startLoading, finishLoading } } = useViewContext();

  const { handlers: { loadChapter } } = useAppContext();

  const chapterQty = parseInt(book.chapterQty, 10);
  const chapterRange = [...Array(chapterQty+1).keys()]
    .filter((i) => book.chapterZero ? true : (i>0))
    .filter((i) => (!searchString || `${i}`.indexOf(searchString) !== -1))
    .filter((i, j) => (j < 200));


  useEffect(() => {
    if (isOpen) {
      ref.current.scrollIntoView();
    }
  });

  return (
    <div className={classes.bookSelector} ref={ref}>
      <Container className={classes.book} onClick={() => setOpen(!open)}>{ book.name }</Container>
      {
        chapterQty > 200 && open &&
        <div className={classes.searchWrapper}>
          <Input 
            className={classes.searchInput}
            onChange={(e) => setSearchString(e.target.value)}
            placeholder={t('filter')}
          />
        </div>
      }
      { open &&
        <div className={classes.content}>
        {
          [...chapterRange].map((i) => (
            <div key={i}
              className={classNames(
                classes.chapter,
                {
                  [classes.selectedChapter]: (+openChapter === i),
                  [classes.wideChapter]: chapterQty > 999,
                }
              )}
              onClick={async (e) => {
                e.stopPropagation();
                startLoading();
                await loadChapter(module, book, i, tabId);
                finishLoading();
                if (onChapterSelected) onChapterSelected(module, book, i);
              }}
            >
              { i }
            </div>
          ))
        }
        </div>
      }
    </div>
  );
}

export default BookSelector;