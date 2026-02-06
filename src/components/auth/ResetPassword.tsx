/**
 * ResetPassword Component
 *
 * Handles the password reset flow after a user clicks the reset link in their email.
 * Supabase redirects to /auth/reset-password with a token in the URL.
 * The user enters a new password which is submitted via supabase.auth.updateUser().
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { Button, Input, Card, CardContent } from '../../design-system';
import { cn } from '../../design-system/utils/cn';
import { supabase } from '../../lib/supabase';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  function validatePassword(pass: string): string {
    if (pass.length < 6) return 'Password must be at least 6 characters';
    if (!/[A-Z]/.test(pass)) return 'Password must contain an uppercase letter';
    if (!/[0-9]/.test(pass)) return 'Password must contain a number';
    return '';
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (!supabase) {
      setError('Authentication is not configured.');
      return;
    }

    setIsLoading(true);

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password,
      });

      if (updateError) {
        setError(updateError.message);
      } else {
        setSuccess(true);
        setTimeout(() => navigate('/', { replace: true }), 2000);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to reset password.');
    } finally {
      setIsLoading(false);
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50 p-4">
        <Card className="max-w-md w-full">
          <CardContent className="space-y-4 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Password Updated</h2>
            <p className="text-sm text-gray-600">Redirecting you to the game...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <Card className="max-w-md w-full">
        <CardContent className="space-y-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Reset Your Password</h2>
            <p className="text-sm text-gray-600">Enter your new password below.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" aria-label="Reset password form">
            <div>
              <label
                htmlFor="reset-password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                New Password
              </label>
              <Input
                id="reset-password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                leftIcon={<Lock className="w-4 h-4" />}
                className={cn('min-h-[44px]', 'text-base md:text-sm', 'text-[16px]')}
                placeholder="New password"
                fullWidth
              />
            </div>

            <div>
              <label
                htmlFor="reset-confirm-password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Confirm Password
              </label>
              <Input
                id="reset-confirm-password"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                leftIcon={<Lock className="w-4 h-4" />}
                className={cn('min-h-[44px]', 'text-base md:text-sm', 'text-[16px]')}
                placeholder="Confirm new password"
                fullWidth
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700" role="alert">
                {error}
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              disabled={isLoading}
              loading={isLoading}
              fullWidth
              className="min-h-[44px] text-base font-medium"
            >
              {isLoading ? 'Updating...' : 'Update Password'}
            </Button>
          </form>

          <div className="text-center">
            <button
              onClick={() => navigate('/', { replace: true })}
              className="text-sm text-sky-600 hover:text-sky-800 underline min-h-[44px] inline-flex items-center"
            >
              Back to game
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
