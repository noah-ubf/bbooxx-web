import { useState } from "react";
import Popover from '@mui/material/Popover';

const usePopup = (id) => {
  const [el, setEl] = useState(null);
  const show = (e) => {
    setEl(e.currentTarget);
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