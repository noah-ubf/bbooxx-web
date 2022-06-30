import SearchIcon from '@mui/icons-material/Search';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import LinkIcon from '@mui/icons-material/Link';
import EditIcon from '@mui/icons-material/Edit';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import TagIcon from '@mui/icons-material/Tag';
import LanguageIcon from '@mui/icons-material/Language';

const TabIcon = ({tab, onClick}) => {
  if (tab?.source?.type === 'search') return (
    <SearchIcon onClick={onClick}/>
  );
  if (tab?.source?.type === 'xrefs') return (
    <LinkIcon onClick={onClick}/>
  );
  if (tab?.type === 'memo') return (
    <EditIcon onClick={onClick}/>
  );
  if (tab?.custom) return (
    <FormatListBulletedIcon onClick={onClick}/>
  );
  if (tab?.type === 'strongs') return (
    <TagIcon onClick={onClick}/>
  );
  if (tab?.type === 'web') return (
    <LanguageIcon onClick={onClick}/>
  );
  if (!tab?.type) return (
    <TextSnippetIcon onClick={onClick}/>
  );

  return false;
}

export default TabIcon;