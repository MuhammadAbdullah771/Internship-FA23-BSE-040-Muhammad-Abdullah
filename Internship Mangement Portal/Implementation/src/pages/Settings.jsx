import { useRef, useState } from 'react';
import { Mail, Camera, RefreshCw, Briefcase, Building2, Clock, MapPin, User, FileText, Shield } from 'lucide-react';
import { useUser } from '@clerk/clerk-react';
import toast from 'react-hot-toast';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useAuth } from '../context/AuthContext';
import { updateProfile, syncClerkAvatar } from '../services/authService';
import { fetchMyPortalAccess } from '../services/portalAccessService';
import { useRealtimePoll } from '../hooks/useRealtimePoll';
import { useRealtimeStream } from '../hooks/useRealtimeStream';
import { getAvatarUrl } from '../utils/avatar';
import { PORTAL_ACCESS_STATUS } from '../constants';

const PORTAL_STATUS_LABELS = {
  [PORTAL_ACCESS_STATUS.UNSUBMITTED]: { label: 'Not Submitted', variant: 'default' },
  [PORTAL_ACCESS_STATUS.PENDING]: { label: 'Pending Approval', variant: 'warning' },
  [PORTAL_ACCESS_STATUS.APPROVED]: { label: 'Approved', variant: 'success' },
  [PORTAL_ACCESS_STATUS.REJECTED]: { label: 'Rejected', variant: 'danger' },
};

function ReadOnlyField({ label, value }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider mb-1 text-gray-400">{label}</p>
      <p className="text-sm font-medium text-gray-900">{value || '—'}</p>
    </div>
  );
}

