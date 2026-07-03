import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, UserPlus } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import Badge from '../components/ui/Badge';
import Avatar from '../components/ui/Avatar';
import SearchBar from '../components/common/SearchBar';
import Filter from '../components/common/Filter';
import Pagination from '../components/common/Pagination';
import { interns } from '../constants/data';

const statusVariant = { Active: 'success', Onboarding: 'warning', Completed: 'default' };

export default function InternManagement() {
  const [search, setSearch] = useState('');
  const { isSuperadmin } = useAuth();

  const filtered = interns.filter(
    (i) =>
      i.name.toLowerCase().includes(search.toLowerCase()) ||
      i.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            {isSuperadmin && <Shield className="w-5 h-5 text-emerald-600" />}
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Intern Management</h1>
          </div>
          <p className="text-gray-500">Manage and track your current intern cohort across all departments.</p>
        </div>
        <Button variant="purple" icon={UserPlus} className="shrink-0">Add Intern</Button>
      </motion.div>

      <Card>
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <SearchBar
            placeholder="Search interns by name or email..."
            className="flex-1"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="flex gap-3">
            <Filter label="Department" options={['Engineering', 'Design', 'Marketing']} className="w-36" />
            <Filter label="Status" options={['Active', 'Onboarding', 'Completed']} className="w-32" />
            <Filter label="Intake" options={['2024', '2023']} className="w-28" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                {['Name', 'Email', 'Role', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider py-3 px-4">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((intern) => (
                <tr key={intern.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <Avatar src={intern.avatar} name={intern.name} size="sm" />
                      <span className="font-medium text-gray-900">{intern.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-gray-500">{intern.email}</td>
                  <td className="py-4 px-4 text-gray-700">{intern.role}</td>
                  <td className="py-4 px-4">
                    <Badge variant={statusVariant[intern.status]}>{intern.status}</Badge>
                  </td>
                  <td className="py-4 px-4" />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination total={128} />
      </Card>
    </div>
  );
}
