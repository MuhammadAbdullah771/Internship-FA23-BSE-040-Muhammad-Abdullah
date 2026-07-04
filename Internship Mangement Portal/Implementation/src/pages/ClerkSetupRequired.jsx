export default function ClerkSetupRequired() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="max-w-md w-full bg-white rounded-2xl border border-gray-100 shadow-lg p-8 text-center">
        <h1 className="text-xl font-bold text-gray-900 mb-2">Clerk authentication required</h1>
        <p className="text-sm text-gray-600 mb-6 leading-relaxed">
          InternHub uses Clerk for internship sign-in and sign-up. Pull your API keys, then restart the app.
        </p>
        <pre className="text-left text-xs bg-slate-900 text-emerald-400 rounded-lg p-4 overflow-x-auto">
{`clerk auth login
clerk env pull
npm run dev`}
        </pre>
      </div>
    </div>
  );
}
