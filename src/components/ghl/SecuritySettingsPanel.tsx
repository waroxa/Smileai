import { useState, useEffect } from 'react';
import { Shield, Eye, EyeOff, Lock, AlertCircle, Check, CheckCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { getPasswordHash, updatePassword } from '../../utils/ghl-storage';
import { verifyPassword } from '../../utils/password-utils';

export function SecuritySettingsPanel() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [hasPassword, setHasPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if a custom password has been set
    const checkPassword = async () => {
      try {
        const hash = await getPasswordHash();
        setHasPassword(!!hash);
      } catch (error) {
        console.error('Error checking password:', error);
      } finally {
        setIsLoading(false);
      }
    };
    checkPassword();
  }, []);

  const handleUpdatePassword = async () => {
    setError('');
    setSuccess('');

    // Validation
    if (!newPassword || !confirmPassword) {
      setError('Please fill in all required fields');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    // If password already exists, verify current password
    if (hasPassword && !currentPassword) {
      setError('Please enter your current password');
      return;
    }

    setIsUpdating(true);

    try {
      // Verify current password if one exists
      if (hasPassword) {
        const storedHash = await getPasswordHash();
        if (storedHash) {
          const isValid = await verifyPassword(currentPassword, storedHash);
          if (!isValid) {
            setError('Current password is incorrect');
            setIsUpdating(false);
            return;
          }
        }
      }

      // Update to new password (will be hashed in the utility)
      await updatePassword(newPassword);
      
      setSuccess('Password updated successfully! Your new password is now active.');
      setHasPassword(true);

      // Clear form
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Error updating password:', error);
      setError('Failed to update password. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
          <Lock className="w-5 h-5 text-purple-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Security Settings</h3>
          <p className="text-sm text-gray-600">Change your admin dashboard password</p>
        </div>
      </div>

      {/* Password Status */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          {hasPassword ? (
            <CheckCircle className="w-5 h-5 text-green-600" />
          ) : (
            <AlertCircle className="w-5 h-5 text-amber-600" />
          )}
          <p className="text-sm font-medium text-gray-900">
            {hasPassword ? 'Custom Password Set' : 'Using Default Password'}
          </p>
        </div>
        {!hasPassword && (
          <p className="text-xs text-gray-600 ml-7">
            You're currently using the default password "admin123". Please set a custom password for security.
          </p>
        )}
      </div>

      {/* Password Change Form */}
      <div className="space-y-4">
        {/* Current Password */}
        <div>
          <Label htmlFor="currentPassword" className="text-sm font-medium text-gray-900 mb-2 block">
            {hasPassword ? 'Current Password *' : 'Default Password (admin123) *'}
          </Label>
          <div className="relative">
            <Input
              id="currentPassword"
              type={showCurrentPassword ? 'text' : 'password'}
              value={currentPassword}
              onChange={(e) => {
                setCurrentPassword(e.target.value);
                setError('');
              }}
              placeholder={hasPassword ? 'Enter current password' : 'Enter admin123'}
              className="pr-12"
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showCurrentPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* New Password */}
        <div>
          <Label htmlFor="newPassword" className="text-sm font-medium text-gray-900 mb-2 block">
            New Password * (min. 6 characters)
          </Label>
          <div className="relative">
            <Input
              id="newPassword"
              type={showNewPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                setError('');
              }}
              placeholder="Enter new password"
              className="pr-12"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showNewPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div>
          <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-900 mb-2 block">
            Confirm New Password *
          </Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setError('');
              }}
              placeholder="Confirm new password"
              className="pr-12"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
            <p className="text-sm text-green-700">{success}</p>
          </div>
        )}

        {/* Save Button */}
        <Button
          onClick={handleUpdatePassword}
          className="w-full bg-purple-600 hover:bg-purple-700"
          disabled={isUpdating}
        >
          {isUpdating ? 'Updating...' : 'Update Password'}
        </Button>
      </div>

      {/* Security Tips */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <p className="text-xs font-medium text-gray-900 mb-2">🔐 Security Best Practices:</p>
        <ul className="space-y-1 text-xs text-gray-600">
          <li>• Use a strong, unique password</li>
          <li>• Don't share your password with anyone</li>
          <li>• Change your password regularly</li>
          <li>• Logout when using shared computers</li>
        </ul>
      </div>

      {/* GHL OAuth Note */}
      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-xs text-blue-800">
          <strong>Note:</strong> When using this app embedded in GoHighLevel, you can also use SSO (Single Sign-On) to automatically authenticate users who are logged into their GHL account.
        </p>
      </div>
    </div>
  );
}