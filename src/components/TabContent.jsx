import { makeStyles } from "@mui/styles";

import ModuleList from '@components/ModuleList';
import VerseList from "@components/VerseList";
import Settings from "@components/Settings";
import {useAppContext} from "@lib/appContext";
import Memo from "@components/Memo";
import TabList from "@components/TabList";
import { useEffect, useRef } from "react";

const useStyles = makeStyles((theme) => ({
  content: {
    display: 'flex',
    flexDirection: 'row',
    flexGrow: 100,
    flexShrink: 100,
    alignItems: 'stretch',
    justifyContent: 'stretch',
    overflow: 'hidden',
    border: theme.palette.border.light,
    padding: '.2rem',
    marginRight: '.5rem',
    [theme.breakpoints.down('md')]: {
      marginRight: 0,
    },
  },
}));

const TabContent = ({tab}) => {
  const classes = useStyles();
  const { handlers: { updateMemo, toggleTab, removeVerse } } = useAppContext();
  const ref = useRef();
  const xxx = tab?.verses || tab?.id;

  useEffect(() => {
    window.scrollTo(0, 0);
    if (ref.current) ref.current.scrollTop = 0
  }, [xxx])


  if (!tab) return (
    <div className={classes.content}>
      &nbsp;
    </div>
  );

  const handleFocus = () => {
    if (!tab.active) toggleTab(tab.id);
  }

  switch(tab.type) {
    case 'memo': return <Memo value={tab.content || ''} onChange={(e) => updateMemo(tab.id, e)} onFocus={handleFocus}/>;
    case 'modules': return <ModuleList/>;
    case 'settings': return <Settings/>;
    case 'tabs': return <TabList />;
    default:
      return !!tab && (
        <div className={classes.content} tabIndex={1} ref={ref} onFocus={handleFocus}>
          <VerseList
            tab={ tab }
            onRemove={tab.custom ? (i) => removeVerse(i, tab.id) : null}
          />
        </div>
      );
  }
}

export default TabContent;