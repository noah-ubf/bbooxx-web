import { useEffect } from "react";
import { useAppContext } from "@lib/appContext";
import ModuleSelector from "@components/ModuleSelector";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
  moduleList: {
    height: '100%',
    width: '100%',
    overflow: 'auto',
  },
});

const ModuleList = ({ tabId }) => {
  const { store: { loaded, modules }, handlers: { fetchModules } } = useAppContext();
  const classes = useStyles();

  useEffect(() => {
    if ( !loaded ) {
      fetchModules();
    }
  });

  return <div className={classes.moduleList}>
    {
      modules.map((module) => (
        <div key={module.BibleShortName}>
          <ModuleSelector module={module} tabId={tabId}/>
        </div>
      ))
    }
  </div>
}

export default ModuleList;