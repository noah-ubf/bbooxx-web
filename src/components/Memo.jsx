import { makeStyles } from "@mui/styles";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import { useState } from "react";

const useStyles = makeStyles((theme) => ({
  memo: {
    height: 'calc(100vh - 56px)',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'stretch',
    overflow: 'hidden',
    position: 'relative',
  },
  editor: {
    width: '100%',
    height: 'auto',
    flexGrow: 1,
    flexShrink: 1,
    overflow: 'auto',
  },
  editorToolbar: {
    '& .rdw-option-wrapper': {
      padding: 0,
      minHeight: 20,
      minWidth: 20,
      margin: '0 2px',
      '& img': {
        height: '12px',
      }
    },
    '& .rdw-dropdown-wrapper': {
      height: 20,
      fontSize: '12px',
    },
  },
  editorWrapper: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'stretch',
    alignItems: 'stretch',
    width: 'calc(100% - 10px)',
    height: '100%',
    overflow: 'hidden',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
}));

const Memo = ({defaultValue, onChange}) => {
  const classes = useStyles();
  const contentBlock = htmlToDraft(defaultValue);
  const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
  const [editorState, setEditorState] = useState(EditorState.createWithContent(contentState));

  const handleChange = (state) => {
    setEditorState(state);
    onChange(draftToHtml(convertToRaw(editorState.getCurrentContent())));
  }

  return <div className={classes.memo}>
    <Editor
      editorState={editorState}
      toolbarClassName={classes.editorToolbar}
      wrapperClassName={classes.editorWrapper}
      editorClassName={classes.editor}
      onEditorStateChange={handleChange}
    />
  </div>
}

export default Memo;