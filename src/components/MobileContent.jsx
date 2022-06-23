import {useAppContext} from "@lib/appContext";
import TabContent from "@components/TabContent";

const MobileContent = () => {
  const { handlers: { getActiveTab } } = useAppContext();

  return <TabContent tab={getActiveTab()} isMobile={true}/>
}

export default MobileContent;