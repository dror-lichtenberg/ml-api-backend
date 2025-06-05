import React, { useState } from 'react';

interface Props {
  model: any;
}

export const ModelPage: React.FC<Props> = ({ model }) => {
  const [input, setInput] = useState<any>(model.example_input);
  const [result, setResult] = useState<any>(null);
  const validValues: Record<string, string[]> = model.valid_values || {};

  const handleChange = (key: string, value: any) => {
    setInput({ ...input, [key]: value });
  };

  const handleSubmit = async () => {
    const res = await fetch(model.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
    const json = await res.json();
    setResult(json);
  };

  const renderField = (key: string, def: any) => {
    if (validValues[key]) {
      return (
        <select
          className="border rounded p-2 dark:bg-gray-800"
          value={input[key] || ''}
          onChange={(e) => handleChange(key, e.target.value)}
        >
          {validValues[key].map((v: string) => (
            <option key={v} value={v}>{v}</option>
          ))}
        </select>
      );
    }
    return (
      <input
        className="border rounded p-2 dark:bg-gray-800"
        value={input[key] || ''}
        onChange={(e) => handleChange(key, e.target.value)}
      />
    );
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">{model.name}</h2>
      <p>{model.description}</p>
      <div className="grid gap-4 md:grid-cols-2">
        {Object.entries(model.input_schema.properties).map(([key, def]: any) => (
          <div key={key} className="flex flex-col">
            <label className="font-medium capitalize mb-1">{key}</label>
            {renderField(key, def)}
          </div>
        ))}
      </div>
      <button
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        onClick={handleSubmit}
      >
        Submit
      </button>
      {result && (
        <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-auto text-sm">
{JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
};
