import '../src/app/globalv2.css';
import '../src/app/global.css';
import Navigation from '@/components/Navigation';
import React, { useEffect, useState } from 'react'; // Import useEffect and useState
import Head from 'next/head';
import { promptStore } from '@/stores/PromptStore';
import { modelStore } from '@/stores/ModelStore';
import { promptWorkspaceTabs } from '@/stores/TabStore';
import { organizationStore } from '@/stores/OrganizationStore';
import Notification from '@/components/Notification';
interface AppProps {
  Component: React.ElementType;
  pageProps: any; // Adjust this type as needed
}

const App: React.FC<AppProps> = ({ Component, pageProps }) => {

  const { fetchAllPrompts, prompts } = promptStore();
  const { fetchAllModels } = modelStore();
  const { fetchOrganization, organization } = organizationStore();
  const { retrieveTabsFromLocalStorage, tabs, clearLocalTabs } = promptWorkspaceTabs();

  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    Promise.all([fetchAllPrompts(), fetchAllModels(), fetchOrganization()]) // Wait for both API calls
    .then(() => {
      setLoading(false);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      alert("Error loading application...")
    });
  }, [fetchAllPrompts, fetchAllModels, retrieveTabsFromLocalStorage, fetchOrganization]); // The empty dependency array ensures this effect runs only once on component mount

  useEffect(() => {
    if (!organization || prompts == undefined || prompts.length < 1) return;
    retrieveTabsFromLocalStorage();
    clearLocalTabs();
  }, [organization, prompts])

  return (
    <div id="root">
      {loading ? ( // Render loading indicator if loading is true
        <div>Loading...</div>
      ) : (
        <div className="app-wrapper">
            <Navigation />
            <div className="page-wrapper app-main">
              <div className="pg-root page-body full-width flush">
                <Component {...pageProps} />
              </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default App;

/*

        <div className="route-container">
          <div className="page-wrapper app-wrapper">
            <Navigation />
            <Component {...pageProps} />
          </div>
        </div>

        */