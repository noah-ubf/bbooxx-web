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

const LexemList = ({displayStrong, fireLink, lexems, highlightedWord}) => {
  const classes = useStyles();
  let cont = false;
  let br = false;
  let beginning = true;
  const last = lexems.length - 1;// _.findLastIndex(this.props.lexems, l => (l.t !== 'linebreak' && l.t !== '/block' && l.t !== 'block/'));
  const highlightedWords = (highlightedWord || '').split(' ');

  return _.map(lexems, (l, i) => {
    if (!l) return null;
    if (i === last && (l.t === TYPES.linebreak || l.t === TYPES.blockEnd)) return null;
    let classList = {};
    let text = _.isString(l.text) ? l.text.trim() : '';
    if (_.get(l, 'mode.size')) classList[classes[`size-${l.mode.size}`]] = true;
    if (_.get(l, 'mode.bold')) classList[classes.bold] = true;
    if (_.get(l, 'mode.italic')) classList[classes.italic] = true;
    if (text && highlightedWord && highlightedWords.indexOf(text.toLowerCase()) !== -1) {
      classList[classes.highlightedWord] = true;
    }

    if (l.t === TYPES.blockStart || l.t === TYPES.blockEnd) {
      if (i === lexems.length - 1 || (!beginning && lexems[i+1].t !== 'block')) {
        br = 0;
        return (<br key={i}/>);
      }
      br = cont;
      return null;
    }

    if (l.t === TYPES.versenum) {
      // return  (<span key={i} className={classes.verseNum}>{l.num}</span>);
      return null; // never show verse numbers here.
    }

    beginning = false;

    if (l.t === TYPES.linebreak) {
      if (i === lexems.length - 1) return null;
      return ( <br key={i} /> );
    }

    if (l.t === TYPES.img) {
      return ( <img key={i} src={l.src} alt="" /> );
    }

    if (l.t === TYPES.block) {
      classList[classes[`block-${l.ntype.toLowerCase()}`]] = true;
      return ( <p key={i} className={classNames(classList)}>{ l.text }</p> );
    }

    if (l.t === TYPES.link) {
      classList[classes.link] = true;
      cont = true;
      return ( <a key={i} href={l.href} onClick={() => fireLink(l.href)} className={classNames(classList)}>{ text }</a> );
    }

    if (l.t === TYPES.anchor) {
      return ( <a key={i} name={l.name} /> );
    }

    if (l.t === TYPES.dirStart && l.dir === 'rtl') {
      cont = true;
      return "\u200F";
    }
    if (l.t === TYPES.dirEnd && l.dir === 'rtl') {
      cont = true;
      return "\u200E";
    }

    if (l.t === TYPES.text) {
      cont = true;
      let text = l.space ? ` ${l.text}` : l.text;
      const color = _.get(l, 'mode.color', null);
      return <span key={i} style={color ? {color: color} : {}} className={classNames(classList)}>{ text }</span>;
    }

    if (l.t === TYPES.strong) {
      cont = true;
      return (
        displayStrong
        ? <span key={i} className={classes.strong} onClick={() => displayStrong(text)}>{ text }</span>
        : null
      );
    }

    if (text === '') {
      cont = true;
      return <span key={i} className={classes.separator}> { text } </span>;
    }

    const ret = (
      <span key={i} style={{color: _.get(l, 'mode.color')}}>
        { l.space ? (<span> </span>) : null }
        { br ? (<br />) : null }
        <span key={i} className={classNames(classList)}>
          { text }
        </span>
      </span>
    );
    br = false;
    cont = true;
    return ret;
  });
}

export default LexemList;
