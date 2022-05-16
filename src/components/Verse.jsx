import { useState } from "react";
import { makeStyles } from "@mui/styles";
import { Menu } from "@mui/material";
import LinkIcon from '@mui/icons-material/Link';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import PlaylistRemoveIcon from '@mui/icons-material/PlaylistRemove';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import { useTranslation } from "react-i18next";

import LexemList from "@components/LexemList";
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
  const { handlers: { showReferences, copyToCollection, addToMemo, loadStrongs } } = useAppContext();
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

  const handleShowReferences = () => {
    showReferences(verse);
    setAnchorEl(null);
  }

  const handleCopyToCollection = () => {
    copyToCollection(verse);
    setAnchorEl(null);
  }

  const handleAddToMemo = () => {
    addToMemo(verse);
    setAnchorEl(null);
  }

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
        <MenuItem onClick={handleShowReferences}>
          <ListItemIcon>
            <LinkIcon/>
          </ListItemIcon>
          <ListItemText>{t('crossrefs')}</ListItemText>
        </MenuItem>

        { tab.id !== 'collection' && <MenuItem onClick={handleCopyToCollection}>
            <ListItemIcon>
              <PlaylistAddIcon/>
            </ListItemIcon>
            <ListItemText>{t('copyToCollection')}</ListItemText>
          </MenuItem>
        }

        <MenuItem onClick={handleAddToMemo}>
          <ListItemIcon>
            <NoteAddIcon/>
          </ListItemIcon>
          <ListItemText>{t('addToMemo')}</ListItemText>
        </MenuItem>
        { onRemove &&
          <MenuItem onClick={handleRemove}>
            <ListItemIcon>
              <PlaylistRemoveIcon color={'warning'}/>
            </ListItemIcon>
            <ListItemText>{t('removeFromCollection')}</ListItemText>
          </MenuItem>
        }
      </Menu>
    </div>
  );
}

export default Verse;