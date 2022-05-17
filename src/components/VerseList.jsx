import { makeStyles } from "@mui/styles";

import Verse from "@components/Verse";
import HeadingVerse from "@components/HeadingVerse";
import { useEffect, useRef, useState } from "react";
import { useAppContext } from "@lib/appContext";
import { CircularProgress } from "@mui/material";
import classNames from "classnames";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

const useStyles = makeStyles((theme) => ({
  verseList: {
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'stretch',
    overflow: 'hidden',
  },
  content: {
    flexGrow: 100,
    flexShrink: 100,
    overflow: 'auto',
  },
  descriptor: {
    borderBottom: 'solid 0.25em ' + theme.palette.background.active,
  },
  descriptorContent: {
    display: 'inline-block',
    borderTopLeftRadius: '.5em',
    borderTopRightRadius: '.5em',
    background: theme.palette.background.active,
    fontWeight: 'bold',
    fontSize: '.7em',
    padding: '.25em 1em .20em .75em',
    marginLeft: '.5em',
  },
  descriptorContentLink: {
    cursor: 'pointer',
    textDecoration: 'underline',
    '& svg': {
      height: '.5em',
      width: '.5em',
      marginLeft: '.3em',
      verticalAlign: 'bottom',
    }
  },
  verse: {
    background: theme.palette.background.verse,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'stretch',
    alignItems: 'stretch',
  },
  verseMenuToggler: {
    width: 40,
    height: '100%',
    flexGrow: 0,
    flexShrink: 0,
    cursor: 'pointer',
  },
  verseContent: {
    padding: '.5rem 1rem',
    flexGrow: 100,
    flexShrink: 100,
  },
  bottomSpace: {
    background: `linear-gradient(to bottom, ${theme.palette.background.verse}, ${theme.palette.background.main})`,
    height: '10vh',
    paddingBottom: '10vh',

    [theme.breakpoints.down('md')]: {
      height: '80vh',
    },
  },
  progress: {
    background: theme.palette.background.verse,
    textAlign: 'center',
    paddingTop: '5vh',
  },
  dropArea: {
    height: 10,
    background: theme.palette.background.active,
  },
}));

const PAGE_SIZE = 300;

const VerseList = ({tab, onRemove}) => {
  // const { store: { verses: storedVerses } } = useAppContext();
  const {
    getters: { getNearChapterDescriptors },
    handlers: { loadText, moveVerse, loadTabContent }
  } = useAppContext();
  const classes = useStyles();
  let descriptor = null;
  const ref = useRef();
  const { verses=[], custom } = tab;
  const [dragOver, setDragOver] = useState(false);

  const nearest = getNearChapterDescriptors(tab.descriptor);
  const highlightedWords = tab.source?.type === 'search' ? tab.source.text.split(/\s+/) : undefined;

  useEffect(() => {
    if (!tab.loaded) {
      setTimeout(() => loadTabContent(tab.id), 0)
    }
  }, [verses, tab, loadTabContent])

  useEffect(() => {
    window.scrollTo(0, 0);
    if (ref.current) ref.current.scrollTop = 0;
  }, [tab])

  const handleDrop = (e) => {
    e.preventDefault();
    const [ord, tabId] = e.dataTransfer.getData("verseId").split(':');
    if (tabId) {
      moveVerse(tabId, parseInt(ord), tab.id, dragOver);
    }
    setDragOver(false);
  }

  const handleDragEnter = (i) => ((e) => {
    if (custom && isVerse(e)) setDragOver(i);
  });

  const handleDragLeave = (i) =>((e) => {
    if (dragOver === i) setDragOver(false);
  })

  const preventDragLeave = (e) => e.stopPropagation();

  const getCurrentPage = () => {
    return verses.filter((v,i) => (i<PAGE_SIZE));
  }

  const isVerse = (e) => {
    const data = e.dataTransfer.getData("verseId");
    return !!data;
  }

  const handleChapterClick = (descriptor) => (
    nearest ? () => {} : () => loadText(descriptor, descriptor)
  );

  const renderVerse = (verse, descr, descriptor, index) => {
    if (verse.heading) {
      return (
        <HeadingVerse
          tab={tab}
          vOrder={index}
          verse={verse}
        />
      );
    } else {
      return (
        <>
          { descr !== descriptor && !nearest &&
            <div
              className={classes.descriptor}
              onDragLeave={preventDragLeave}
            >
              <span
                className={classNames(classes.descriptorContent, {[classes.descriptorContentLink]: !nearest})}
                onClick={handleChapterClick(descriptor)}
              >
                {descriptor}
                {!nearest && <OpenInNewIcon/>}
              </span>
            </div>
          }
          <div onDragLeave={preventDragLeave}>
            <Verse
              tab={tab}
              vOrder={index}
              verse={verse}
              onRemove={onRemove && (() => onRemove(index))}
              highlightedWords={highlightedWords}
            />
          </div>
        </>
      );
    }
  }

  return (
    <div className={classes.verseList}>
      {/* <div>
        <Input onKeyDown={keyDown}/>
        <IconButton type="submit" className={classes.iconButton} aria-label="search">
          <SearchIcon />
        </IconButton>
      </div> */}

      <div className={classes.content} ref={ref}>
        {
          tab.loaded
          ? getCurrentPage().map((verse, i) => {
            const descr = descriptor;
            descriptor = `(${verse.module})${verse.book}.${verse.chapter}`;

            return (
              <div
                key={i}
                onDrop={handleDrop}
                onDragEnter={handleDragEnter(i)}
                onDragLeave={handleDragLeave(i)}
              >
                {dragOver===i && <div className={classes.dropArea} onDragLeave={preventDragLeave}></div>}
                { renderVerse(verse, descr, descriptor, i) }
              </div>
          )})
          : <div className={classes.progress}><CircularProgress /></div>
        }
        <div
          className={classes.bottomSpace}
          onDrop={handleDrop}
          onDragEnter={handleDragEnter(-1)}
          onDragLeave={handleDragLeave(-1)}
        >
          { dragOver===-1 && <div className={classes.dropArea}></div> }
          {(tab.loaded && verses.length > PAGE_SIZE) ? `(${PAGE_SIZE} of ${verses.length} shown)` : ''}
        </div>
      </div>
    </div>
  );
}

export default VerseList;