import { makeStyles, useTheme } from "@mui/styles";
import { useEffect } from "react";

import MenuWrapper from "@components/MenuWrapper";
import LayoutArea from "@components/LayoutArea";
import {useAppContext} from "@lib/appContext";
import Sizer from "@components/Sizer";
import MobileContent from "@components/MobileContent";
import useWindowSize from "@lib/useWindowSize";

const useStyles = makeStyles((theme) => ({
  layoutRoot: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'stretch',
    width: '100vw',
    height: '100vh',
    overflow: 'hidden',
    [theme.breakpoints.down('sm')]: {
      height: 'auto',
      minHeight: '90vh',
    },
  },
  menuWrapper: {
    [theme.breakpoints.down('sm')]: {
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
    [theme.breakpoints.down('sm')]: {
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
  const sm = +theme.breakpoints.values.sm;
  const classes = useStyles();
  const { store: { loaded, areas }, handlers: { loadText } } = useAppContext();
  const leftColArea = areas.find((a) => a.id === 'leftCol');
  const centerColArea = areas.find((a) => a.id === 'centerCol');
  const rightColArea = areas.find((a) => a.id === 'rightCol');
  const bottomColArea = areas.find((a) => a.id === 'bottomCol');
  const isMobile = (docWidth <= sm);
  const isDesktop = (docWidth > sm);

  useEffect(() => {
    if (!loaded) {
      const searchParams = new URLSearchParams(window.location.search);
      const descriptor = searchParams.get('text');
      const description = searchParams.get('title') || descriptor;

      if (descriptor) {
        loadText(descriptor, description);
      }
    }
  });

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
            <LayoutArea area={ leftColArea } />
          </Sizer>
          <div className={classes.centerCol}>
            <div className={classes.centerTop}>
              <LayoutArea area={ centerColArea } />
            </div>
            <div className={classes.centerBottom}>
              <Sizer side="top" initialSize={100}>
                <LayoutArea area={ bottomColArea } />
              </Sizer>
            </div>
          </div>
          <div className={classes.rightCol}>
            <Sizer side="left" initialSize={200}>
              <LayoutArea area={ rightColArea } />
            </Sizer>
          </div>
        </div>
      </div>
    );
  }

  return (<></>)
}

export default Layout;