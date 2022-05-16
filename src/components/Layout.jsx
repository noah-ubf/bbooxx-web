import { makeStyles, useTheme } from "@mui/styles";
import { useEffect } from "react";

import MenuWrapper from "@components/MenuWrapper";
import LayoutArea from "@components/LayoutArea";
import {useAppContext} from "@lib/appContext";
import Sizer from "@components/Sizer";
import MobileContent from "@components/MobileContent";
import useWindowSize from "@lib/useWindowSize";
import { AREA_IDS } from "@lib/appContext/defaults";

const useStyles = makeStyles((theme) => ({
  layoutRoot: {
    background: theme.palette.background.main,
    color: theme.palette.text.main,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'stretch',
    width: '100vw',
    height: '100vh',
    overflow: 'hidden',
    [theme.breakpoints.down('md')]: {
      height: 'auto',
      minHeight: '90vh',
    },
  },
  menuWrapper: {
    [theme.breakpoints.down('md')]: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 2,
    }
  },
  content: {
    display: 'flex',
    flexDirection: 'row',
    flexGrow: 100,
    alignItems: 'stretch',
    justifyContent: 'stretch',
    overflow: 'hidden',
    [theme.breakpoints.down('md')]: {
      // display: 'block',
      marginTop: '56px',
      flexDirection: 'column',
    },
  },
  leftCol: {
    flexGrow: 0,
    flexShrink: 0,
    padding: '.2rem',
    height: '100%',
    overflow: 'hidden',
  },
  centerCol: {
    flexGrow: 100,
    flexShrink: 100,
    height: '100%',

    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'stretch',
    overflow: 'hidden',
  },
  centerTop: {
    flexGrow: 100,
    flexShrink: 100,
    overflow: 'hidden',
  },
  centerBottom: {
    flexGrow: 0,
    flexShrink: 0,
    overflow: 'hidden',
  },
  rightCol: {
    height: '100%',
    overflow: 'hidden',
  },
}));

const Layout = () => {
  const docSize = useWindowSize();
  const docWidth = docSize.width;
  const theme = useTheme();
  const md = +theme.breakpoints.values.md;
  const classes = useStyles();
  const { store: { loaded, areas }, handlers: { loadText, fetchModules } } = useAppContext();
  const isMobile = loaded && (docWidth <= md);
  const isDesktop = loaded && (docWidth > md);

  useEffect(() => {
    if (!loaded) {
      setTimeout(fetchModules, 0);
    }
  });

  useEffect(() => {
    if (loaded) {
      const searchParams = new URLSearchParams(window.location.search);
      const descriptor = searchParams.get('text');
      const description = searchParams.get('title') || descriptor;

      if (descriptor) {
        loadText(descriptor, description);
      }
    }
  });

  if (!loaded) return false;

  if (isMobile) return (
    <div className={classes.layoutRoot}>
      <div className={classes.menuWrapper}>
        <MenuWrapper />
      </div>
      <div className={classes.content}>
        <MobileContent />
      </div>
    </div>
  );

  if (isDesktop) {
    return (
      <div className={classes.layoutRoot}>
        <div className={classes.menuWrapper}>
          <MenuWrapper />
        </div>
        <div className={classes.content}>
          <Sizer side="right" initialSize={300}>
            <LayoutArea area={ areas[AREA_IDS.left] } />
          </Sizer>
          <div className={classes.centerCol}>
            <div className={classes.centerTop}>
              <LayoutArea area={ areas[AREA_IDS.center] } />
            </div>
            <div className={classes.centerBottom}>
              <Sizer side="top" initialSize={100}>
                <LayoutArea area={ areas[AREA_IDS.bottom] } />
              </Sizer>
            </div>
          </div>
          <div className={classes.rightCol}>
            <Sizer side="left" initialSize={200}>
              <LayoutArea area={ areas[AREA_IDS.right] } />
            </Sizer>
          </div>
        </div>
      </div>
    );
  }

  return (<></>)
}

export default Layout;