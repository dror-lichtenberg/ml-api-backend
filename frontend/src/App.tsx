import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { ModelPage } from './pages/ModelPage';

interface ModelMeta {
  id: string;
  name: string;
  description: string;
  endpoint: string;
  input_schema: any;
  output_schema: any;
  example_input: any;
  valid_values?: Record<string, string[]>;
}

const HomePage: React.FC<{ models: ModelMeta[]; summary: string }> = ({ models, summary }) => (
  <div className="space-y-6">
    <div className="prose dark:prose-invert max-w-none">
      <ReactMarkdown>{summary}</ReactMarkdown>
    </div>
    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
      <thead className="bg-gray-50 dark:bg-gray-800">
        <tr>
          <th className="px-3 py-2 text-left font-semibold">Model</th>
          <th className="px-3 py-2 text-left font-semibold">Description</th>
        </tr>
      </thead>
      <tbody>
        {models.map((m) => (
          <tr key={m.id} className="odd:bg-white even:bg-gray-50 dark:odd:bg-gray-900 dark:even:bg-gray-800">
            <td className="px-3 py-2">
              <Link className="text-blue-600 dark:text-blue-400 hover:underline" to={`/${m.id}`}>{m.name}</Link>
            </td>
            <td className="px-3 py-2">{m.description}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export const App: React.FC = () => {
  const [models, setModels] = useState<ModelMeta[]>([]);
  const [summary, setSummary] = useState<string>('');
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const ls = localStorage.getItem('theme');
      if (ls === 'light' || ls === 'dark') return ls;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  useEffect(() => {
    fetch('/models')
      .then((res) => res.json())
      .then((data) => setModels(Object.values(data)))
      .catch((err) => console.error('Failed to load models:', err));
  }, []);

  useEffect(() => {
    fetch('/summary.md')
      .then((res) => res.text())
      .then(setSummary)
      .catch(() => setSummary(''));
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <Router>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <nav className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <Link to="/" className="font-bold text-lg">ML API Dashboard</Link>
          <div className="space-x-4 flex items-center">
            <a href="/docs" className="hover:underline">Docs</a>
            <a href="/models" className="hover:underline">Models API</a>
            <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="border rounded px-2 py-1">
              {theme === 'dark' ? '🌞' : '🌙'}
            </button>
          </div>
        </nav>
        <div className="p-4">
          <Routes>
            <Route path="/" element={<HomePage models={models} summary={summary} />} />
            {models.map((m) => (
              <Route key={m.id} path={`/${m.id}`} element={<ModelPage model={m} />} />
            ))}
          </Routes>
          {models.length === 0 && (
            <div className="text-red-600 mt-4">No models loaded. Ensure backend is running.</div>
          )}
        </div>
      </div>
    </Router>
  );
};
