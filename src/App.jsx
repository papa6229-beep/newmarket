import { useState } from 'react';
import FileUpload from './components/FileUpload.jsx';
import Dashboard from './components/Dashboard.jsx';

export default function App() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  const handleDataLoaded = (loadedData) => {
    setError('');
    setData(loadedData);
  };

  const handleError = (msg) => {
    setError(msg);
  };

  const handleReset = () => {
    setData(null);
    setError('');
  };

  if (data) {
    return <Dashboard data={data} onReset={handleReset} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <FileUpload onDataLoaded={handleDataLoaded} onError={handleError} />
      {error && (
        <div className="max-w-3xl mx-auto px-4 pb-4">
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-600">
            ❌ {error}
          </div>
        </div>
      )}
    </div>
  );
}
