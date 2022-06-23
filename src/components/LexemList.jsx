import classNames from 'classnames';
import * as _ from 'lodash';
import { makeStyles } from "@mui/styles";
  
const useStyles = makeStyles((theme) => {
  return {
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
      color: theme.palette.text.link.main,
      textDecoration: 'none',
      '&:hover': {
        color: theme.palette.text.link.hover,
        textShadow: theme.palette.shadow.text,
      }
    },

    hidden: {
      display: 'none',
    },
    
    strong: {
      marginLeft: '0.25em',
      cursor: 'pointer',
      fontSize: '75%',
      color: theme.palette.text.strongs.main,
      '&:hover': {
        color: theme.palette.text.strongs.hover,
        textShadow: theme.palette.shadow.text,
      }
    },
    
    bold: { fontWeight: 'bold' },
    italic: { fontStyle: 'italic' },
    
    verseNum: {
      fontWeight: 'bold',
      marginRight: '0.5em',
    },
    
    highlighttedWord: {
      backgroundColor: 'rgba(255,255,0,.15)',
      padding: '4px',
      margin: '-4px',
      display: 'inline-block',
      borderRadius: '4px',
    },

    vNum: {
      display: 'block',
      fontSize: '90%',
      fontWeight: 'bold',
      color: theme.palette.text.tag,
      lineHeight: 1.2,
    },

    tag__h4: {
      fontSize: '250%',
    },

    class__Index: {
      display: 'block',
      fontSize: '110%',
      color: theme.palette.text.header,
      lineHeight: 1.5,
    },

    class__transcription: {
      color: theme.palette.text.transcription,
    },

    face__Heb: {
      fontSize: '140%',
    },

    face__Grk: {
      fontSize: '120%',
    },
  }
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

const BLOCK_LEVEL_ELEMENTS = [
  'ADDRESS', 'ARTICLE', 'ASIDE', 'BLOCKQUOTE', 'CANVAS', 'DD', 'DIV', 'DL', 'DT', 'FIELDSET', 'FIGCAPTION',
  'FIGURE', 'FOOTER', 'FORM', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'HEADER', 'HR', 'LI', 'MAIN', 'NAV',
  'NOSCRIPT', 'OL', 'OUTPUT', 'P', 'PRE', 'SECTION', 'TABLE', 'TFOOT', 'UL', 'VIDEO'
];

const parseJSON = (str) => {
  try{
    return JSON.parse(str) || {};
  } catch(e) {
    return {};
  }
}

const lexemListToTree = (list) => {
  let pos = 0;

  const convert = () => {
    const ret = [];
    while(pos < list.length && list[pos].type !== LEXEM_TYPE.tagClose) {
      if (list[pos].type === LEXEM_TYPE.tagOpen) {
        if (list[pos].data[0] === '{') { // Old API version
          const data = parseJSON(list[pos].data);
          pos++;
          ret.push({type: 'block', data: {...data, children: convert()}});
        } else { // New API version
          const colonPos = list[pos].data.indexOf(':');
          const tag = list[pos].data.substring(0, colonPos);
          const props = parseJSON(list[pos].data.substring(colonPos + 1));
          pos++;
          ret.push({type: 'block', data: {tag, props, children: convert()}});
        }
      } else {
        ret.push(list[pos++]);
      }
    }

    if (pos < list.length) pos++;

    return ret;
  }

  return convert();
}

const LexemList = ({displayStrong, fireLink, lexems=[], highlightedWords}) => {
  const classes = useStyles();

  const groupped = lexemListToTree(lexems?.map((l) => {
    if (!l[0]) return {type:'', data:''}
    const type = l[0];
    const data = l.substring(1);
    return {type, data};
  }));

  const getClassList = (props) => {
    return props
      ? Object.keys(props).map(
        (key) => (
          classes[`${key}__${props[key]}`] || `${key}___${props[key]}`
        )
      )
      : [];
  }

  const isHighlighted = (data) => {
    return highlightedWords
      ? highlightedWords.some((w) => 
          data.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .indexOf(w.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()) !== -1
        )
      : false;
  }

  const renderLexem = ({type, data}, i) => {
    switch(type) {
      case 'block': {
        const blockClasses = classNames(
          `tag__${data.tag}`,
          ...getClassList(data.props),
          {[classes.hidden]: !displayStrong && data.props?.class === 'strongs'},
        );
        if (data.tag==='P') {
          return (
            <p key={i} className={blockClasses}>
              { data.children.map(renderLexem)}
            </p>
          );
        }
        if (data.tag==='FONT') {
          const style = {};
          if (data.props.color) style.color = data.props.color;
          return (
            <span key={i} className={blockClasses} style={style}>
              { data.children.map(renderLexem)}
            </span>
          );
        }
        if (BLOCK_LEVEL_ELEMENTS.includes(data.tag)) {
          return (
            <div key={i} className={blockClasses}>
              { data.children.map(renderLexem)}
            </div>
          );
        }
        return (
          <span key={i} className={blockClasses}>
            { data.children.map(renderLexem)}
          </span>
        );
      }
      case LEXEM_TYPE.vNum:
        return <span key={i} className={classes.vNum}>{ data }</span>
      case LEXEM_TYPE.word:
        return <span key={i} className={classNames({[classes.highlighttedWord]: isHighlighted(data)})}>{ data }</span>
      case LEXEM_TYPE.punctuation:
        return <span key={i}>{ data }</span>
      case LEXEM_TYPE.int:
        return <strong key={i}>{ data }</strong>
      case LEXEM_TYPE.lineBreak:
        return <br key={i}/>;
      case LEXEM_TYPE.space:
        return ' ';
      case LEXEM_TYPE.strong:
        if (displayStrong) return <span key={i} className={classes.strong} onClick={() => displayStrong(data.trim())}>{data}</span>;
        return false;
      default:
        return false;
    }
  }

  const renderTag = (type, data) => {

  }

  return (
    <>
      { groupped.map(renderLexem) }
    </>
  );
}

export default LexemList;
