import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import AppRouter from './router/AppRouter.jsx';
import { AuthProvider } from './store/AuthContext.jsx';
import { Toaster } from 'react-hot-toast';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      {/* Toast container */}
      <Toaster 
        position="top-right" 
        reverseOrder={false} 
        toastOptions={{
          duration: 3000,
          style: {
            fontSize: '14px',
            
          },
        }}
      />
      
      {/* Your routes */}
      <AppRouter />
    </AuthProvider>
  </StrictMode>
);
