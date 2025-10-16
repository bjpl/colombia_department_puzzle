import { useState } from 'react';
import { User, Mail, Calendar, Trophy, Target, Clock, LogOut, Edit2, Save, X } from 'lucide-react';
import { Button, Card, CardHeader, CardTitle, CardContent, Input } from '../../design-system';
import { cn } from '../../design-system/utils/cn';

export interface UserData {
  id: string;
  email: string;
  displayName?: string;
  avatarUrl?: string;
  createdAt: string;
  stats?: {
    gamesPlayed: number;
    gamesCompleted: number;
    bestTime?: number;
    bestScore?: number;
    totalPlayTime?: number;
  };
}

export interface UserProfileProps {
  user: UserData;
  onUpdateProfile?: (updates: { displayName?: string; avatarUrl?: string }) => Promise<void>;
  onSignOut?: () => Promise<void>;
  className?: string;
}

export default function UserProfile({
  user,
  onUpdateProfile,
  onSignOut,
  className,
}: UserProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user.displayName || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    setIsLoading(true);
    setError(null);

    try {
      await onUpdateProfile?.({ displayName });
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setIsLoading(false);
    }
  }

  function handleCancel() {
    setDisplayName(user.displayName || '');
    setIsEditing(false);
    setError(null);
  }

  async function handleSignOut() {
    setIsLoading(true);
    try {
      await onSignOut?.();
    } catch (err: any) {
      setError(err.message || 'Failed to sign out.');
    } finally {
      setIsLoading(false);
    }
  }

  function formatTime(seconds?: number): string {
    if (!seconds) return '--:--';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  return (
    <div className={cn('max-w-2xl mx-auto space-y-6', className)}>
      {/* Profile Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Profile</CardTitle>
            {!isEditing && (
              <Button
                variant="ghost"
                size="sm"
                icon={<Edit2 className="w-4 h-4" />}
                onClick={() => setIsEditing(true)}
                className="min-h-[44px]"
              >
                Edit
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar & Name */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-sky-100 flex items-center justify-center flex-shrink-0">
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.displayName || 'User avatar'}
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <User className="w-8 h-8 text-sky-600" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              {isEditing ? (
                <Input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Display name"
                  className="min-h-[44px] text-base md:text-sm"
                  fullWidth
                />
              ) : (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 truncate">
                    {user.displayName || 'Anonymous Player'}
                  </h3>
                  <p className="text-sm text-gray-600 truncate flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    {user.email}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Edit Actions */}
          {isEditing && (
            <div className="flex gap-2">
              <Button
                variant="primary"
                onClick={handleSave}
                disabled={isLoading}
                loading={isLoading}
                icon={<Save className="w-4 h-4" />}
                className="min-h-[44px] flex-1"
              >
                Save Changes
              </Button>
              <Button
                variant="secondary"
                onClick={handleCancel}
                disabled={isLoading}
                icon={<X className="w-4 h-4" />}
                className="min-h-[44px] flex-1"
              >
                Cancel
              </Button>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div
              className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700"
              role="alert"
            >
              {error}
            </div>
          )}

          {/* Account Info */}
          <div className="space-y-3 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-3 text-sm">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600">Joined</span>
              <span className="font-medium text-gray-900 ml-auto">
                {formatDate(user.createdAt)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Card */}
      {user.stats && (
        <Card>
          <CardHeader>
            <CardTitle>Game Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {/* Games Played */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-5 h-5 text-gray-600" />
                  <span className="text-sm text-gray-600">Games Played</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {user.stats.gamesPlayed}
                </p>
              </div>

              {/* Games Completed */}
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Trophy className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-green-700">Completed</span>
                </div>
                <p className="text-2xl font-bold text-green-900">
                  {user.stats.gamesCompleted}
                </p>
              </div>

              {/* Best Time */}
              <div className="p-4 bg-sky-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-sky-600" />
                  <span className="text-sm text-sky-700">Best Time</span>
                </div>
                <p className="text-2xl font-bold text-sky-900">
                  {formatTime(user.stats.bestTime)}
                </p>
              </div>

              {/* Best Score */}
              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Trophy className="w-5 h-5 text-purple-600" />
                  <span className="text-sm text-purple-700">Best Score</span>
                </div>
                <p className="text-2xl font-bold text-purple-900">
                  {user.stats.bestScore?.toLocaleString() || '0'}
                </p>
              </div>
            </div>

            {/* Total Play Time */}
            {user.stats.totalPlayTime && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Play Time</span>
                  <span className="text-lg font-semibold text-gray-900">
                    {Math.round(user.stats.totalPlayTime / 60)} minutes
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Sign Out */}
      <Card>
        <CardContent className="p-4">
          <Button
            variant="danger"
            onClick={handleSignOut}
            disabled={isLoading}
            loading={isLoading}
            icon={<LogOut className="w-4 h-4" />}
            fullWidth
            className="min-h-[44px]"
          >
            Sign Out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
