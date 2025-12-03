import { useState } from 'react';
import { Mail, Lock, User, Check, X } from 'lucide-react';
import { Button, Input, Card, CardContent } from '../../design-system';
import { cn } from '../../design-system/utils/cn';
import { useAuth } from '../../hooks/useAuth';

export interface SignupFormProps {
  onSuccess?: () => void;
  className?: string;
}

interface PasswordStrength {
  score: number; // 0-4
  label: string;
  color: string;
}

export default function SignupForm({
  onSuccess,
  className,
}: SignupFormProps) {
  const { signUp, signInWithOAuth } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(false);

  function validatePassword(pass: string): string {
    if (pass.length < 6) return 'Password must be at least 6 characters';
    if (!/[A-Z]/.test(pass)) return 'Password must contain uppercase letter';
    if (!/[0-9]/.test(pass)) return 'Password must contain number';
    return '';
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Validation
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      setIsLoading(false);
      return;
    }

    try {
      await signUp(email, password, displayName || undefined);
      setEmailSent(true);
      onSuccess?.();
    } catch (err: any) {
      setError(err.message || 'Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleOAuthGoogle() {
    setIsLoading(true);
    setError(null);

    try {
      await signInWithOAuth('google');
    } catch (err: any) {
      setError(err.message || 'Failed to sign up with Google.');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleOAuthGithub() {
    setIsLoading(true);
    setError(null);

    try {
      await signInWithOAuth('github');
    } catch (err: any) {
      setError(err.message || 'Failed to sign up with GitHub.');
    } finally {
      setIsLoading(false);
    }
  }

  if (emailSent) {
    return (
      <Card className={cn('max-w-md mx-auto', className)}>
        <CardContent className="space-y-4">
          <div className="text-center" role="alert">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Verify Your Email
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Please check your email to verify your account.
            </p>
            <p className="text-xs text-gray-500">
              Didn&apos;t receive the email? Check your spam folder or contact support.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn('max-w-md mx-auto', className)}>
      <CardContent className="space-y-6">
        {/* OAuth Buttons */}
        <div className="space-y-3">
          <Button
            variant="secondary"
            onClick={handleOAuthGoogle}
            disabled={isLoading}
            fullWidth
            className="min-h-[44px] text-base"
            aria-label="Sign up with Google"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Sign up with Google
          </Button>

          <Button
            variant="secondary"
            onClick={handleOAuthGithub}
            disabled={isLoading}
            fullWidth
            className="min-h-[44px] text-base"
            aria-label="Sign up with GitHub"
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"
              />
            </svg>
            Sign up with GitHub
          </Button>
        </div>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or create an account</span>
          </div>
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-4" aria-label="Signup form">
          {/* Display Name */}
          <div>
            <label
              htmlFor="signup-name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Display Name
            </label>
            <Input
              id="signup-name"
              type="text"
              autoComplete="name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              leftIcon={<User className="w-4 h-4" />}
              className={cn(
                'min-h-[44px]',
                'text-base md:text-sm',
                'text-[16px]'
              )}
              placeholder="Your name"
              fullWidth
              aria-label="Display Name"
            />
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="signup-email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email
            </label>
            <Input
              id="signup-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="w-4 h-4" />}
              className={cn(
                'min-h-[44px]',
                'text-base md:text-sm',
                'text-[16px]'
              )}
              placeholder="you@example.com"
              fullWidth
              aria-label="Email"
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="signup-password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Password
            </label>
            <Input
              id="signup-password"
              type="password"
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock className="w-4 h-4" />}
              className={cn(
                'min-h-[44px]',
                'text-base md:text-sm',
                'text-[16px]'
              )}
              placeholder="••••••••"
              fullWidth
              aria-label="Password"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="signup-confirm-password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Confirm Password
            </label>
            <Input
              id="signup-confirm-password"
              type="password"
              autoComplete="new-password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              leftIcon={<Lock className="w-4 h-4" />}
              className={cn(
                'min-h-[44px]',
                'text-base md:text-sm',
                'text-[16px]'
              )}
              placeholder="••••••••"
              fullWidth
              aria-label="Confirm Password"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div
              className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700"
              role="alert"
            >
              {error}
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            disabled={isLoading}
            loading={isLoading}
            fullWidth
            className="min-h-[44px] text-base font-medium"
          >
            {isLoading ? 'Creating account...' : 'Sign Up'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
