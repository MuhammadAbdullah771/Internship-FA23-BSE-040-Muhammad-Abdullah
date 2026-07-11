import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  Upload, Briefcase, User, Building2, Phone, FileText, CreditCard, RefreshCw, MapPin, Clock,
} from 'lucide-react';
import toast from 'react-hot-toast';
import AuthLayout from '../components/auth/AuthLayout';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import { fetchInternshipPostings } from '../services/internshipService';
import { submitPortalAccess } from '../services/portalAccessService';
import { useAuth } from '../context/AuthContext';
import { useRealtimePoll } from '../hooks/useRealtimePoll';
import { PORTAL_ACCESS_STATUS, ROUTES } from '../constants';

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function StudentOnboarding() {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  const [screenshotPreview, setScreenshotPreview] = useState('');
  const [screenshotData, setScreenshotData] = useState('');
  const [cvFileName, setCvFileName] = useState('');
  const [cvData, setCvData] = useState('');

  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      fullName: user?.portalAccess?.fullName || '',
      postingId: '',
    },
  });

  const selectedPostingId = watch('postingId');

  const { data: postings = [], lastUpdated, refresh } = useRealtimePoll(
    fetchInternshipPostings,
    { interval: 12000 },
  );

  const selectedPosting = useMemo(
    () => postings.find((p) => p.id === selectedPostingId) || null,
    [postings, selectedPostingId],
  );

  useEffect(() => {
    if (!selectedPostingId) return;
    const stillAvailable = postings.some((p) => p.id === selectedPostingId);
    if (!stillAvailable) {
      setValue('postingId', '');
      toast.error('Selected internship is no longer available. Please choose another.');
    }
  }, [postings, selectedPostingId, setValue]);

  const onScreenshotChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file for payment proof');
      return;
    }

    const dataUrl = await readFileAsDataUrl(file);
    setScreenshotPreview(dataUrl);
    setScreenshotData(dataUrl);
  };

  const onCvChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast.error('CV must be a PDF file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('CV must be under 5MB');
      return;
    }

    const dataUrl = await readFileAsDataUrl(file);
    setCvFileName(file.name);
    setCvData(dataUrl);
  };

  const onSubmit = async (data) => {
    if (!cvData) {
      toast.error('Please upload your CV in PDF format');
      return;
    }
    if (!screenshotData) {
      toast.error('Please upload your payment screenshot');
      return;
    }

    const result = await submitPortalAccess({
      postingId: data.postingId,
      fullName: data.fullName,
      fatherName: data.fatherName,
      institute: data.institute,
      cnic: data.cnic,
      contactNumber: data.contactNumber,
      notes: data.notes,
      cvPdf: cvData,
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
      wide
      title="Internship Application Form"
      subtitle="Choose an internship track (updates live), complete your profile, and submit payment proof."
      backLink={ROUTES.LANDING}
      backLabel="Back to home"
      features={[
        'Live internship listings',
        'Personal & academic details',
        'CV upload in PDF format',
      ]}
    >
      {user?.portalAccessStatus === PORTAL_ACCESS_STATUS.REJECTED && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-sm text-red-700">
          <p className="font-semibold mb-1">Previous application rejected — you can apply again</p>
          <p className="mb-2">{user.portalAccess?.rejectionReason || 'Please resubmit with correct details.'}</p>
          <p className="text-red-600/80">Choose a track below, update your details if needed, and submit a new application.</p>
        </div>
      )}

      {user?.portalAccess?.enrollmentStatus === 'completed' && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-100 text-sm text-emerald-800">
          <p className="font-semibold mb-1">Previous internship completed</p>
          <p>You can apply for a new internship below. Only one active enrollment is allowed at a time.</p>
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <p className="text-xs text-gray-500">
          {postings.length} internships available
          {lastUpdated ? ` · updated ${lastUpdated.toLocaleTimeString()}` : ''}
        </p>
        <button
          type="button"
          onClick={() => refresh(false)}
          className="inline-flex items-center gap-1 text-xs text-emerald-600 hover:text-emerald-500"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh list
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Select Internship Track (live)
          </label>
          <input type="hidden" {...register('postingId', { required: 'Select an internship' })} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {postings.map((posting) => {
              const active = selectedPostingId === posting.id;
              return (
                <button
                  key={posting.id}
                  type="button"
                  onClick={() => setValue('postingId', posting.id, { shouldValidate: true })}
                  className={`text-left p-4 rounded-xl border-2 transition-all ${
                    active
                      ? 'border-emerald-500 bg-emerald-50/60 shadow-sm'
                      : 'border-gray-200 hover:border-emerald-200 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{posting.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{posting.company}</p>
                    </div>
                    {posting.trending && <Badge variant="success">Trending</Badge>}
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3 text-[11px] text-gray-500">
                    <span className="inline-flex items-center gap-1"><Clock className="w-3 h-3" />{posting.duration}</span>
                    <span className="inline-flex items-center gap-1"><MapPin className="w-3 h-3" />{posting.type}</span>
                    <span>{posting.spots} spots</span>
                  </div>
                </button>
              );
            })}
          </div>
          {errors.postingId && <p className="text-xs text-red-500 mt-1">{errors.postingId.message}</p>}
        </div>

        {selectedPosting && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100">
            <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-1">Selected track</p>
            <p className="font-bold text-gray-900">{selectedPosting.title}</p>
            <p className="text-sm text-gray-600">{selectedPosting.company} · {selectedPosting.level}</p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Full Name"
            icon={User}
            placeholder="Muhammad Abdullah"
            error={errors.fullName?.message}
            {...register('fullName', { required: 'Full name is required' })}
          />
          <Input
            label="Father Name"
            icon={User}
            placeholder="Father's full name"
            error={errors.fatherName?.message}
            {...register('fatherName', { required: 'Father name is required' })}
          />
        </div>

        <Input
          label="Institute / University"
          icon={Building2}
          placeholder="University of Engineering and Technology"
          error={errors.institute?.message}
          {...register('institute', { required: 'Institute name is required' })}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="CNIC"
            icon={CreditCard}
            placeholder="12345-1234567-1"
            error={errors.cnic?.message}
            {...register('cnic', {
              required: 'CNIC is required',
              pattern: {
                value: /^(\d{5}-\d{7}-\d|\d{13})$/,
                message: 'Use format 12345-1234567-1',
              },
            })}
          />
          <Input
            label="Contact Number"
            icon={Phone}
            placeholder="03001234567"
            error={errors.contactNumber?.message}
            {...register('contactNumber', {
              required: 'Contact number is required',
              pattern: {
                value: /^(\+92|0)?3\d{9}$/,
                message: 'Enter a valid Pakistani mobile number',
              },
            })}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
            CV (PDF only)
          </label>
          <label className="flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-emerald-300 hover:bg-emerald-50/40 transition-colors">
            <FileText className="w-6 h-6 text-emerald-600" />
            <span className="text-sm text-gray-600">
              {cvFileName || 'Upload your CV as PDF (max 5MB)'}
            </span>
            <input type="file" accept="application/pdf,.pdf" className="hidden" onChange={onCvChange} />
          </label>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
            Payment Screenshot
          </label>
          <label className="flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-emerald-300 hover:bg-emerald-50/40 transition-colors">
            <Upload className="w-6 h-6 text-emerald-600" />
            <span className="text-sm text-gray-600">Upload payment proof (PNG, JPG, WebP)</span>
            <input type="file" accept="image/*" className="hidden" onChange={onScreenshotChange} />
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
          Submit Application
        </Button>
      </form>
    </AuthLayout>
  );
}
