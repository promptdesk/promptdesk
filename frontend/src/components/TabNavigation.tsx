import React from 'react';
import { useRouter } from 'next/router';
import { Tab } from '@/interfaces/tab';

interface TabNavigationProps {
  tabs: Tab[];
  updatePromptObjectInPrompts: (promptObject: any) => void;
  newPrompt: () => void;
  removePlaygroundTab: (e: any, id: string) => void;
  promptObject: any;
}

const TabNavigation: React.FC<TabNavigationProps> = ({
  tabs, 
  updatePromptObjectInPrompts, 
  newPrompt,
  removePlaygroundTab,
  promptObject
}) => {
  const router = useRouter();

  const classNames = (...classes: string[]) => classes.filter(Boolean).join(' ');

  const TabComponent = ({ tab }: { tab: Tab }) => (
    <div
      key={tab.prompt_id}
      style={{ width: "188px", borderRadius: "10px 10px 0px 0px"}}
      className={classNames(
        tab.current ? 'bg-white text-indigo-700' : 'text-black hover:text-gray-700 hover:bg-gray-50',
        'font-medium cursor-pointer flex justify-between mr-2'
      )}
      aria-current={tab.current ? 'page' : undefined}
      onClick={() => {
        updatePromptObjectInPrompts(promptObject);
        router.push(`/prompt/${tab.prompt_id}`);
      }}
      title={tab.name}>
      <span className="py-1 px-2" style={{
        textOverflow: 'ellipsis',
        minWidth: '0px',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        fontSize: '12px',
        fontWeight: 'bold'
      }}>{tab.name}</span>
      <span onClick={(e) => removePlaygroundTab(e, tab.prompt_id)} className="ml-2 inline-flex items-center rounded-md hover:bg-gray-200 px-2 py-0 text-xs font-medium text-gray-600">x</span>
    </div>
  );

  return (
    <nav aria-label="Tabs" style={{ background: "#F2F2F2", paddingTop: "8px", overflow: "auto" }} className="flex">
      {tabs.map(tab => <TabComponent key={tab.prompt_id} tab={tab} />)}
      <div
        className={classNames(
          'text-gray-500 hover:text-gray-700 hover:bg-gray-200',
          'rounded-md px-3 py-1 text-sm font-medium cursor-pointer',
        )}
        style={{ display: "inline-block", borderRadius: "10px 10px 0px 0px" }}
        onClick={() => {
          updatePromptObjectInPrompts(promptObject); 
          newPrompt();
        }}
      >
        <span className="font-bold">+</span>
      </div>
    </nav>
  );
}

export default TabNavigation;