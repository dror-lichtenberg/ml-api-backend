import React, { useState } from 'react';

interface Props {
  model: any;
}

export const ModelPage: React.FC<Props> = ({ model }) => {
  const [input, setInput] = useState<any>(model.example_input);
  const [result, setResult] = useState<any>(null);

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

  return (
    <div>
      <h2>{model.name}</h2>
      <p>{model.description}</p>
      {Object.entries(model.input_schema.properties).map(([key, def]: any) => (
        <div key={key}>
          <label>{key}</label>
          <input
            value={input[key] || ''}
            onChange={(e) => handleChange(key, e.target.value)}
          />
        </div>
      ))}
      <button onClick={handleSubmit}>Submit</button>
      {result && <pre>{JSON.stringify(result, null, 2)}</pre>}
    </div>
  );
};
