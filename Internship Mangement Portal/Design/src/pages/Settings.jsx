import { useState } from 'react';
import { motion } from 'framer-motion';
import { Pencil, Mail } from 'lucide-react';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Textarea from '../components/ui/Textarea';
import Avatar from '../components/ui/Avatar';
import { skills, timeline } from '../constants/data';

const tabs = ['Personal Info', 'Skills & Experience', 'Internship Details', 'Security'];

export default function Settings() {
  const [activeTab, setActiveTab] = useState('Personal Info');

  return (
    <div className="space-y-6">
      <Card className="relative overflow-visible">
        <div className="flex flex-col sm:flex-row items-start gap-6">
          <div className="relative -mt-2">
            <Avatar src="https://i.pravatar.cc/150?u=alex" name="Alex Mercer" size="xl" />
            <button className="absolute bottom-0 right-0 w-8 h-8 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50" aria-label="Edit photo">
              <Pencil className="w-3.5 h-3.5 text-gray-500" />
            </button>
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">Alex Mercer</h1>
            <p className="text-gray-500 mt-0.5">Software Engineering Intern &bull; Cohort 2024</p>
          </div>
          <Button variant="outline" size="sm">View Public Profile</Button>
        </div>
      </Card>

      <div className="border-b border-gray-200 overflow-x-auto">
        <div className="flex gap-6 min-w-max">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-sm font-medium transition-colors relative ${
                activeTab === tab ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {tab}
              {activeTab === tab && (
                <motion.span layoutId="tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600" />
              )}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'Personal Info' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Personal Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Input label="First Name" defaultValue="Alex" />
              <Input label="Last Name" defaultValue="Mercer" />
              <div className="sm:col-span-2">
                <Input
                  label="Email Address"
                  icon={Mail}
                  defaultValue="alex.mercer@example.com"
                  disabled
                  helper="Email cannot be changed directly. Contact IT support."
                />
              </div>
              <Input label="Phone Number" defaultValue="+1 (555) 123-4567" />
              <Input label="Location" defaultValue="San Francisco, CA" />
              <div className="sm:col-span-2">
                <Textarea
                  label="Bio"
                  rows={4}
                  defaultValue="Passionate software engineering intern with a focus on frontend development and user experience. Currently working on dashboard components and design system integration."
                />
              </div>
            </div>
          </Card>

          <div className="space-y-6">
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Core Skills</h3>
                <button aria-label="Edit skills"><Pencil className="w-4 h-4 text-gray-400" /></button>
              </div>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <Badge key={skill} variant="primary">{skill}</Badge>
                ))}
              </div>
            </Card>

            <Card>
              <h3 className="font-semibold text-gray-900 mb-4">Timeline</h3>
              <div className="space-y-4">
                {timeline.map((item, i) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className={`w-3 h-3 rounded-full ${item.current ? 'bg-primary-600' : 'bg-gray-200'}`} />
                      {i < timeline.length - 1 && <div className="w-0.5 flex-1 bg-gray-200 my-1" />}
                    </div>
                    <div className="pb-2">
                      <p className="text-sm font-medium text-gray-900">{item.title}</p>
                      {item.subtext && <p className="text-xs text-gray-400">{item.subtext}</p>}
                      {item.date && <p className="text-xs text-gray-400">{item.date}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}

      {activeTab !== 'Personal Info' && (
        <Card>
          <p className="text-gray-500 text-center py-12">Content for {activeTab} will be available soon.</p>
        </Card>
      )}
    </div>
  );
}
