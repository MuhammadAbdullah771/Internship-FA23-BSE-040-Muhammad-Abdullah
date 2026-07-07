import { useState, useEffect } from 'react';
import { Mail, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useAuth } from '../context/AuthContext';
import { updateProfile } from '../services/authService';
import { PORTAL_ACCESS_STATUS } from '../constants';

const PORTAL_STATUS_LABELS = {
  [PORTAL_ACCESS_STATUS.UNSUBMITTED]: { label: 'Not Submitted', variant: 'default' },
  [PORTAL_ACCESS_STATUS.PENDING]: { label: 'Pending Approval', variant: 'warning' },
  [PORTAL_ACCESS_STATUS.APPROVED]: { label: 'Approved', variant: 'success' },
  [PORTAL_ACCESS_STATUS.REJECTED]: { label: 'Rejected', variant: 'danger' },
};

export default function Settings() {
  const { user, refreshUser } = useAuth();
  const portal = user?.portalAccess || {};
  const statusConfig = PORTAL_STATUS_LABELS[user?.portalAccessStatus] || PORTAL_STATUS_LABELS.unsubmitted;

  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [contactNumber, setContactNumber] = useState(portal.contactNumber || '');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setFirstName(user?.firstName || '');
    setLastName(user?.lastName || '');
    setContactNumber(user?.portalAccess?.contactNumber || '');
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    const result = await updateProfile({ firstName, lastName, contactNumber });
    setSaving(false);

    if (result.success) {
      await refreshUser();
      toast.success('Profile updated successfully');
    } else {
      toast.error(result.error);
    }
  };

  return (
    <div className="space-y-6">
      <Card glass className="relative overflow-visible">
        <div className="flex flex-col sm:flex-row items-start gap-6">
          <div className="relative -mt-2">
            <div className="w-20 h-20 rounded-2xl overflow-hidden">
              <img
                src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'S')}`}
                alt={user?.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">{user?.name || 'Student'}</h1>
            <p className="text-slate-500 mt-0.5 font-medium">{portal.internshipTitle || 'Internship Student'}</p>
            <Badge variant={statusConfig.variant} className="mt-2">{statusConfig.label}</Badge>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card glass className="lg:col-span-2">
          <h2 className="text-lg font-bold text-slate-900 mb-6">Personal Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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
            <div className="sm:col-span-2">
              <Input
                label="Email Address"
                icon={Mail}
                value={user?.email || ''}
                disabled
                helper="Email is managed through your sign-in provider."
              />
            </div>
            <Input
              label="Contact Number"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              placeholder="+92 300 1234567"
            />
            <Input
              label="CNIC"
              value={portal.cnic || ''}
              disabled
              helper="Set during onboarding."
            />
            <div className="sm:col-span-2">
              <Input
                label="Institute"
                value={portal.institute || ''}
                disabled
                helper="Set during onboarding."
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <Button variant="purple" icon={Save} onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </Card>

        <div className="space-y-6">
          <Card glass>
            <h3 className="font-bold text-slate-900 mb-4">Internship Details</h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-xs text-gray-400">Track</p>
                <p className="font-medium text-gray-900">{portal.internshipTitle || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Father&apos;s Name</p>
                <p className="font-medium text-gray-900">{portal.fatherName || '—'}</p>
              </div>
              {portal.submittedAt && (
                <div>
                  <p className="text-xs text-gray-400">Application Submitted</p>
                  <p className="font-medium text-gray-900">
                    {new Date(portal.submittedAt).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </div>
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
              <h3 className="font-bold text-slate-900 mb-4">Onboarding Documents</h3>
              <div className="space-y-2 text-sm">
                {portal.cvPdf && (
                  <a href={portal.cvPdf} target="_blank" rel="noreferrer" className="text-emerald-600 hover:underline block">
                    View CV (PDF)
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
    </div>
  );
}
