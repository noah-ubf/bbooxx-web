import { useState } from "react";
import LinkIcon from '@mui/icons-material/Link';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import PlaylistRemoveIcon from '@mui/icons-material/PlaylistRemove';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import { useTranslation } from "react-i18next";

import { useAppContext } from "@lib/appContext";

const VerseMenuContent = ({tab, vOrder, verse, onRemove, onClose}) => {
  const { t } = useTranslation();
  const tr = (key) => (key.i18n ? t(key.i18n, key.params) : key);
  const {
    store: { tabs },
    handlers: { showReferences, copyToCollection, addToMemo }
  } = useAppContext();
  const [variant, setVariant] = useState('main');

  const collections = tabs.filter((t) => t.custom && t.id !== tab.id);

  const handleShowReferences = () => {
    showReferences(verse);
    onClose();
  }

  const handleCopyToCollection = (collection) => () => {
    copyToCollection(verse, collection.id);
    onClose();
  }

  const handleAddToMemo = () => {
    addToMemo(verse);
    onClose();
  }

  const handleRemove = (e) => {
    onRemove();
    onClose();
  }

  const handleToggleCollectionMenu = () => {
    setVariant(variant === 'main' ? 'collections' : 'main');
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
          <ListItemText>Back</ListItemText>
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

      { renderCollectionsItem() }

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
    </>
  );
}

export default VerseMenuContent;