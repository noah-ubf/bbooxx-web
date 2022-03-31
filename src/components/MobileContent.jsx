import {useAppContext} from "@lib/appContext";
import TabContent from "@components/TabContent";
import TabList from "@components/TabList";
import MobileMenu from "@components/MobileMenu";

const MobileContent = () => {
  const {
    store: { mobileActiveTab, mobileAppView },
  } = useAppContext();

  switch (mobileAppView) {
    case 'menu': return <MobileMenu />;
    case 'tablist': return <TabList />;
    default: return <TabContent tabId={mobileActiveTab} />
  }
}

export default MobileContent;