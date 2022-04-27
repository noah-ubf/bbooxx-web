import { makeStyles } from "@mui/styles";

import Verse from "@components/Verse";
import { useEffect, useRef, useState } from "react";
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
    paddingBottom: '10vh',

    [theme.breakpoints.down('sm')]: {
      height: '80vh',
    },
  },
  progress: {
    textAlign: 'center',
    marginTop: '5vh',
  },
  dropArea: {
    height: 10,
    background: '#99d5cc',
  },
}));

const PAGE_SIZE = 300;

const VerseList = ({tab, onRemove}) => {
  // const { store: { verses: storedVerses } } = useAppContext();
  const { handlers: { moveVerse, loadTabContent } } = useAppContext();
  const classes = useStyles();
  let descriptor = null;
  const ref = useRef();
  const { verses=[], custom } = tab;
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    if (!tab.loaded) {
      setTimeout(() => loadTabContent(tab.id), 0)
    }
    window.scrollTo(0, 0);
    if (ref.current) ref.current.scrollTop = 0;
  }, [verses, tab, loadTabContent])

  const handleDrop = (e) => {
    e.preventDefault();
    const [srcType, ord, tabId] = e.dataTransfer.getData("text").split('__');
    if (srcType === 'verse') {
      moveVerse(tabId, parseInt(ord), tab.id, dragOver);
      console.log(`Move verse ${ord} from ${tabId} to ${tab.id} at ${dragOver}`)
    }
    setDragOver(false);
  }

  const handleDragEnter = (i) => ((e) => {
    console.log(`Enter ${i}`, e.target)
    if (custom && isVerse(e)) setDragOver(i);
  });

  const handleDragLeave = (i) =>((e) => {
    console.log(`Leave ${i}`, e.target)
    if (dragOver === i) setDragOver(false);
  })

  const preventDragLeave = (e) => e.stopPropagation();

  const getCurrentPage = () => {
    return verses.filter((v,i) => (i<PAGE_SIZE));
  }

  const isVerse = (e) => {
    const [srcType, ord, tabId] = e.dataTransfer.getData("text").split('__');
    console.log('TEXT:', e.dataTransfer.getData("text"));
    return (srcType === 'verse');
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
                { descr !== descriptor &&
                  <div className={classes.descriptor} onDragLeave={preventDragLeave}>
                    <span className={classes.descriptorContent}>{descriptor}</span>
                  </div>
                }
                <div onDragLeave={preventDragLeave}>
                  <Verse
                    tab={tab}
                    vOrder={i}
                    verse={verse}
                    onRemove={onRemove && (() => onRemove(i))}
                  />
                </div>
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