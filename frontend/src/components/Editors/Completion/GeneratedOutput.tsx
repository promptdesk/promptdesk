import React, { useEffect, useState } from "react";
import { promptWorkspaceTabs } from "@/stores/TabStore";


const GeneratedOutput = () => {
  const [ generatedText ] = useState("");
  const [ data, setData ] = useState({} as any);
  
  const { getDataByIndex, activeTabIndex, tabs} = promptWorkspaceTabs();

  useEffect(() => {
    if(activeTabIndex) {
      const data = getDataByIndex(activeTabIndex);
      setData(data);
    }
  }, [tabs, activeTabIndex, getDataByIndex]);

  return (
    <>
      {activeTabIndex != undefined && tabs[activeTabIndex as number] && tabs[activeTabIndex as number].data && (
      <div className={`${tabs[activeTabIndex as number].data.loading || generatedText ? "visible" : ""}`}>
        {tabs[activeTabIndex as number].data.generatedText && (
          <pre className="generated-output">{tabs[activeTabIndex as number].data.generatedText}</pre>
        )}
      </div>
      )}  
    </>
  );
};

export default GeneratedOutput;