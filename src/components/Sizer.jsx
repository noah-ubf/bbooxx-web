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
  const movedRef = useRef();
  const collapsedRef = useRef();
  const [handlerSide] = useState(side);
  const [size, setSize] = useState(initialSize);
  const [start, setStart] = useState(0);
  const [size0, setSize0] = useState(0);
  const [collapsed, setCollapsed] = useState(false);
  const maxSize = 700;
  const minSize = 20;
  startRef.current = start;
  size0Ref.current = size0;
  collapsedRef.current = collapsed;

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
    const visibleSize = collapsed ? 20 : size;
    switch (handlerSide) {
      case 'top': return { paddingTop: 12, height: `${visibleSize}px` };
      case 'bottom': return { paddingBottom: 12, height: `${visibleSize}px` };
      case 'left': return { paddingLeft: 12, width: `${visibleSize}px` };
      case 'right': default: return { paddingRight: 12, width: `${visibleSize}px` };
    }
  }

  const getHandleStyle = () => {
    const HANDLE_SIZE = collapsed ? 20 : 12;
    const H = { width: '100%', height: HANDLE_SIZE, cursor: collapsed ? 'default' : 'row-resize' };
    const V = { height: '100%', width: HANDLE_SIZE, cursor: collapsed ? 'default' : 'col-resize' }
    switch (handlerSide) {
      case 'top': return { ...H, top: 0, left: 0, right: 0 };
      case 'bottom': return { ...H, bottom: 0, left: 0, right: 0 };
      case 'left': return { ...V, top: 0, bottom: 0, left: 0 };
      case 'right':
      default: return { ...V, top: 0, bottom: 0, right: 0 };
    }
  }

  useLayoutEffect(() => {
    if (ref.current && !size && !collapsed) {
      setTimeout(() => {
        if (!collapsed) {
          setSize(Math.max(Math.min(getOwnSize(), maxSize), minSize));
        }
      }, 0);
    }
  }, [collapsed, getOwnSize, size]);

  const sizeMove = useCallback((e) => {
    movedRef.current = true;
    e.preventDefault();
    e.stopPropagation();
    if (!collapsedRef.current) {
      const delta = getDelta(getEventPos(e));
      const newSize = Math.max(Math.min(size0Ref.current + delta, maxSize), minSize);
      setSize(newSize);
    }
  }, [collapsedRef, getDelta, getEventPos]);

  const sizeEnd = useCallback((e) => {
    document.removeEventListener('touchmove', sizeMove, {passive: false});
    document.removeEventListener('touchend', sizeEnd);
    document.removeEventListener('mousemove', sizeMove, {passive: false});
    document.removeEventListener('mouseup', sizeEnd);
    if (!movedRef.current) {
      setTimeout(() => {
        setCollapsed(!collapsedRef.current);
      }, 20);
    }
  }, [collapsedRef, movedRef, sizeMove]);

  const sizeStart = useCallback((e) => {
    movedRef.current = false;
    e.preventDefault();
    e.stopPropagation();
    if (!collapsedRef.current) {
      setStart(getEventPos(e));
      const currSize = getOwnSize();
      setSize(currSize);
      setSize0(currSize);
    }
    setTimeout(() => {
      document.addEventListener('touchmove', sizeMove, {passive: false});
      document.addEventListener('touchend', sizeEnd);
      document.addEventListener('mousemove', sizeMove, {passive: false});
      document.addEventListener('mouseup', sizeEnd);
    }, 0);
  }, [collapsedRef, getEventPos, getOwnSize, sizeEnd, sizeMove]);

  useEffect(
    () => {
      const el = refHandle.current;
      if (!collapsedRef.current) {
        el.addEventListener('mousedown', sizeStart);
        el.addEventListener('touchstart', sizeStart);
      }

      return () => {
        el.addEventListener('mousedown', sizeStart);
        el.removeEventListener('touchstart', sizeStart);
      };
    }, [collapsedRef, sizeStart]);

  return (
    <div className={classes.sizer} ref={ref} style={getStyle()}>
      <div className={classes.content}>
        {children}
      </div>
      <div
        ref={refHandle}
        className={classes.handle}
        style={getHandleStyle()}
      ></div>
    </div>
  );
}

export default Sizer;