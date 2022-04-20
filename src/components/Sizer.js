import { useEffect, useRef, useState } from "react"
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  sizer: {
    height: '100%',
    position: 'relative',
    boxSizing: 'border-box',
  },
  content: {
    height: '100%',
    width: '100%',
    overflow: 'hidden',
  },
  handle: {
    background: '#6699ee',
    position: 'absolute',
    zIndex: 10,
    border: 'solid 4px #dddddd',
    borderRadius: '4px',
    boxSizing: 'border-box',
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },

}));

const Sizer = ({children, initialSize, side}) => {
  const classes = useStyles();
  const ref = useRef();
  const refHandle = useRef();
  const [handlerSide] = useState(side);
  const [size, setSize] = useState(initialSize);
  const [start, setStart] = useState(0);
  const [size0, setSize0] = useState(0);
  const maxSize = 700;
  const minSize = 20;

  const getOwnSize = () => {
    switch (handlerSide) {
      case 'top': case 'bottom': return ref.current.offsetHeight;
      case 'left': case 'right': default: return ref.current.offsetWidth;
    }
  };

  const getEventPos = (e) => {
    switch (handlerSide) {
      case 'top': case 'bottom': return e.touches ? e.touches[0].screenY : e.clientY;
      case 'left': case 'right': default: return e.touches ? e.touches[0].screenX : e.clientX;
    }
  }

  const getDelta = (newPos) => {
    switch (handlerSide) {
      case 'bottom': case 'right': default: return newPos - start;
      case 'top': case 'left': return start - newPos;
    }
  }

  const getStyle = () => {
    switch (handlerSide) {
      case 'top': return { paddingTop: 10, height: `${size}px` };
      case 'bottom': return { paddingBottom: 10, height: `${size}px` };
      case 'left': return { paddingLeft: 10, width: `${size}px` };
      case 'right': default: return { paddingRight: 10, width: `${size}px` };
    }
  }

  const getHandleStyle = () => {
    const HANDLE_SIZE = 10;
    switch (handlerSide) {
      case 'top': return { width: '100%', height: HANDLE_SIZE, top: 0, left: 0, right: 0 };
      case 'bottom': return { width: '100%', height: HANDLE_SIZE, bottom: 0, left: 0, right: 0 };
      case 'left': return { height: '100%', width: HANDLE_SIZE, top: 0, bottom: 0, left: 0 };
      case 'right':
      default: return { height: '100%', width: HANDLE_SIZE, top: 0, bottom: 0, right: 0 };
    }
  }

  if (ref.current && !size) {
    setTimeout(() => setSize(Math.max(Math.min(getOwnSize(), maxSize), minSize)), 0);
  }

  const sizeStart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    document.addEventListener('touchmove', sizeMove, {passive: false});
    document.addEventListener('touchend', sizeEnd);
    document.addEventListener('mousemove', sizeMove, {passive: false});
    document.addEventListener('mouseup', sizeEnd);
    setStart(getEventPos(e));
    const currSize = getOwnSize();
    setSize(currSize);
    setSize0(currSize);
  }

  const sizeMove = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const delta = getDelta(getEventPos(e));
    const newSize = Math.max(Math.min(size0 + delta, maxSize), minSize);
    setSize(newSize);
  }

  function sizeEnd(e) {
    document.removeEventListener('touchmove', sizeMove, {passive: false});
    document.removeEventListener('touchend', sizeEnd);
    document.removeEventListener('mousemove', sizeMove, {passive: false});
    document.removeEventListener('mouseup', sizeEnd);
    // setTimeout(() => setSize(getOwnSize()), 0);
  }

  useEffect(
    () => {
      const el = refHandle.current;
      el.addEventListener('touchstart', sizeStart);

      return () => {
        el.removeEventListener('touchstart', sizeStart);
      };
    }
  );

  return (
    <div className={classes.sizer} ref={ref} style={getStyle()}>
      <div className={classes.content}>
        {children}
      </div>
      <div className={classes.handle} style={getHandleStyle()} ref={refHandle} onMouseDown={sizeStart}></div>
    </div>
  );
}

export default Sizer;