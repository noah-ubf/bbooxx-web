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

const useStyles = makeStyles({
  verse: {
    alignItems: 'stretch',
    background: '#ddddff',
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

    '&:hover': {
      background: '#ccccee',
    },
  },
  verseContent: {
    display: 'inline-block',
    flexGrow: 100,
    flexShrink: 100,
    padding: '.5rem .5rem .5rem .2rem',
  }
});

const Verse = ({tab, vOrder, verse, onRemove}) => {
  const { t } = useTranslation();
  const { handlers: { showReferences, copyToCollection, addToMemo, moveVerse } } = useAppContext();
  const { store: { showStrongs } } = useViewContext();
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
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

  const drag = (e) => e.dataTransfer.setData("text", e.target.id);
  const drop = (e) => {
    e.preventDefault();
    const [srcType, ord, tabId] = e.dataTransfer.getData("text").split('__');
    if (srcType === 'verse') {
      moveVerse(tabId, ord, tab.id, vOrder);
    }
  }

  const open = Boolean(anchorEl);

  return (
    <div key={verse.descriptor} className={classes.verse} onDrop={drop}>
      <span
        aria-describedby={vid}
        className={classes.verseMenuToggler}
        onClick={handleClick}
        draggable={!!tab.custom}
        onDragStart={drag}
        id={ ['verse', vOrder, tab.id].join('__') }
      >
        {verse.num}
      </span>
      <span className={classes.verseContent}>
        <LexemList lexems={verse.lexems} displayStrong={showStrongs}/>
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
        <MenuItem onClick={handleCopyToCollection}>
          <ListItemIcon>
            <PlaylistAddIcon/>
          </ListItemIcon>
          <ListItemText>{t('copyToCollection')}</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleAddToMemo}>
          <ListItemIcon>
            <NoteAddIcon/>
          </ListItemIcon>
          <ListItemText>{t('addToMemo')}</ListItemText>
        </MenuItem>
        { onRemove &&
          <MenuItem onClick={onRemove}>
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