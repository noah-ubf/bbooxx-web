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

const ModuleList = ({ tabId, onChapterSelected }) => {
  const { store: { modules } } = useAppContext();
  const classes = useStyles();

  return <div className={classes.moduleList}>
    {
      modules.map((module) => (
        <div key={module.shortName}>
          <ModuleSelector module={module} tabId={tabId} onChapterSelected={onChapterSelected} />
        </div>
      ))
    }
  </div>
}

export default ModuleList;