import classNames from 'classnames';
import * as _ from 'lodash';
import { makeStyles } from "@mui/styles";
  
const TYPES = {
  anchor: 'a',
  block: '[]',
  blockStart: '[',
  blockEnd: ']',
  dirStart: '<',
  dirEnd: '>',
  img: 'i',
  link: 'l',
  linebreak: 'br',
  strong: 's',
  text: 't',
  versenum: 'N',
};

const useStyles = makeStyles({
  'size--3': { fontSize: '70%', },
  'size--2': { fontSize: '80%', },
  'size--1': { fontSize: '90%', },
  'size-2': { fontSize: '110%', },
  'size-3': { fontSize: '120%', },
  'size-4': { fontSize: '130%', },
  'size-5': { fontSize: '140%', },
  'size-6': { fontSize: '150%', },
  'size-7': { fontSize: '160%', },
  
  link: {
    cursor: 'pointer',
    color: '#6666ff',
    textDecoration: 'none',
    '&:hover': {
      color: '#0000dd',
      textShadow: '1 1 1 #3333ff',
    }
  },
  
  strong: {
    marginLeft: '0.25em',
    cursor: 'pointer',
    fontSize: '75%',
    color: '#7f7fff',
    '&:hover': {
      color: '#00007f',
      textShadow: '1 1 1 #3333ff',
    }
  },
  
  bold: { fontWeight: 'bold' },
  italic: { fontStyle: 'italic' },
  
  verseNum: {
    fontWeight: 'bold',
    marginRight: '0.5em',
  },
  
  highlighttedWord: {
    backgroundColor: 'yellow',
  },
});

const LEXEM_TYPE = {
  vNum: '#',
  strong: 's',
  strong2: 'S',
  int: '0',
  tag: 'T',
  tagOpen: '[',
  tagClose: ']',
  lineBreak: '|',
  punctuation: '.',
  space: '_',
  word: 'w',
  other: '~',
  EOF: 'EOF',
};

const LexemList = ({displayStrong, fireLink, lexems, highlightedWord}) => {
  const classes = useStyles();

  const renderLexem = (l, i) => {
    const type = l[0];
    const data = l.substring(1);
    switch(type) {
      case LEXEM_TYPE.word:
      case LEXEM_TYPE.punctuation:
        return <span key={i}>{ data }</span>
      case LEXEM_TYPE.space:
        return ' ';
      case LEXEM_TYPE.strong:
        if (displayStrong) return <span className={classes.strong} onClick={() => displayStrong(data)}>{data}</span>;
        return false;
      default:
        return false;
    }
  }

  const renderTag = (type, data) => {

  }

  return (
    <>
      { lexems.map(renderLexem) }
    </>
  );
}

export default LexemList;
