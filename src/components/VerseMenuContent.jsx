import { useCallback, useState } from "react";
import LinkIcon from '@mui/icons-material/Link';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import PlaylistRemoveIcon from '@mui/icons-material/PlaylistRemove';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import NumbersIcon from '@mui/icons-material/Numbers';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import MoveUpIcon from '@mui/icons-material/MoveUp';
import { useTranslation } from "react-i18next";

import { useAppContext } from "@lib/appContext";

const VerseMenuContent = ({tab, vOrder, vRef, verse, isMobile, onRemove, onClose, onStrongs}) => {
  const { t } = useTranslation();
  const tr = (key) => (key.i18n ? t(key.i18n, key.params) : key);
  const {
    store: { tabs },
    handlers: { showReferences, copyToCollection, addToMemo, moveVerse }
  } = useAppContext();
  const [variant, setVariant] = useState('main');
  const strongs = verse.lexems.filter((l) => l[0] === 's').map((s) => s.substring(1));

  const collections = tabs.filter((t) => t.custom && t.id !== tab.id);

  const handleShowReferences = useCallback(() => {
    showReferences(verse);
    onClose();
  }, [showReferences, onClose, verse])

  const handleShowStrongs = useCallback(() => {
    onStrongs(strongs);
    onClose();
  }, [onStrongs, strongs, onClose])

  const handleCopyToCollection = useCallback((collection) => () => {
    copyToCollection(verse, collection.id);
    onClose();
  }, [verse, copyToCollection, onClose])

  const handleAddToMemo = useCallback(() => {
    console.log(vRef.current.innerHTML)
    addToMemo(vRef.current.innerHTML, verse);
    onClose();
  }, [addToMemo, onClose, verse])

  const handleRemove = useCallback((e) => {
    onRemove();
    onClose();
  }, [onRemove, onClose])

  const handleToggleCollectionMenu = () => {
    setVariant(variant === 'main' ? 'collections' : 'main');
  }

  const handleMoveUp = () => {
    moveVerse(tab.id, vOrder, tab.id, vOrder-1);
    onClose();
  }
  const handleMoveToTop = () => {
    moveVerse(tab.id, vOrder, tab.id, 0);
    onClose();
  }

  const renderCollectionsItem = () => {
    if (collections.lenght === 0) return false;
    if (collections.length === 1) return (
      <MenuItem onClick={handleCopyToCollection(collections[0])}>
        <ListItemIcon>
          <PlaylistAddIcon/>
        </ListItemIcon>
        <ListItemText>{t('copyToCollection')}</ListItemText>
      </MenuItem>
    );
    return (
      <MenuItem onClick={handleToggleCollectionMenu}>
        <ListItemIcon>
          <PlaylistAddIcon/>
        </ListItemIcon>
        <ListItemText>{t('copyToCollection')}</ListItemText>
        <ListItemIcon>
          <ChevronRightIcon/>
        </ListItemIcon>
      </MenuItem>
    );
  }

  if (variant === 'collections') {
    return (
      <>
        <MenuItem onClick={handleToggleCollectionMenu}>
          <ListItemIcon>
            <ChevronLeftIcon/>
          </ListItemIcon>
          <ListItemText>{t('back')}</ListItemText>
        </MenuItem>
        {
          collections.map((c) => (
            <MenuItem key={c.id} onClick={handleCopyToCollection(c)}>
              <ListItemIcon>
                <PlaylistAddIcon/>
              </ListItemIcon>
              <ListItemText>{tr(c.description)}</ListItemText>
            </MenuItem>
          ))
        }
      </>
    );
  }

  return (
    <>
      <MenuItem onClick={handleShowReferences}>
        <ListItemIcon>
          <LinkIcon/>
        </ListItemIcon>
        <ListItemText>{t('crossrefs')}</ListItemText>
      </MenuItem>

      { strongs.length > 0 &&
        <MenuItem onClick={handleShowStrongs}>
          <ListItemIcon>
            <NumbersIcon/>
          </ListItemIcon>
          <ListItemText>{t('showStrongs')}</ListItemText>
        </MenuItem>
      }

      { renderCollectionsItem() }

      <MenuItem onClick={handleAddToMemo}>
        <ListItemIcon>
          <NoteAddIcon/>
        </ListItemIcon>
        <ListItemText>{t('addToMemo')}</ListItemText>
      </MenuItem>

      {isMobile && vOrder > 0 && tab.custom &&
        <MenuItem onClick={handleMoveUp}>
          <ListItemIcon>
            <MoveUpIcon />
          </ListItemIcon>
          <ListItemText>{t('moveUp')}</ListItemText>
        </MenuItem>
      }

      {isMobile && vOrder > 0 && tab.custom &&
        <MenuItem onClick={handleMoveToTop}>
          <ListItemIcon>
            <MoveUpIcon />
          </ListItemIcon>
          <ListItemText>{t('moveToTop')}</ListItemText>
        </MenuItem>
      }

      { onRemove &&
        <MenuItem onClick={handleRemove}>
          <ListItemIcon>
            <PlaylistRemoveIcon color={'warning'}/>
          </ListItemIcon>
          <ListItemText>{t('removeFromCollection')}</ListItemText>
        </MenuItem>
      }
    </>
  );
}

export default VerseMenuContent;