import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, UserPlus, Trash2, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import Badge from '../components/ui/Badge';
import Avatar from '../components/ui/Avatar';
import SearchBar from '../components/common/SearchBar';
import Filter from '../components/common/Filter';
import Pagination from '../components/common/Pagination';
import InternFormModal from '../components/interns/InternFormModal';
import {
  fetchInterns,
  fetchInternFilters,
  fetchInternStats,
  deleteIntern,
} from '../services/internService';

const statusVariant = { Active: 'success', Onboarding: 'warning', Completed: 'default' };

export default function InternManagement() {
  const { isSuperadmin } = useAuth();
  const [interns, setInterns] = useState([]);
  const [stats, setStats] = useState(null);
  const [filterOptions, setFilterOptions] = useState({ departments: [], statuses: [], intakes: [] });
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('');
  const [status, setStatus] = useState('');
  const [intake, setIntake] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 1, limit: 10 });

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [listResult, statsResult, filtersResult] = await Promise.all([
        fetchInterns({
          page,
          limit: 10,
          search: search || undefined,
          department: department || undefined,
          status: status || undefined,
          intake: intake || undefined,
        }),
        fetchInternStats(),
        fetchInternFilters(),
      ]);
      setInterns(listResult.interns);
      setPagination(listResult.pagination);
      setStats(statsResult);
      setFilterOptions(filtersResult);
    } catch {
      toast.error('Failed to load interns. Ensure the API is running.');
    } finally {
      setLoading(false);
    }
  }, [page, search, department, status, intake]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    setPage(1);
  }, [search, department, status, intake]);

  const handleDelete = async (intern) => {
    if (!window.confirm(`Remove ${intern.name} from the cohort?`)) return;

    const result = await deleteIntern(intern.id);
    if (!result.success) {
      toast.error(result.error);
      return;
    }
    toast.success('Intern removed');
    loadData();
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            {isSuperadmin && <Shield className="w-5 h-5 text-emerald-600" />}
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Intern Management</h1>
          </div>
          <p className="text-gray-500">
            Manage and track your current intern cohort across all departments.
            {stats && (
              <span className="text-emerald-600 font-medium">
                {' '}{stats.total} total · {stats.active} active
              </span>
            )}
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <Button variant="outline" icon={RefreshCw} onClick={loadData} disabled={loading}>
            Refresh
          </Button>
          <Button variant="purple" icon={UserPlus} onClick={() => setModalOpen(true)}>
            Add Intern
          </Button>
        </div>
      </motion.div>

      <Card>
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <SearchBar
            placeholder="Search interns by name or email..."
            className="flex-1"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="flex gap-3 flex-wrap">
            <Filter
              label="Department"
              options={filterOptions.departments}
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-36"
            />
            <Filter
              label="Status"
              options={filterOptions.statuses}
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-32"
            />
            <Filter
              label="Intake"
              options={filterOptions.intakes}
              value={intake}
              onChange={(e) => setIntake(e.target.value)}
              className="w-28"
            />
          </div>
        </div>

        <div className="overflow-x-auto min-h-[200px]">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : interns.length === 0 ? (
            <p className="text-center text-gray-500 py-16">No interns found.</p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  {['Name', 'Email', 'Role', 'Department', 'Status', 'Actions'].map((h) => (
                    <th key={h} className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider py-3 px-4">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {interns.map((intern) => (
                  <tr key={intern.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <Avatar src={intern.avatar} name={intern.name} size="sm" />
                        <div>
                          <span className="font-medium text-gray-900 block">{intern.name}</span>
                          <span className="text-xs text-gray-400">Intake {intern.intake}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-500">{intern.email}</td>
                    <td className="py-4 px-4 text-gray-700">{intern.role}</td>
                    <td className="py-4 px-4 text-gray-500">{intern.department}</td>
                    <td className="py-4 px-4">
                      <Badge variant={statusVariant[intern.status]}>{intern.status}</Badge>
                    </td>
                    <td className="py-4 px-4">
                      <button
                        type="button"
                        onClick={() => handleDelete(intern)}
                        className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        aria-label={`Delete ${intern.name}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <Pagination
          current={page}
          total={pagination.total}
          perPage={pagination.limit}
          onPageChange={setPage}
        />
      </Card>

      <InternFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={() => loadData()}
      />
    </div>
  );
}
