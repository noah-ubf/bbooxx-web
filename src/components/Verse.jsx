import { useState } from "react";
import { makeStyles } from "@mui/styles";
import { Menu } from "@mui/material";
import LinkIcon from '@mui/icons-material/Link';
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

const Verse = ({verse}) => {
  const { t } = useTranslation();
  const { handlers: { showReferences } } = useAppContext();
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

  const open = Boolean(anchorEl);

  return (
    <div key={verse.descriptor} className={classes.verse}>
      <span aria-describedby={vid} className={classes.verseMenuToggler} onClick={handleClick}>
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
      </Menu>
    </div>
  );
}

export default Verse;