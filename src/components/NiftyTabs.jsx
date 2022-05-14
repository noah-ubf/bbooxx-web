import { styled } from '@mui/material/styles';
import { Tabs, Tab } from "@mui/material";

const TAB_HEIGHT = '1.7rem';

const NiftyTabs = styled((props) => <Tabs {...props} />)(({ theme }) => ({
  height: TAB_HEIGHT,
  minHeight: TAB_HEIGHT,
  lineHeight: '1rem',
  '& .MuiTabScrollButton-root': {
    width: 20,
  }
}));

const NiftyTab = styled((props) => <Tab disableRipple {...props} />)(({ theme }) => ({
  textTransform: 'none',
  minWidth: 20,
  [theme.breakpoints.down('md')]: {
    minWidth: 20,
  },
  background: '#',
  borderTop: theme.palette.border.tab,
  borderLeft: theme.palette.border.tab,
  borderRight: theme.palette.border.tab,
  borderTopLeftRadius: theme.spacing(1),
  borderTopRightRadius: theme.spacing(1),
  fontWeight: theme.typography.fontWeightRegular,
  marginRight: 1,
  padding: theme.spacing(1),
  height: TAB_HEIGHT,
  minHeight: TAB_HEIGHT,
  lineHeight: TAB_HEIGHT,
  '&:hover': {
    color: theme.palette.text.active,
    opacity: 1,
  },
  '&.Mui-selected': {
    background: theme.palette.background.light,
    color: theme.palette.text.active,
    fontWeight: theme.typography.fontWeightMedium,
  },
  '&.Mui-focusVisible': {
    backgroundColor: theme.palette.background.active,
  },
}));

export { NiftyTabs, NiftyTab };
