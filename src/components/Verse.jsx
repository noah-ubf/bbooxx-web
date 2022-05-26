import { useState } from "react";
import { makeStyles } from "@mui/styles";
import { Menu } from "@mui/material";
import { useTranslation } from "react-i18next";

import LexemList from "@components/LexemList";
import VerseMenuContent from '@components/VerseMenuContent'
import { useAppContext } from "@lib/appContext";
import { useViewContext } from "@lib/viewContext";

let vID = 1;
const getVID = () => vID++;

const useStyles = makeStyles((theme) => {
  return {
    verse: {
      alignItems: 'stretch',
      color: theme.palette.text.main,
      background: theme.palette.background.verse,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'stretch',
      position: 'relative',
    },
    verseMenuToggler: {
      cursor: 'pointer',
      display: 'inline-block',
      flexGrow: 0,
      flexShrink: 0,
      fontSize: '.8rem',
      fontWeight: 'bold',
      lineHeight: '2rem',
      minHeight: '100% !important',
      minWidth: '30px !important',
      padding: '0 .2rem 0 0',
      textAlign: 'right',
      width: '30px !important',
      touchAction: 'none',

      '&:hover': {
        background: theme.palette.background.light,
      },
    },
    verseContent: {
      display: 'inline-block',
      flexGrow: 100,
      flexShrink: 100,
      padding: '.5rem .5rem .5rem .2rem',
    },
  }
});

const Verse = ({tab, vOrder, verse, onRemove, highlightedWords}) => {
  const { t } = useTranslation();
  const { handlers: { loadStrongs } } = useAppContext();
  const { store: { showStrongs } } = useViewContext();
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const [draggable, setDraggable] = useState(false);
  const [vid] = useState(getVID());

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleRemove = (e) => {
    onRemove();
    setAnchorEl(null);
  }

  const handleDisplayStrongs = (strongsNum) => {
    loadStrongs(strongsNum);
  }

  const drag = (e) => {
    e.dataTransfer.setData("verseId", e.target.id);
  }

  const open = Boolean(anchorEl);

  return (
    <div
      key={verse.descriptor}
      className={classes.verse}
      draggable={draggable}
      onDragStart={drag}
      id={ [vOrder, tab.id].join(':') }
    >
      <span
        aria-describedby={vid}
        className={classes.verseMenuToggler}
        onClick={handleClick}
        onMouseEnter={() => setDraggable(true)}
        onMouseLeave={() => setDraggable(false)}
      >
        {verse.num}
      </span>
      <span className={classes.verseContent}>
        <LexemList
          lexems={verse.lexems}
          displayStrong={(showStrongs || verse.module==='Strongs') ? handleDisplayStrongs : null}
          highlightedWords={highlightedWords}
        />
      </span>
      <Menu
        id={vid}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <VerseMenuContent
          tab={tab}
          vOrder={vOrder}
          verse={verse}
          onRemove={handleRemove}
          onClose={handleClose}
        />
      </Menu>
    </div>
  );
}

export default Verse;