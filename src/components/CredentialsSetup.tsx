import { useState } from 'react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

export function CredentialsSetup() {
  const [jsonInput, setJsonInput] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('Storing credentials...');

    try {
      // Validate JSON
      JSON.parse(jsonInput);

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-1ddb0231/api/store-credentials`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            serviceAccountJson: jsonInput
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to store credentials');
      }

      setStatus('success');
      setMessage('✅ Credentials stored successfully! You can now generate videos.');
      setJsonInput('');
    } catch (error: any) {
      setStatus('error');
      setMessage(`❌ Error: ${error.message}`);
      console.error('Error storing credentials:', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl mb-4">🔐 Setup Google Cloud Credentials</h2>
      <p className="text-gray-600 mb-4">
        Paste your Google Cloud service account JSON to enable video generation:
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="json-input" className="block mb-2">
            Service Account JSON:
          </label>
          <textarea
            id="json-input"
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            className="w-full h-64 p-3 border border-gray-300 rounded-lg font-mono text-sm"
            placeholder='Paste your service account JSON here...'
            required
          />
        </div>

        <button
          type="submit"
          disabled={status === 'loading' || !jsonInput}
          className="w-full bg-teal-600 text-white py-3 rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {status === 'loading' ? 'Storing...' : 'Store Credentials'}
        </button>

        {message && (
          <div
            className={`p-4 rounded-lg ${
              status === 'success'
                ? 'bg-green-50 text-green-800'
                : status === 'error'
                ? 'bg-red-50 text-red-800'
                : 'bg-blue-50 text-blue-800'
            }`}
          >
            {message}
          </div>
        )}
      </form>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg text-sm">
        <p className="mb-2">
          <strong>Expected JSON format:</strong>
        </p>
        <pre className="text-xs text-gray-600 overflow-x-auto">
{`{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\\n...\\n-----END PRIVATE KEY-----\\n",
  "client_email": "...",
  "client_id": "...",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  ...
}`}
        </pre>
      </div>
    </div>
  );
}