function AdminSettings() {
  const { user, refreshUser } = useAuth();
  const fileInputRef = useRef(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [saving, setSaving] = useState(false);

  const displayAvatar = avatarPreview || getAvatarUrl(user);

  const handleAvatarFile = async (event) => {
    const file = event.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) {
      toast.error('Please choose an image file');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image must be under 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result;
      setAvatarPreview(dataUrl);
      setSaving(true);
      const result = await updateProfile({ avatar: dataUrl });
      setSaving(false);
      if (result.success) {
        await refreshUser();
        toast.success('Profile photo updated');
      } else {
        toast.error(result.error);
        setAvatarPreview('');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setSaving(true);
    const result = await updateProfile({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
    });
    setSaving(false);
    if (result.success) {
      await refreshUser();
      toast.success('Admin profile updated');
    } else {
      toast.error(result.error);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <Card glass>
        <div className="flex flex-col sm:flex-row items-start gap-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-2xl overflow-hidden ring-2 ring-slate-200">
              <img src={displayAvatar} alt={user?.name} className="w-full h-full object-cover" />
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-2 -right-2 p-2 rounded-xl bg-emerald-600 text-white shadow-md hover:bg-emerald-500"
              aria-label="Upload profile photo"
            >
              <Camera className="w-4 h-4" />
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarFile} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Shield className="w-4 h-4 text-emerald-600" />
              <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Superadmin Account</p>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">{user?.name}</h1>
            <p className="text-gray-500 text-sm mt-1">{user?.email}</p>
            <Badge className="mt-2 bg-emerald-50 text-emerald-700 border border-emerald-100">Password Login</Badge>
          </div>
        </div>
      </Card>

      <Card glass className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Profile Details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <Input
            label="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
        <Input
          label="Admin Email"
          icon={Mail}
          value={user?.email || ''}
          disabled
          helper="Superadmin email cannot be changed here."
        />
        <Button className="!from-emerald-600 !to-teal-500" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </Card>

      <Card glass>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Login Credentials</h2>
        <div className="space-y-3 text-sm">
          <ReadOnlyField label="Email" value="superadmin@internhub.io" />
          <ReadOnlyField label="Password" value="superadmin123" />
          <p className="text-xs text-gray-500">
            Use these credentials at /portal/superadmin/login. Run <code className="bg-gray-100 px-1 rounded text-gray-700">npm run seed</code> to reset the password if needed.
          </p>
        </div>
      </Card>
    </div>
  );
}

export default function Settings() {
  const { user, refreshUser, authMode, isSuperadmin } = useAuth();
  const { user: clerkUser } = useUser();
  const fileInputRef = useRef(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [saving, setSaving] = useState(false);
  const [syncingPhoto, setSyncingPhoto] = useState(false);

  const {
    data: application,
    lastUpdated,
    refresh: refreshApplication,
  } = useRealtimePoll(fetchMyPortalAccess, {
    interval: 5000,
    enabled: Boolean(user) && !isSuperadmin,
  });

  useRealtimeStream(
    ['portal-access:updated', 'portal-access:reviewed', 'portal-access:submitted', 'profile:updated'],
    () => {
      refreshApplication(true);
      refreshUser();
    },
    { enabled: Boolean(user) && !isSuperadmin },
  );

  if (isSuperadmin) {
    return <AdminSettings />;
  }

  const portal = application?.portalAccess || user?.portalAccess || {};
  const internship = portal.internship || null;
  const displayName = portal.fullName || application?.displayName || user?.name || 'Student';
  const status = application?.portalAccessStatus || user?.portalAccessStatus;
  const statusConfig = PORTAL_STATUS_LABELS[status] || PORTAL_STATUS_LABELS.unsubmitted;
  const hasApplication = Boolean(portal.fullName || portal.submittedAt);

  const displayAvatar = avatarPreview
    || application?.avatar
    || getAvatarUrl(user, authMode === 'clerk' ? clerkUser?.imageUrl : null);

  const handleAvatarFile = async (event) => {
    const file = event.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) {
      toast.error('Please choose an image file');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image must be under 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result;
      setAvatarPreview(dataUrl);
      setSaving(true);
      const result = await updateProfile({ avatar: dataUrl });
      setSaving(false);
      if (result.success) {
        await refreshUser();
        await refreshApplication(true);
        toast.success('Profile photo updated');
      } else {
        toast.error(result.error);
        setAvatarPreview('');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSyncClerkPhoto = async () => {
    setSyncingPhoto(true);
    const result = await syncClerkAvatar();
    setSyncingPhoto(false);
    if (result.success) {
      await refreshUser();
      await refreshApplication(true);
      setAvatarPreview('');
      toast.success('Synced photo from Clerk account');
    } else {
      toast.error(result.error);
    }
  };

  return (
    <div className="space-y-6">
      <Card glass className="relative overflow-visible">
        <div className="flex flex-col sm:flex-row items-start gap-6">
          <div className="relative -mt-2">
            <div className="w-24 h-24 rounded-2xl overflow-hidden ring-4 ring-white shadow-lg">
              <img src={displayAvatar} alt={displayName} className="w-full h-full object-cover" />
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-2 -right-2 p-2 rounded-xl bg-emerald-600 text-white shadow-md hover:bg-emerald-500"
              aria-label="Upload profile photo"
            >
              <Camera className="w-4 h-4" />
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarFile} />
          </div>
          <div className="flex-1">
            <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-1">Application Profile</p>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">{displayName}</h1>
            <p className="text-slate-500 mt-0.5 font-medium">
              {internship?.title || portal.internshipTitle || 'No internship selected yet'}
            </p>
            <Badge variant={statusConfig.variant} className="mt-2">{statusConfig.label}</Badge>
            {portal.enrollmentStatus === 'active' && (
              <Badge variant="success" className="mt-2 ml-2">Active Enrollment</Badge>
            )}
            {portal.enrollmentStatus === 'completed' && (
              <Badge variant="default" className="mt-2 ml-2">Internship Completed</Badge>
            )}
            {lastUpdated && (
              <p className="text-[11px] text-slate-400 mt-2">
                Live application data · {lastUpdated.toLocaleTimeString()}
              </p>
            )}
            <div className="flex flex-wrap gap-2 mt-3">
              {authMode === 'clerk' && (
                <Button variant="outline" size="sm" icon={RefreshCw} onClick={handleSyncClerkPhoto} disabled={syncingPhoto || saving}>
                  {syncingPhoto ? 'Syncing...' : 'Use Clerk photo'}
                </Button>
              )}
              <Button variant="outline" size="sm" icon={RefreshCw} onClick={() => refreshApplication(false)} disabled={saving}>
                Refresh application
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {!hasApplication ? (
        <Card glass className="text-center py-10">
          <User className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-600 font-medium">No application submitted yet</p>
          <p className="text-sm text-gray-500 mt-1">Complete the internship application form to see your data here.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card glass className="lg:col-span-2">
            <h2 className="text-lg font-bold text-slate-900 mb-2">Application Form Data</h2>
            <p className="text-sm text-slate-500 mb-6">Submitted through the internship application form (not Clerk).</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <ReadOnlyField label="Full Name" value={portal.fullName} />
              <ReadOnlyField label="Father's Name" value={portal.fatherName} />
              <ReadOnlyField label="Institute / University" value={portal.institute} />
              <ReadOnlyField label="CNIC" value={portal.cnic} />
              <ReadOnlyField label="Contact Number" value={portal.contactNumber} />
              <ReadOnlyField label="Login Email" value={application?.email || user?.email} />
              {portal.notes && (
                <div className="sm:col-span-2">
                  <ReadOnlyField label="Notes" value={portal.notes} />
                </div>
              )}
            </div>
          </Card>

          <div className="space-y-6">
            <Card glass>
              <div className="flex items-center justify-between gap-2 mb-4">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-emerald-600" />
                  <h3 className="font-bold text-slate-900">Selected Internship</h3>
                </div>
                <Badge variant="success">Live</Badge>
              </div>
              {internship || portal.internshipTitle ? (
                <div className="space-y-3 text-sm">
                  {internship?.image && (
                    <img src={internship.image} alt="" className="w-full h-28 object-cover rounded-lg" />
                  )}
                  <div>
                    <p className="text-xs text-gray-400">Track</p>
                    <p className="font-semibold text-gray-900">{internship?.title || portal.internshipTitle}</p>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Building2 className="w-3.5 h-3.5" />
                    <span>{internship?.company || 'InternHub Partner'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{internship?.duration || '—'} · {internship?.level || '—'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{internship?.type || 'Virtual'}</span>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-500">Internship details loading...</p>
              )}
            </Card>

            <Card glass>
              <h3 className="font-bold text-slate-900 mb-4">Submission Status</h3>
              <div className="space-y-3 text-sm">
                {portal.submittedAt && (
                  <ReadOnlyField label="Submitted On" value={new Date(portal.submittedAt).toLocaleString()} />
                )}
                {portal.reviewedAt && (
                  <ReadOnlyField label="Reviewed On" value={new Date(portal.reviewedAt).toLocaleString()} />
                )}
                {portal.rejectionReason && (
                  <div className="p-3 bg-red-50 rounded-lg border border-red-100">
                    <p className="text-xs text-red-600 font-medium">Rejection Reason</p>
                    <p className="text-sm text-red-700 mt-1">{portal.rejectionReason}</p>
                  </div>
                )}
              </div>
            </Card>

            {(portal.cvPdf || portal.paymentScreenshot) && (
              <Card glass>
                <h3 className="font-bold text-slate-900 mb-4">Uploaded Documents</h3>
                <div className="space-y-2 text-sm">
                  {portal.cvPdf && (
                    <a href={portal.cvPdf} target="_blank" rel="noreferrer" className="text-emerald-600 hover:underline flex items-center gap-2">
                      <FileText className="w-4 h-4" /> View CV (PDF)
                    </a>
                  )}
                  {portal.paymentScreenshot && (
                    <a href={portal.paymentScreenshot} target="_blank" rel="noreferrer" className="text-emerald-600 hover:underline block">
                      View Payment Screenshot
                    </a>
                  )}
                </div>
              </Card>
            )}
          </div>
        </div>
      )}

      <Card glass>
        <h3 className="font-bold text-slate-900 mb-2">Account Email</h3>
        <Input
          label="Email Address"
          icon={Mail}
          value={application?.email || user?.email || ''}
          disabled
          helper="Sign-in email from Clerk. Application details above come from your submitted form."
        />
      </Card>
    </div>
  );
}
