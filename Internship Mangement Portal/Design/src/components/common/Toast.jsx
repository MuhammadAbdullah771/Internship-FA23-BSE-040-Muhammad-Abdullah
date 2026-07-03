import { Toaster } from 'react-hot-toast';

const toastOptions = {
  duration: 3000,
  style: {
    background: '#fff',
    color: '#0f172a',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    fontSize: '14px',
    padding: '12px 16px',
    boxShadow: '0 4px 24px -4px rgb(5 150 105 / 0.12)',
  },
  success: {
    iconTheme: { primary: '#10B981', secondary: '#fff' },
  },
};

export default function ToastProvider() {
  return <Toaster position="top-right" toastOptions={toastOptions} />;
}
