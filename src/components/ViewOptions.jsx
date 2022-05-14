import { makeStyles } from "@mui/styles";
import { useTranslation } from "react-i18next";
// import { Divider } from "@mui/material";
import NumbersIcon from '@mui/icons-material/Numbers';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
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
}));

const ViewOptions = () => {
  const { t } = useTranslation();
  const classes = useStyles();
  const { store: { mode, showStrongs }, handlers: { toggleMode, toggleStrongs } } = useViewContext();

return (
    <div className={classes.settings} >
      <List>
        <ListItem disablePadding className={classes.desktop}>
          <ListItemButton>
            <ListItemIcon>
              <NumbersIcon color={showStrongs ? 'secondary' : 'action'} />
            </ListItemIcon>
            <ListItemText
              primary={t('showStrongs')}
              onClick={toggleStrongs}
            />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding className={classes.desktop}>
          <ListItemButton>
            <ListItemIcon>
              {
                mode === 'light' ? <LightModeIcon /> : <DarkModeIcon/>
              }
            </ListItemIcon>
            <ListItemText
              primary={mode === 'light' ? t('themeDark') : t('themeLight')}
              onClick={toggleMode}
            />
          </ListItemButton>
        </ListItem>
     </List>
    </div>
  );
}

export default ViewOptions;