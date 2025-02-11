import '../css/app.css';
import './bootstrap';
import axios from './axios';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { Toaster } from "sonner"; // Import Toaster

const appName = import.meta.env.VITE_APP_NAME || 'Water_System';

window.axios = axios;

createInertiaApp({
  title: (title) => `${title} - ${appName}`,
  resolve: (name) =>
    resolvePageComponent(
      `./Pages/${name}.jsx`,
      import.meta.glob('./Pages/**/*.jsx'),
    ),
  setup({ el, App, props }) {
    const root = createRoot(el);

    root.render(
      <>
        <Toaster richColors position="top-right" /> {/* Add this */}
        <App {...props} />
      </>
    );
  },
  progress: {
    color: '#4B5563',
  },
});
