import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react"
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
    background: theme.palette.background.active,
    position: 'absolute',
    zIndex: 10,
    border: theme.palette.border.sizer,
    borderRadius: '4px',
    boxSizing: 'border-box',
    [theme.breakpoints.down('md')]: {
      display: 'none',
    },
  },

}));

const Sizer = ({children, initialSize, side}) => {
  const classes = useStyles();
  const ref = useRef();
  const refHandle = useRef();
  const startRef = useRef();
  const size0Ref = useRef();
  const [handlerSide] = useState(side);
  const [size, setSize] = useState(initialSize);
  const [start, setStart] = useState(0);
  const [size0, setSize0] = useState(0);
  // const [collapsed, setCollapsed] = useState(false);
  const maxSize = 700;
  const minSize = 20;
  startRef.current = start;
  size0Ref.current = size0;

  const getOwnSize = useCallback(() => {
    switch (handlerSide) {
      case 'top': case 'bottom': return ref.current.offsetHeight;
      case 'left': case 'right': default: return ref.current.offsetWidth;
    }
  }, [handlerSide]);

  const getEventPos = useCallback((e) => {
    switch (handlerSide) {
      case 'top': case 'bottom': return e.touches ? e.touches[0].screenY : e.clientY;
      case 'left': case 'right': default: return e.touches ? e.touches[0].screenX : e.clientX;
    }
  }, [handlerSide]);

  const getDelta = useCallback((newPos) => {
    switch (handlerSide) {
      case 'bottom': case 'right': default: return newPos - startRef.current;
      case 'top': case 'left': return startRef.current - newPos;
    }
  }, [handlerSide, startRef]);

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
      case 'top': return { width: '100%', height: HANDLE_SIZE, top: 0, left: 0, right: 0, cursor: 'row-resize' };
      case 'bottom': return { width: '100%', height: HANDLE_SIZE, bottom: 0, left: 0, right: 0, cursor: 'row-resize' };
      case 'left': return { height: '100%', width: HANDLE_SIZE, top: 0, bottom: 0, left: 0, cursor: 'col-resize' };
      case 'right':
      default: return { height: '100%', width: HANDLE_SIZE, top: 0, bottom: 0, right: 0, cursor: 'col-resize' };
    }
  }

  useLayoutEffect(() => {
    if (ref.current && !size) {
      setTimeout(() => setSize(Math.max(Math.min(getOwnSize(), maxSize), minSize)), 0);
    }
  }, [getOwnSize, size]);

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

  const sizeMove = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    const delta = getDelta(getEventPos(e));
    const newSize = Math.max(Math.min(size0Ref.current + delta, maxSize), minSize);
    setSize(newSize);
  }, [getDelta, getEventPos, size0Ref]);

  function sizeEnd(e) {
    document.removeEventListener('touchmove', sizeMove, {passive: false});
    document.removeEventListener('touchend', sizeEnd);
    document.removeEventListener('mousemove', sizeMove, {passive: false});
    document.removeEventListener('mouseup', sizeEnd);
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