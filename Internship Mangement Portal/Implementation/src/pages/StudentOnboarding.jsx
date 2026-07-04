import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Upload, Briefcase } from 'lucide-react';
import toast from 'react-hot-toast';
import AuthLayout from '../components/auth/AuthLayout';
import Button from '../components/ui/Button';
import { fetchInternshipPostings } from '../services/internshipService';
import { submitPortalAccess } from '../services/portalAccessService';
import { useAuth } from '../context/AuthContext';
import { PORTAL_ACCESS_STATUS, ROUTES } from '../constants';

export default function StudentOnboarding() {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  const [postings, setPostings] = useState([]);
  const [screenshotPreview, setScreenshotPreview] = useState('');
  const [screenshotData, setScreenshotData] = useState('');
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  useEffect(() => {
    fetchInternshipPostings().then(setPostings).catch(() => toast.error('Failed to load internships'));
  }, []);

  const onFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setScreenshotPreview(reader.result);
      setScreenshotData(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = async (data) => {
    if (!screenshotData) {
      toast.error('Please upload your payment screenshot');
      return;
    }

    const result = await submitPortalAccess({
      postingId: data.postingId,
      notes: data.notes,
      paymentScreenshot: screenshotData,
    });

    if (!result.success) {
      toast.error(result.error);
      return;
    }

    await refreshUser();
    toast.success('Application submitted! A superadmin will review it shortly.');
    navigate(ROUTES.STUDENT.PENDING_APPROVAL);
  };

  return (
    <AuthLayout
      variant="student"
      title="Complete Your Application"
      subtitle="Choose your internship track and upload your payment screenshot. Full portal access is granted after superadmin approval."
      backLink={ROUTES.LANDING}
      backLabel="Back to home"
      features={[
        'Select your preferred internship track',
        'Upload payment confirmation screenshot',
        'Get notified once approved',
      ]}
    >
      {user?.portalAccessStatus === PORTAL_ACCESS_STATUS.REJECTED && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-sm text-red-700">
          <p className="font-semibold mb-1">Previous application rejected</p>
          <p>{user.portalAccess?.rejectionReason || 'Please resubmit with correct details.'}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
            Internship Track
          </label>
          <div className="relative">
            <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              {...register('postingId', { required: 'Select an internship' })}
            >
              <option value="">Select internship...</option>
              {postings.map((posting) => (
                <option key={posting.id} value={posting.id}>{posting.title}</option>
              ))}
            </select>
          </div>
          {errors.postingId && <p className="text-xs text-red-500 mt-1">{errors.postingId.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
            Payment Screenshot
          </label>
          <label className="flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-emerald-300 hover:bg-emerald-50/40 transition-colors">
            <Upload className="w-6 h-6 text-emerald-600" />
            <span className="text-sm text-gray-600">Upload payment proof (PNG, JPG, WebP)</span>
            <input type="file" accept="image/*" className="hidden" onChange={onFileChange} />
          </label>
          {screenshotPreview && (
            <img src={screenshotPreview} alt="Payment preview" className="mt-3 rounded-lg border border-gray-100 max-h-48 object-contain" />
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
            Notes (optional)
          </label>
          <textarea
            rows={3}
            placeholder="Transaction ID, bank name, or other details..."
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            {...register('notes')}
          />
        </div>

        <Button type="submit" className="w-full !from-emerald-600 !to-teal-500" size="lg" disabled={isSubmitting}>
          Submit for Approval
        </Button>
      </form>
    </AuthLayout>
  );
}
