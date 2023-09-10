import '../src/app/global.css';
import Navigation from '@/components/Navigation';
import React, { useEffect, useState } from 'react'; // Import useEffect and useState
import { useRouter } from 'next/router'; // Import useRouter
import { promptStore } from '@/stores/PromptStore';
import { modelStore } from '@/stores/ModelStore';

interface AppProps {
  Component: React.ElementType;
  pageProps: any; // Adjust this type as needed
}

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  const router = useRouter();
  const { promptListSelector, fetchAllPrompts } = promptStore();
  const { modelListSelector, fetchAllModels } = modelStore();

  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    // Fetch prompts and models data here
    Promise.all([fetchAllPrompts(), fetchAllModels()]) // Wait for both API calls
      .then(() => {
        setLoading(false); // Set loading state to false when both API calls are complete
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false); // Set loading state to false even on error
      });
  }, []); // The empty dependency array ensures this effect runs only once on component mount

  return (
    <div id="root">
      {loading ? ( // Render loading indicator if loading is true
        <div>Loading...</div>
      ) : (
        <div className="route-container">
          <div className="page-wrapper app-wrapper">
            <Navigation />
            <Component {...pageProps} />
          </div>
        </div>
      )}
    </div>
  );
};

export default App;