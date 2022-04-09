import { makeStyles } from "@mui/styles";

import ModuleList from '@components/ModuleList';
import VerseList from "@components/VerseList";
import Settings from "@components/Settings";
import {useAppContext} from "@lib/appContext";
import Memo from "@components/Memo";
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
    border: 'solid 2px #ddddff',
    padding: '.2rem',
    marginRight: '.5rem',
    [theme.breakpoints.down('sm')]: {
      marginRight: 0,
    },
  },
  status: {
    fontSize: '.6rem',
    padding: '.1rem',
    background: '#eeeeee',
    textAlign: 'right',
  },
}));

const TabContent = ({tabId}) => {
  const classes = useStyles();
  const { store: { tabs }, handlers: { updateMemo } } = useAppContext();
  const ref = useRef();
  const xxx = tabs[tabId] ? tabs[tabId].verses : tabId;

  useEffect(() => {
    window.scrollTo(0, 0);
    if (ref.current) setTimeout(() => {
      console.log('qq', ref.current.scrollTop);
      ref.current.scrollTop = 0
    }, 100);
  }, [xxx])


  if (!tabs[tabId]) return (
    <div className={classes.content}>
      &nbsp;
    </div>
  );

  switch(tabs[tabId].type) {
    case 'memo': return <Memo defaultValue={tabs[tabId].content || ''} onChange={(e) => updateMemo(tabId, e)}/>;
    case 'modules': return <ModuleList/>;
    case 'settings': return <Settings/>;
    default: return (
      <>
        <div className={classes.content} tabIndex={1} ref={ref}>
          <VerseList verses={ tabs[tabId].verses } />
        </div>
        <div className={classes.status}>{`${tabs[tabId].verses.length} verses`}</div>
      </>
    );
  }
}

export default TabContent;