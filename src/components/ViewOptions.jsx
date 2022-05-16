import { makeStyles } from "@mui/styles";
import { useTranslation } from "react-i18next";
// import { Divider } from "@mui/material";
import NumbersIcon from '@mui/icons-material/Numbers';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
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

function toggleFullScreen() {
  if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
}

const ViewOptions = () => {
  const { t } = useTranslation();
  const classes = useStyles();
  const { store: { showStrongs }, handlers: { toggleStrongs } } = useViewContext();

return (
    <div className={classes.settings} >
      <List>
        <ListItem disablePadding>
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

        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>
              { document.fullscreenElement ? <FullscreenExitIcon/> : <FullscreenIcon/> }
            </ListItemIcon>
            <ListItemText
              primary={t('fullscreen')}
              onClick={toggleFullScreen}
            />
          </ListItemButton>
        </ListItem>
     </List>
    </div>
  );
}

export default ViewOptions;