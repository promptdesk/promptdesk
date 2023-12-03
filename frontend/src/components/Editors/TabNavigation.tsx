import React from 'react';
import { useRouter } from 'next/router';
import { Tab } from '@/interfaces/tab';
import TabItem from './TabItem';

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
    <>
      <div className="hidden sm:block navigation-bar">
        <nav className="py-2 px-1 flex" aria-label="Tabs" style={{flexWrap: 'nowrap', overflow:'auto', 'whiteSpace': 'nowrap', 'background':'#f3f4f6'}}>
          {tabs.map((tab) => (
            <TabItem 
              key={tab.name}
              tab={tab} 
              promptObject={promptObject}
              updatePromptObjectInPrompts={updatePromptObjectInPrompts} 
              removePlaygroundTab={removePlaygroundTab}
            />

          ))}
          <div className='mx-1 rounded-md px-2 py-1 text-sm font-medium hover:bg-gray-200 cursor-pointer'
          style={{
                display: 'inline-block',
          }}
          title="Add prompt"
          onClick={() => {
            updatePromptObjectInPrompts(promptObject); 
            newPrompt();
          }}>+</div>
        </nav>
      </div>
      </>
  );
}

export default TabNavigation;