import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  Upload, Briefcase, User, Building2, Phone, FileText, CreditCard,
} from 'lucide-react';
import toast from 'react-hot-toast';
import AuthLayout from '../components/auth/AuthLayout';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { fetchInternshipPostings } from '../services/internshipService';
import { submitPortalAccess } from '../services/portalAccessService';
import { useAuth } from '../context/AuthContext';
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
  const [postings, setPostings] = useState([]);
  const [screenshotPreview, setScreenshotPreview] = useState('');
  const [screenshotData, setScreenshotData] = useState('');
  const [cvFileName, setCvFileName] = useState('');
  const [cvData, setCvData] = useState('');
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      fullName: user?.name || '',
    },
  });

  useEffect(() => {
    fetchInternshipPostings().then(setPostings).catch(() => toast.error('Failed to load internships'));
  }, []);

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
      subtitle="Complete your profile, upload your CV (PDF), and submit payment proof. Portal access is granted after superadmin approval."
      backLink={ROUTES.LANDING}
      backLabel="Back to home"
      features={[
        'Personal & academic details',
        'CV upload in PDF format',
        'Payment screenshot verification',
      ]}
    >
      {user?.portalAccessStatus === PORTAL_ACCESS_STATUS.REJECTED && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-sm text-red-700">
          <p className="font-semibold mb-1">Previous application rejected</p>
          <p>{user.portalAccess?.rejectionReason || 'Please resubmit with correct details.'}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
