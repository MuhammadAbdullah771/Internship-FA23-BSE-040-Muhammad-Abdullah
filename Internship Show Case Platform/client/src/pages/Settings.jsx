import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  deleteAccount,
  getAccount,
  updateAccount,
  updatePassword,
} from '../api/account';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import ErrorMessage from '../components/ui/ErrorMessage';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { useAuthContext } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useClerk } from '@clerk/clerk-react';

const fieldClass =
  'field-premium w-full rounded-xl px-3.5 py-2.5 text-sm text-ink disabled:opacity-60';

const Settings = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { refreshAppUser, logout } = useAuthContext();
  const { openUserProfile } = useClerk();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [savingName, setSavingName] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await getAccount();
        if (!active) return;
        const user = res.data?.data?.user;
        setFullName(user?.fullName || '');
        setEmail(user?.email || '');
      } catch (err) {
        if (!active) return;
        setError(err.message || 'Unable to load account');
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, []);

  const onSaveName = async (event) => {
    event.preventDefault();
    setSavingName(true);
    setError('');
    try {
      await updateAccount({ fullName });
      await refreshAppUser();
      toast.success('Account updated');
    } catch (err) {
      setError(err.message || 'Failed to update account');
      toast.error(err.message || 'Failed to update account');
    } finally {
      setSavingName(false);
    }
  };

  const onSavePassword = async (event) => {
    event.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    setSavingPassword(true);
    setError('');
    try {
      await updatePassword({ currentPassword, newPassword });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      toast.success('Password updated');
    } catch (err) {
      setError(err.message || 'Failed to update password');
      toast.error(err.message || 'Failed to update password');
    } finally {
      setSavingPassword(false);
    }
  };

  const onDelete = async () => {
    if (deleteConfirm !== 'DELETE') {
      setError('Type DELETE to confirm');
      return;
    }
    setDeleting(true);
    setError('');
    try {
      await deleteAccount('DELETE');
      toast.success('Account deleted');
      setDeleteOpen(false);
      await logout();
      navigate('/');
    } catch (err) {
      setError(err.message || 'Failed to delete account');
      toast.error(err.message || 'Failed to delete account');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-3 py-16 text-muted">
        <LoadingSpinner />
        Loading settings…
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 py-2">
      <div>
        <p className="font-display text-[11px] font-semibold tracking-[0.24em] text-brand-600 uppercase">
          Account
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink">
          Settings
        </h1>
        <p className="mt-2 text-sm text-muted">
          Manage your profile name, password, and account security.
        </p>
      </div>

      {error && <ErrorMessage message={error} />}

      <form
        onSubmit={onSaveName}
        className="panel-premium rounded-[1.75rem] p-5 sm:p-6"
      >
        <h2 className="font-display text-lg font-semibold text-ink">
          Profile details
        </h2>
        <label className="mt-4 block">
          <span className="text-sm font-medium text-ink">Full name</span>
          <input
            type="text"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            className={`${fieldClass} mt-2`}
            required
            maxLength={100}
          />
        </label>
        <label className="mt-4 block">
          <span className="text-sm font-medium text-ink">Email</span>
          <input
            type="email"
            value={email}
            disabled
            className={`${fieldClass} mt-2`}
          />
          <p className="mt-2 text-xs text-muted">
            Email is managed by Clerk. Use “Manage auth profile” to change it.
          </p>
        </label>
        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={savingName}
            className="btn-premium rounded-xl px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
          >
            {savingName ? 'Saving…' : 'Save changes'}
          </button>
          <button
            type="button"
            onClick={() => openUserProfile()}
            className="btn-ghost rounded-xl px-4 py-2.5 text-sm font-medium text-ink"
          >
            Manage auth profile
          </button>
        </div>
      </form>

      <form
        onSubmit={onSavePassword}
        className="panel-premium rounded-[1.75rem] p-5 sm:p-6"
      >
        <h2 className="font-display text-lg font-semibold text-ink">
          Update password
        </h2>
        <p className="mt-1 text-sm text-muted">
          Use at least 8 characters with upper, lower, and a number.
        </p>
        <label className="mt-4 block">
          <span className="text-sm font-medium text-ink">Current password</span>
          <input
            type="password"
            value={currentPassword}
            onChange={(event) => setCurrentPassword(event.target.value)}
            className={`${fieldClass} mt-2`}
            required
            autoComplete="current-password"
          />
        </label>
        <label className="mt-4 block">
          <span className="text-sm font-medium text-ink">New password</span>
          <input
            type="password"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            className={`${fieldClass} mt-2`}
            required
            autoComplete="new-password"
          />
        </label>
        <label className="mt-4 block">
          <span className="text-sm font-medium text-ink">Confirm password</span>
          <input
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            className={`${fieldClass} mt-2`}
            required
            autoComplete="new-password"
          />
        </label>
        <button
          type="submit"
          disabled={savingPassword}
          className="btn-premium mt-5 rounded-xl px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
        >
          {savingPassword ? 'Updating…' : 'Update password'}
        </button>
      </form>

      <div className="rounded-[1.75rem] border border-red-200 bg-red-50/70 p-5 sm:p-6">
        <h2 className="font-display text-lg font-semibold text-red-900">
          Delete account
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-red-800/80">
          Permanently removes your profile, projects, portfolio settings, and
          Clerk login. This cannot be undone.
        </p>
        <button
          type="button"
          onClick={() => setDeleteOpen(true)}
          className="mt-5 rounded-xl bg-red-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-800"
        >
          Delete my account
        </button>
      </div>

      <ConfirmDialog
        open={deleteOpen}
        title="Delete account permanently?"
        message={
          <div className="space-y-3">
            <p>
              Type <strong>DELETE</strong> to confirm. All of your data will be
              removed.
            </p>
            <input
              type="text"
              value={deleteConfirm}
              onChange={(event) => setDeleteConfirm(event.target.value)}
              className={fieldClass}
              placeholder="DELETE"
            />
          </div>
        }
        confirmLabel="Delete forever"
        busy={deleting}
        onCancel={() => {
          setDeleteOpen(false);
          setDeleteConfirm('');
        }}
        onConfirm={onDelete}
      />
    </div>
  );
};

export default Settings;
