import { makeStyles } from "@mui/styles";

import Verse from "@components/Verse";
import { useEffect, useRef } from "react";
import { useAppContext } from "@lib/appContext";
import { CircularProgress } from "@mui/material";

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
    borderBottom: 'solid 0.25em #99d5cc',
  },
  descriptorContent: {
    display: 'inline-block',
    borderTopLeftRadius: '.5em',
    borderTopRightRadius: '.5em',
    background: '#99d5cc',
    fontWeight: 'bold',
    fontSize: '.7em',
    padding: '.25em 1em .20em .75em',
    marginLeft: '.5em',
  },
  verse: {
    background: '#ddddff',
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
    background: 'linear-gradient(to bottom, #ddddff, #ffffff)',
    height: '10vh',
    paddingTop: '10vh',

    [theme.breakpoints.down('sm')]: {
      height: '80vh',
    },
  },
  progress: {
    textAlign: 'center',
    marginTop: '5vh',
  }
}));

const PAGE_SIZE = 300;

const VerseList = ({tab, onRemove}) => {
  // const { store: { verses: storedVerses } } = useAppContext();
  const { handlers: { moveVerse, loadTabContent } } = useAppContext();
  const classes = useStyles();
  let descriptor = null;
  const ref = useRef();
  const { verses=[] } = tab;

  useEffect(() => {
    if (!tab.loaded) {
      setTimeout(() => loadTabContent(tab.id), 0)
    }
    window.scrollTo(0, 0);
    if (ref.current) ref.current.scrollTop = 0;
  }, [verses, tab, loadTabContent])

  const drop = (e) => {
    e.preventDefault();
    const [srcType, ord, tabId] = e.dataTransfer.getData("text").split('__');
    if (srcType === 'verse') {
      moveVerse(tabId, parseInt(ord), tab.id);
      console.log(`Move verse ${ord} from ${tabId} to ${tab.id} at -1`)
    }
  }

  const getCurrentPage = () => {
    return verses.filter((v,i) => (i<PAGE_SIZE));
  }

  return <div className={classes.verseList}>
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

        return [
          (
            descr === descriptor ? null
            : <div key={descriptor} className={classes.descriptor}><span className={classes.descriptorContent}>{descriptor}</span></div>
          ),
          (<Verse key={verse.descriptor} tab={tab} vOrder={i} verse={verse} onRemove={onRemove && (() => onRemove(i))}/>),
        ];
      })
      : <div className={classes.progress}><CircularProgress /></div>
    }
    <div className={classes.bottomSpace} onDrop={drop}>
      {(tab.loaded && verses.length > PAGE_SIZE) ? `(${PAGE_SIZE} of ${verses.length} shown)` : ''}
    </div>
    </div>
  </div>
}

export default VerseList;