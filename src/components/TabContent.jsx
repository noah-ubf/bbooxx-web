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

const TabContent = ({tabId}) => {
  const classes = useStyles();
  const { store: { tabs, mobileActiveTab }, handlers: { updateMemo, toggleTab, removeVerse } } = useAppContext();
  const ref = useRef();
  const xxx = tabs[tabId] ? tabs[tabId].verses : tabId;

  useEffect(() => {
    window.scrollTo(0, 0);
    if (ref.current) ref.current.scrollTop = 0
  }, [xxx])


  if (!tabs[tabId]) return (
    <div className={classes.content}>
      &nbsp;
    </div>
  );

  const handleFocus = () => {
    if (tabId !== mobileActiveTab) toggleTab(tabId);
  }

  switch(tabs[tabId].type) {
    case 'memo': return <Memo value={tabs[tabId].content || ''} onChange={(e) => updateMemo(tabId, e)}/>;
    case 'modules': return <ModuleList/>;
    case 'settings': return <Settings/>;
    case 'tabs': return <TabList />;
    default:
      return (
        <div className={classes.content} tabIndex={1} ref={ref} onFocus={handleFocus}>
          <VerseList
            tab={ tabs[tabId] }
            onRemove={tabs[tabId].custom ? (i) => removeVerse(i, tabId) : null}
          />
        </div>
      );
  }
}

export default TabContent;