import { makeStyles } from "@mui/styles";
import LexemList from "@components/LexemList";
import classNames from "classnames";

const useStyles = makeStyles((theme) => {
  return {
    descriptor: {
      fontSize: '110%',
      fontWeight: 'bold',
    },
    verse: {
      alignItems: 'stretch',
      color: theme.palette.text.main,
      background: theme.palette.background.active,
      position: 'relative',
      padding: theme.spacing(1.2, 1),
      borderRadius: theme.spacing(1),
    },
    verseContent: {
      display: 'inline-block',
      padding: '.5rem .5rem .5rem .2rem',
    },
  }
});

const HeadingVerse = ({tab, vOrder, verse}) => {
  const classes = useStyles();

  return (
    <div
      key={verse.descriptor}
      className={classNames(classes.verse, {[classes.heading]: !!verse.heading})}
      id={ [vOrder, tab.id].join(':') }
    >
      <div className={classes.descriptor}>{verse.descriptor}</div>
      <span className={classes.verseContent}>
        <LexemList
          lexems={verse.lexems}
          displayStrong={null}
        />
      </span>
    </div>
  );
}

export default HeadingVerse;