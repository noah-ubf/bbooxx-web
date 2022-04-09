import { makeStyles } from "@mui/styles";

import Verse from "@components/Verse";
import { useEffect, useRef } from "react";

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
    background: '#ddddff',
    height: '10vh',

    [theme.breakpoints.down('sm')]: {
      height: '80vh',
    },
  },
}));

const VerseList = ({verses}) => {
  // const { store: { verses: storedVerses } } = useAppContext();
  const classes = useStyles();
  let descriptor = null;
  const ref = useRef();

  useEffect(() => {
    console.log(ref.current);
    window.scrollTo(0, 0);
    if (ref.current) ref.current.scrollTop = 0;
  }, [])

  return <div className={classes.verseList}>
    {/* <div>
      <Input onKeyDown={keyDown}/>
      <IconButton type="submit" className={classes.iconButton} aria-label="search">
        <SearchIcon />
      </IconButton>
    </div> */}

    <div className={classes.content} ref={ref}>
    {
      verses.map((verse) => {
        const descr = descriptor;
        descriptor = `(${verse.module})${verse.book}.${verse.chapter}`;

        return [
          (
            descr === descriptor ? null
            : <div key={descriptor} className={classes.descriptor}><span className={classes.descriptorContent}>{descriptor}</span></div>
          ),
          (<Verse key={verse.descriptor} verse={verse}/>),
        ];
      })
    }
    <div className={classes.bottomSpace}></div>
    </div>
  </div>
}

export default VerseList;