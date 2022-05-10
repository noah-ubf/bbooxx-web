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
  borderTop: 'solid 1px #7f7f7f',
  borderLeft: 'solid 1px #7f7f7f',
  borderRight: 'solid 1px #7f7f7f',
  borderTopLeftRadius: theme.spacing(1),
  borderTopRightRadius: theme.spacing(1),
  fontWeight: theme.typography.fontWeightRegular,
  marginRight: 1,
  padding: theme.spacing(1),
  height: TAB_HEIGHT,
  minHeight: TAB_HEIGHT,
  lineHeight: TAB_HEIGHT,
  '&:hover': {
    color: '#40a9ff',
    opacity: 1,
  },
  '&.Mui-selected': {
    background: '#ccccee',
    color: '#1890ff',
    fontWeight: theme.typography.fontWeightMedium,
  },
  '&.Mui-focusVisible': {
    backgroundColor: '#d1eaff',
  },
}));

export { NiftyTabs, NiftyTab };
