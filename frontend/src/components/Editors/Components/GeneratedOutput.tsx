import React, { useEffect, useState } from "react";
import { promptWorkspaceTabs } from "@/stores/TabStore";


const GeneratedOutput = () => {
  const [ isPromptLoading, setIsPromptLoading ] = useState(false);
  const [ generatedText, setGeneratedText ] = useState("");
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
      <div className={`remove-message-component ${tabs[activeTabIndex as number].data.loading || generatedText ? "visible" : ""}`}>
        {tabs[activeTabIndex as number].data.generatedText && (
          <div className="generated-output">{tabs[activeTabIndex as number].data.generatedText}</div>
        )}
      </div>
      )}  
    </>
  );
};

export default GeneratedOutput;