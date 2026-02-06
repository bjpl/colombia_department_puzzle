/**
 * AuthCallback Component
 *
 * Handles OAuth and magic link redirects from Supabase.
 * Supabase appends auth tokens as URL hash fragments after OAuth/magic link flows.
 * This component lets the Supabase client detect the session from the URL,
 * then redirects to the main game.
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

export default function AuthCallback() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function handleCallback() {
      try {
        if (!supabase) {
          setError('Authentication is not configured.');
          return;
        }

        // Supabase automatically detects the auth tokens from the URL hash
        // when detectSessionInUrl is true (configured in lib/supabase.ts).
        // We just need to verify the session was established.
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          console.error('Auth callback error:', sessionError);
          setError(sessionError.message);
          return;
        }

        if (session) {
          // Session established - redirect to game
          navigate('/', { replace: true });
        } else {
          // No session yet - might be processing. Wait briefly then check again.
          const client = supabase; // Already null-checked above
          setTimeout(async () => {
            const { data: { session: retrySession } } = await client!.auth.getSession();
            if (retrySession) {
              navigate('/', { replace: true });
            } else {
              setError('Authentication failed. Please try again.');
            }
          }, 1000);
        }
      } catch (err) {
        console.error('Auth callback failed:', err);
        setError('An unexpected error occurred during authentication.');
      }
    }

    handleCallback();
  }, [navigate]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md text-center">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Authentication Error</h2>
          <p className="text-sm text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/', { replace: true })}
            className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors min-h-[44px]"
          >
            Return to Game
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md text-center">
        <div className="w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
          <svg className="w-6 h-6 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Signing you in...</h2>
        <p className="text-sm text-gray-500">Please wait while we complete authentication.</p>
      </div>
    </div>
  );
}
