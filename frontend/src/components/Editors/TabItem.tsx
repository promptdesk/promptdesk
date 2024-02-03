import React from 'react';
import { useRouter } from 'next/router';
import { Tab } from '@/interfaces/tab';

interface TabItemProps {
  tab: Tab;
  promptObject: any;
  updateLocalPrompt: (promptObject: any) => void;
  removePlaygroundTab: (e: any, id: string) => void;
}

const TabItem: React.FC<TabItemProps> = ({ 
  tab, 
  promptObject, 
  updateLocalPrompt, 
  removePlaygroundTab 
}) => {
  const router = useRouter();

  const classNames = (...classes: string[]) => classes.filter(Boolean).join(' ');

  return (
    <div
      key={tab.name}
      className={classNames(
        tab.current ? 'bg-gray-300 text-gray-800' : 'text-gray-600',
        'rounded-md px-2 py-1 text-sm font-medium mx-1 hover:bg-gray-200 cursor-pointer flex justify-between'
      )}
      title={tab.name}
      onClick={() => {
        updateLocalPrompt(promptObject);
        router.push(`/workspace/${tab.prompt_id}`);
      }}
      style={{ width: '188px' }}
      aria-current={tab.current ? 'page' : undefined}
    >
      <span
        style={{
          textOverflow: 'ellipsis',
          minWidth: '0px',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          fontWeight: 'bold'
        }}
      >
        {tab.name}
      </span>
      <span 
        onClick={(e) => removePlaygroundTab(e, tab.prompt_id)} 
        className="ml-2 inline-flex items-center rounded-md hover:bg-gray-200 px-2 py-0 text-xs font-medium text-gray-600 border border-gray-200 hover:border-gray-800"
      >
        x
      </span>
    </div>
  );
}

export default TabItem;