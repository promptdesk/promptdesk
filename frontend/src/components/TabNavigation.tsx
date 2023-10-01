// TabNavigation.tsx
import React from 'react';
import { useRouter } from 'next/router';

interface Tab {
  prompt_id: string;
  current: boolean;
  name: string;
}

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

  return (
    <nav aria-label="Tabs" style={{ background: "#f2f2f2", paddingTop: "8px" }} className="flex">
      {tabs.map((tab) => (
        <div
          key={tab.prompt_id}
          style={{ width: "188px", borderRadius: "10px 10px 0px 0px", padding: "5px" }}
          className={classNames(
            tab.current ? 'bg-white text-indigo-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50',
            'px-2 py-1 text-sm font-medium cursor-pointer pl-4 pr-4 flex justify-between'
          )}
          aria-current={tab.current ? 'page' : undefined}
          onClick={() => {
            updatePromptObjectInPrompts(promptObject);
            router.push(`/prompt/${tab.prompt_id}`);
          }}
        >
          <span style={{
            textOverflow: 'ellipsis',
            minWidth: '0px',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            padding: '4px'
          }}>
            {tab.name}
          </span>
          <span onClick={(e) => removePlaygroundTab(e, tab.prompt_id)} className="ml-2 inline-flex items-center rounded-md bg-gray-50 hover:bg-gray-200 px-2 py-0 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">x</span>
        </div>
      ))}
      <div
        className={classNames(
          'text-gray-500 hover:text-gray-700 hover:bg-gray-200',
          'rounded-md px-3 py-2 text-sm font-medium cursor-pointer',
        )}
        style={{ display: "inline-block", borderRadius: "10px 10px 0px 0px" }}
        onClick={() => {
          updatePromptObjectInPrompts(promptObject); // passing null or any other default object, as the promptObject isn't available here
          newPrompt();
        }}
      >
        <span className="font-bold">+</span>
      </div>
    </nav>
  );
}

export default TabNavigation;