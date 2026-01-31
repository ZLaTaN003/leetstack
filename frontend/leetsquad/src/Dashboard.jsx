import { supabase } from './supabaseClient'

export default function Dashboard({ session }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="p-8 text-center bg-white rounded shadow-lg">
        <h1 className="mb-4 text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mb-6 text-gray-600">
          Hello, <span className="font-mono text-blue-600">{session.user.email}</span>
        </p>
        <button
          onClick={() => supabase.auth.signOut()}
          className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Sign out
        </button>
      </div>
    </div>
  )
}