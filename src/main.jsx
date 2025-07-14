import '@styles/custom.css';
import '@styles/tailwind.css';
import { createRoot } from 'react-dom/client';
import App from './App';
import ErrorBoundary from "./utils/ErrorBoundary";

createRoot(document.getElementById('root')).render(
    <ErrorBoundary>  
          <App />
    </ErrorBoundary>


);
