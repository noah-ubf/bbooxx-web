import SearchIcon from '@mui/icons-material/Search';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import LinkIcon from '@mui/icons-material/Link';
import EditIcon from '@mui/icons-material/Edit';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import TagIcon from '@mui/icons-material/Tag';
import LanguageIcon from '@mui/icons-material/Language';

const TabIcon = ({tab}) => {
  if (tab?.source?.type === 'search') return (
    <SearchIcon/>
  );
  if (tab?.source?.type === 'xrefs') return (
    <LinkIcon/>
  );
  if (tab?.type === 'memo') return (
    <EditIcon/>
  );
  if (tab?.custom) return (
    <FormatListBulletedIcon/>
  );
  if (tab?.type === 'strongs') return (
    <TagIcon/>
  );
  if (tab?.type === 'web') return (
    <LanguageIcon/>
  );
  if (!tab?.type) return (
    <TextSnippetIcon/>
  );

  return false;
}

export default TabIcon;