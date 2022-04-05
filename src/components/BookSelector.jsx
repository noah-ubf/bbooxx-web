import { Container } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { makeStyles } from "@mui/styles";

import {useAppContext} from "@lib/appContext";
import classNames from "classnames";

const useStyles = makeStyles((theme) => ({
  bookSelector: {
    border: 'solid silver 1px',
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

    [theme.breakpoints.down('sm')]: {
      minHeight: '2rem',
      lineHeight: '2rem',
      fontSize: '1.5rem',
    },

    '&:hover': {
      background: 'silver',
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
    border: 'solid silver 1px',
    borderRadius: 2,
    cursor: 'pointer',
    textAlign: 'center',
    margin: '0 2px 2px 0',
    padding: 0,
    userSelect: 'none',

    '&:hover': {
      background: 'silver',
    },

    [theme.breakpoints.down('sm')]: {
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
    background: '#ddddff',
  }
}));

const BookSelector = ({module, book, openChapter=null, tabId, isOpen, onChapterSelected}) => {
  const [open, setOpen] = useState(isOpen);
  const classes = useStyles();
  const ref = useRef();

  const { handlers: { loadChapter } } = useAppContext();

  const chapterRange = [...Array(parseInt(book.ChapterQty, 10))].keys();

  useEffect(() => {
    if (isOpen) {
      ref.current.scrollIntoView();
    }
  });

  return (
    <div className={classes.bookSelector} ref={ref}>
      <Container className={classes.book} onClick={() => setOpen(!open)}>{ book.FullName }</Container>
      { open &&
        <div className={classes.content}>
        {
          [...chapterRange].map((_, i) => (
            <div key={i}
              className={classNames(classes.chapter, {[classes.selectedChapter]: (+openChapter === i+1)})}
              onClick={async () => {
                await loadChapter(module, book, i+1, tabId);
                if (onChapterSelected) onChapterSelected(module, book, i+1);
              }}
            >
              { (i+1) }
            </div>
          ))
        }
        </div>
      }
    </div>
  );
}

export default BookSelector;