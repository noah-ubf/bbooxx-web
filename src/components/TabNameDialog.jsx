import { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { useTranslation } from "react-i18next";
import "@translations/i18n";

const TabNameDialog = ({open, onConfirm, onCancel, description}) => {
  const { t } = useTranslation();
  const tr = (key) => (key && key.i18n ? t(key.i18n, key.params) : t(key));
  const initialText = tr(description) || t('newList');
  const [text, setText] = useState(initialText);
console.log({description})
  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogTitle>{t('renameTab')}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label={t('setTabName')}
          type="text"
          fullWidth
          variant="standard"
          defaultValue={initialText}
          onChange={(e) => setText(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>{t('cancel')}</Button>
        <Button onClick={() => onConfirm(text)}>{t('confirm')}</Button>
      </DialogActions>
    </Dialog>
  );
}

export default TabNameDialog;