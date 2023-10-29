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

  return (
    <>
      <div className="hidden sm:block" style={{maxWidth:'100vw'}}>
        <nav className="py-2 px-1 flex" aria-label="Tabs" style={{flexWrap: 'nowrap', overflow:'auto', 'whiteSpace': 'nowrap', 'background':'#f3f4f6'}}>
          {tabs.map((tab) => (
            <div
              key={tab.name}
              className={classNames(
                tab.current ? 'bg-gray-300 text-gray-800' : 'text-gray-600',
                'rounded-md px-2 py-1 text-sm font-medium mx-1 hover:bg-gray-200 cursor-pointer flex justify-between'
              )}
              title={tab.name}
              onClick={() => {
                updatePromptObjectInPrompts(promptObject);
                router.push(`/workspace/${tab.prompt_id}`);
              }}
              style={{
                width: '188px',
              }}
              aria-current={tab.current ? 'page' : undefined}
            >
              <span
                className=""
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