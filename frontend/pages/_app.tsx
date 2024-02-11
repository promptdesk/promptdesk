import "../src/app/globalv2.css";
import "../src/app/global.css";
import Navigation from "@/components/Navigation";
import React, { useEffect, useState } from "react"; // Import useEffect and useState
import { promptStore, fetchAllPrompts } from "@/stores/prompts";
import { modelStore } from "@/stores/ModelStore";
import { variableStore } from "@/stores/VariableStore";
import { tabStore } from "@/stores/TabStore";
import { organizationStore } from "@/stores/OrganizationStore";
interface AppProps {
  Component: React.ElementType;
  pageProps: any; // Adjust this type as needed
}

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  const { prompts } = promptStore();
  const { fetchAllModels } = modelStore();
  const { fetchVariables } = variableStore();
  const { fetchOrganization, organization } = organizationStore();
  const { retrieveTabsFromLocalStorage, tabs, clearLocalTabs } = tabStore();

  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    Promise.all([
      fetchAllPrompts(),
      fetchAllModels(),
      fetchOrganization(),
      fetchVariables(),
    ]) // Wait for both API calls
      .then(() => {
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        if (alert) {
          alert("Error loading application...");
        }
      });
  }, [
    fetchAllPrompts,
    fetchAllModels,
    retrieveTabsFromLocalStorage,
    fetchOrganization,
    fetchVariables,
  ]); // The empty dependency array ensures this effect runs only once on component mount

  useEffect(() => {
    if (!organization || prompts == undefined || prompts.length < 1) return;
    retrieveTabsFromLocalStorage();
    clearLocalTabs();
  }, [organization, prompts]);

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
