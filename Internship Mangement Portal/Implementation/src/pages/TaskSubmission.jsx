import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Code, Link as LinkIcon, UploadCloud, Image, X, Pencil, Lightbulb, MoveRight } from 'lucide-react';
import toast from 'react-hot-toast';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Textarea from '../components/ui/Textarea';
import { submissionHistory } from '../constants/data';

export default function TaskSubmission() {
  const { register, handleSubmit } = useForm();
  const [files, setFiles] = useState(['screenshot_mobile.png']);

  const onSubmit = () => {
    toast.success('Draft saved successfully');
  };

  const removeFile = (name) => setFiles(files.filter((f) => f !== name));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-sm text-gray-400 mb-1">Tasks &gt; Frontend Development &gt; Submit</p>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Submit Task</h1>
          <p className="text-gray-500 mt-1">Implement responsive dashboard layout</p>
        </motion.div>
        <Badge variant="primary" className="self-start flex items-center gap-1.5 px-3 py-1">
          <span className="w-2 h-2 rounded-full bg-primary-600" />
          IN PROGRESS
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Task Details</h2>
            <p className="text-sm text-gray-600 mb-4">
              Build a fully responsive dashboard layout that works across mobile, tablet, and desktop viewports. Submit your GitHub repository link and any relevant documentation.
            </p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2"><span className="text-primary-500 mt-1">&#8226;</span>Support mobile, tablet, and desktop breakpoints</li>
              <li className="flex items-start gap-2"><span className="text-primary-500 mt-1">&#8226;</span>Follow WCAG 2.1 accessibility guidelines</li>
              <li className="flex items-start gap-2"><span className="text-primary-500 mt-1">&#8226;</span>Include unit tests for core components</li>
            </ul>
          </Card>

          <Card>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  GitHub Link <span className="text-red-500">*</span>
                </label>
                <Input
                  icon={Code}
                  placeholder="https://github.com/username/repo"
                  {...register('github', { required: true })}
                />
              </div>
              <Input
                label="Live URL (Optional)"
                icon={LinkIcon}
                placeholder="https://your-app.vercel.app"
                {...register('liveUrl')}
              />
              <Textarea
                label="Comments"
                placeholder="Add any notes for the reviewer..."
                rows={4}
                {...register('comments')}
              />

              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Attachments</p>
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-primary-300 transition-colors cursor-pointer">
                  <UploadCloud className="w-8 h-8 text-primary-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Drag and drop files here or <span className="text-primary-600 font-medium">browse files</span></p>
                  <p className="text-xs text-gray-400 mt-1">Max 10MB</p>
                </div>
                {files.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {files.map((file) => (
                      <div key={file} className="flex items-center gap-3 bg-gray-50 rounded-lg px-3 py-2">
                        <Image className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-700 flex-1">{file}</span>
                        <button type="button" onClick={() => removeFile(file)} aria-label={`Remove ${file}`}>
                          <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-center pt-2">
                <Button type="submit" variant="secondary" className="min-w-[160px]">Save Draft</Button>
              </div>
            </form>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Submission History</h3>
            <div className="space-y-0">
              {submissionHistory.map((item, i) => (
                <div key={item.id} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-3 h-3 rounded-full ${item.active ? 'bg-primary-600 ring-4 ring-primary-100' : 'bg-gray-200'}`} />
                    {i < submissionHistory.length - 1 && <div className="w-0.5 flex-1 bg-gray-200 my-1" />}
                  </div>
                  <div className="pb-6">
                    <p className="text-sm font-medium text-gray-900">{item.title}</p>
                    <p className="text-xs text-gray-400">{item.time}</p>
                    <p className="text-xs text-gray-500 mt-1">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <div className="bg-primary-50 rounded-2xl p-5">
            <div className="flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-primary-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-primary-700 mb-1">Need Help?</h4>
                <p className="text-xs text-primary-600/80 leading-relaxed mb-3">
                  Check our submission guidelines for tips on formatting your work and what reviewers look for.
                </p>
                <a href="#" className="inline-flex items-center gap-1 text-xs font-medium text-primary-600 hover:text-primary-500">
                  Read Guidelines <MoveRight className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
