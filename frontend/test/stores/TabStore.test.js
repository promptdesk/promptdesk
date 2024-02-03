import { act } from 'react-dom/test-utils';
import { tabStore } from '@/stores/TabStore'; // Adjust the path as necessary

describe('tabStore tests', () => {
    beforeEach(() => {
        // Resetting the state before each test can be helpful
        tabStore.setState({
            tabs: [],
            activeTabIndex: undefined,
            activeTabId: undefined
        });
    });

    // Test for addTab method
    describe('addTab', () => {
        it('should add a new tab', async () => {
            const name = 'Test Tab';
            const prompt_id = 'test-prompt-id';
            const current = true;

            act(() => {
                tabStore.getState().addTab(name, prompt_id, current);
            });

            const tabs = tabStore.getState().tabs;
            expect(tabs).toHaveLength(1);
            expect(tabs[0]).toEqual({ name, prompt_id, current, data: {} });
            // Additional assertions can be added here
        });
    });

    // Test for setActiveTabById method
    describe('setActiveTabById', () => {
        it('should set the active tab by ID', () => {
            // Add tabs first
            act(() => {
                tabStore.getState().addTab('Tab 1', 'id1', false);
                tabStore.getState().addTab('Tab 2', 'id2', false);
            });

            act(() => {
                tabStore.getState().setActiveTabById('id2');
            });

            const { activeTabId } = tabStore.getState();
            expect(activeTabId).toBe('id2');
        });
    });

    // ... more tests for other methods like removeTabFromTabs, findBestNextTab, updateDataById, etc.

    // Test for findActiveTab method
    describe('findActiveTab', () => {
        it('should find the active tab', () => {
            // Add and set an active tab
            act(() => {
                tabStore.getState().addTab('Active Tab', 'active-id', true);
            });

            const activeTab = tabStore.getState().findActiveTab();
            expect(activeTab).toBeDefined();
            expect(activeTab?.prompt_id).toBe('active-id');
        });
    });

    // Additional tests for error handling, edge cases, etc.
});
