import { useState } from "react";
import Popover from '@mui/material/Popover';

const usePopup = (id) => {
  if (!id) throw new Error("id cannot be null or empty value");

  const [el, setEl] = useState(null);
  const show = (ref) => {
    setEl(ref.current);
  }

  const hide = () => {
    setEl(null);
  }
  const open = Boolean(el);

  const Popup = ({
    anchorOrigin={
      vertical: 'top',
      horizontal: 'right',
    },
    children
  }) => (
    open &&
      <Popover
        id={id}
        open={open}
        anchorEl={el}
        onClose={hide}
        anchorOrigin={anchorOrigin}
      >
        { children }
      </Popover>
  )

  return {el, show, hide, open, Popup};
}

export default usePopup;