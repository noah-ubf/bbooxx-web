import { makeStyles } from "@mui/styles";
import SettingsIcon from '@mui/icons-material/Settings';
import { useTranslation } from "react-i18next";
import { Divider } from "@mui/material";
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import {useAppContext} from "@lib/appContext";
import { useViewContext } from "@lib/viewContext";
import "@translations/i18n";

const useStyles = makeStyles((theme) => ({
  settings: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'space-between',
    width: '100%',
    minHeight: '100%',
    overflow: 'hidden',
    padding: '.2rem',
  },
  divider: {
    marginTop: 40,
  },
}));

const Settings = () => {
  const { t } = useTranslation();
  const classes = useStyles();
  const {
    handlers: { resetTabs }
  } = useAppContext();
  const { store: { mode }, handlers: { toggleMode } } = useViewContext();

  return (
    <div className={classes.settings} >
      <List>
        <ListItem disablePadding className={classes.desktop}>
          <ListItemButton>
            <ListItemIcon>
              {
                mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon/>
              }
            </ListItemIcon>
            <ListItemText
              primary={mode === 'light' ? t('themeDark') : t('themeLight')}
              onClick={toggleMode}
            />
          </ListItemButton>
        </ListItem>
        <br/>
        <Divider className={classes.divider} />
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText
              primary={t('reset')}
              onClick={() => {if (window.confirm(t('resetData'))) resetTabs()}}
            />
          </ListItemButton>
        </ListItem>
      </List>
    </div>
  );
}

export default Settings;