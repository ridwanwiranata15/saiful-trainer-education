// AdminDashboard.jsx
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { 
  Search, BookOpen, CheckCircle, CalendarClock, Users, 
  ChevronLeft, Plus, Eye, Edit, Trash2, X, 
  Award, Database, MessageSquare, Cloud, Target, User, Calendar,
  AlertTriangle, Loader2
} from 'lucide-react';
import AdminLayout from './layouts';
import Api from '../../services/Api';
import Cookies from 'js-cookie';

// ============================================
// DATA STORE (sebaiknya dipindahkan ke file terpisah)
// ============================================
const initialItemsData = {
  'CRS-001': { 
    name: 'Advanced Leadership', 
    category: 'leadership', 
    status: 'available', 
    instructor: 'Dr. Saiful', 
    capacity: '24 / 30', 
    date: 'Oct 15 - Oct 17, 2023',
    icon: 'award'
  },
  'CRS-002': { 
    name: 'Data Analysis Fundamentals', 
    category: 'technical', 
    status: 'upcoming', 
    instructor: 'Jane Doe', 
    capacity: '8 / 20', 
    date: 'Nov 05 - Nov 07, 2023',
    icon: 'database'
  },
  'CRS-003': { 
    name: 'Effective Communication', 
    category: 'soft-skills', 
    status: 'completed', 
    instructor: 'Mark Smith', 
    capacity: '25 / 25', 
    date: 'Sep 10 - Sep 11, 2023',
    icon: 'message-square'
  },
  'CRS-004': { 
    name: 'Cloud Computing Basics', 
    category: 'technical', 
    status: 'available', 
    instructor: 'Alex Johnson', 
    capacity: '12 / 20', 
    date: 'Oct 20 - Oct 22, 2023',
    icon: 'cloud'
  },
  'CRS-005': { 
    name: 'Strategic Management', 
    category: 'leadership', 
    status: 'upcoming', 
    instructor: 'Dr. Saiful', 
    capacity: '2 / 20', 
    date: 'Dec 01 - Dec 03, 2023',
    icon: 'target'
  }
};

// ============================================
// UTILITY FUNCTIONS
// ============================================
const getIconComponent = (iconName) => {
  const icons = {
    'award': Award,
    'database': Database,
    'message-square': MessageSquare,
    'cloud': Cloud,
    'target': Target,
    'book': BookOpen
  };
  return icons[iconName] || BookOpen;
};

const getStatusClasses = (status) => {
  const classes = {
    available: 'bg-green-500/10 text-green-500 border-green-500/20',
    upcoming: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    completed: 'bg-gray-500/10 text-gray-500 border-gray-500/20'
  };
  return classes[status] || classes.completed;
};

const getStatusLabel = (status) => {
  return status.charAt(0).toUpperCase() + status.slice(1);
};

// ============================================
// COMPONENTS
// ============================================

// Stat Card Component with Loading State
const StatCard = ({ 
  icon: Icon, 
  title, 
  value, 
  subtitle, 
  isLoading = false,
  iconBg = 'bg-[#0F52BA]/10', 
  iconColor = 'text-[#0F52BA]', 
  subtitleColor = 'text-gray-500' 
}) => (
  <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm flex flex-col gap-4 hover:shadow-md transition-shadow">
    <div className="flex items-center gap-3">
      <div className={`size-10 ${iconBg} rounded-xl flex items-center justify-center ${iconColor}`}>
        <Icon className="size-5" />
      </div>
      <p className="font-medium text-gray-500 text-sm">{title}</p>
    </div>
    <div className="flex items-end justify-between">
      {isLoading ? (
        <div className="flex items-center gap-2">
          <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
          <Loader2 className="size-5 text-[#0F52BA] animate-spin" />
        </div>
      ) : (
        <p className="font-bold text-3xl text-gray-900">{value}</p>
      )}
      {subtitle && !isLoading && (
        <span className={`text-xs font-medium ${subtitleColor}`}>
          {subtitle}
        </span>
      )}
    </div>
  </div>
);

// Skeleton Stat Card for Loading
const StatCardSkeleton = ({ icon: Icon, title, iconBg = 'bg-[#0F52BA]/10', iconColor = 'text-[#0F52BA]' }) => (
  <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm flex flex-col gap-4">
    <div className="flex items-center gap-3">
      <div className={`size-10 ${iconBg} rounded-xl flex items-center justify-center ${iconColor}`}>
        <Icon className="size-5" />
      </div>
      <p className="font-medium text-gray-500 text-sm">{title}</p>
    </div>
    <div className="flex items-end justify-between">
      <div className="flex items-center gap-2">
        <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
        <Loader2 className="size-5 text-[#0F52BA] animate-spin" />
      </div>
    </div>
  </div>
);

// Action Button Component
const ActionButton = ({ onClick, icon: Icon, label, danger = false }) => (
  <button 
    onClick={onClick}
    className={`size-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 transition-colors cursor-pointer ${
      danger ? 'hover:text-red-500 hover:bg-red-500/10' : 'hover:text-[#0F52BA]'
    }`}
    title={label}
  >
    <Icon className="size-4" />
  </button>
);

// Course Table Row Component
const CourseTableRow = ({ id, data, onView, onEdit, onDelete }) => {
  const IconComponent = getIconComponent(data.icon || 'book');
  const statusClass = getStatusClasses(data.status);
  const statusLabel = getStatusLabel(data.status);
  const capacityParts = data.capacity.split(' / ');
  const current = parseInt(capacityParts[0]) || 0;
  const total = parseInt(capacityParts[1]) || 0;
  const percentage = total > 0 ? (current / total) * 100 : 0;

  return (
    <tr className="hover:bg-gray-50/30 transition-colors group">
      <td className="p-4">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-lg bg-[#0F52BA]/10 flex items-center justify-center shrink-0">
            <IconComponent className="size-5 text-[#0F52BA]" />
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-sm">{data.name}</p>
            <p className="text-xs text-gray-500 mt-0.5">{id}</p>
          </div>
        </div>
      </td>
      <td className="p-4 hidden md:table-cell text-sm text-gray-500 capitalize">
        {data.category.replace('-', ' ')}
      </td>
      <td className="p-4 hidden lg:table-cell">
        <p className="text-sm text-gray-900">{data.date}</p>
      </td>
      <td className="p-4 hidden sm:table-cell">
        <div className="flex items-center gap-2">
          <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className={`h-full ${percentage > 80 ? 'bg-[#0F52BA]' : percentage > 50 ? 'bg-yellow-500' : 'bg-gray-400'}`} 
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>
          <span className="text-xs font-medium text-gray-500">{data.capacity}</span>
        </div>
      </td>
      <td className="p-4">
        <span className={`px-2.5 py-1 rounded-md text-xs font-semibold border ${statusClass}`}>
          {statusLabel}
        </span>
      </td>
      <td className="p-4 text-right">
        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <ActionButton onClick={() => onView(id)} icon={Eye} label="View Details" />
          <ActionButton onClick={() => onEdit(id)} icon={Edit} label="Edit" />
          <ActionButton onClick={() => onDelete(id)} icon={Trash2} label="Delete" danger />
        </div>
      </td>
    </tr>
  );
};

// Form Modal Component
const FormModal = ({ isOpen, onClose, onSave, editingId, itemsData }) => {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    category: 'leadership',
    instructor: '',
    status: 'available',
    capacity: ''
  });

  useEffect(() => {
    if (editingId && itemsData[editingId]) {
      const data = itemsData[editingId];
      const capParts = data.capacity.split(' / ');
      setFormData({
        id: editingId,
        name: data.name,
        category: data.category,
        instructor: data.instructor,
        status: data.status,
        capacity: capParts[1] || ''
      });
    } else {
      setFormData({
        id: '',
        name: '',
        category: 'leadership',
        instructor: '',
        status: 'available',
        capacity: ''
      });
    }
  }, [editingId, itemsData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.id || !formData.name) {
      alert('Please fill in all required fields');
      return;
    }
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-gray-200 flex items-center justify-between bg-gray-50">
          <h3 className="font-bold text-lg text-gray-900">
            {editingId ? 'Edit Course' : 'Add New Course'}
          </h3>
          <button onClick={onClose} className="size-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 cursor-pointer">
            <X className="size-5" />
          </button>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto flex-1 flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1.5">
              Course Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Advanced Leadership"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0F52BA]/20 focus:border-[#0F52BA] text-sm transition-all"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1.5">
                Course ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.id}
                onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                disabled={!!editingId}
                placeholder="e.g. CRS-006"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0F52BA]/20 focus:border-[#0F52BA] text-sm disabled:bg-gray-100 transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1.5">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0F52BA]/20 focus:border-[#0F52BA] text-sm bg-white transition-all"
              >
                <option value="leadership">Leadership</option>
                <option value="technical">Technical</option>
                <option value="soft-skills">Soft Skills</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1.5">Instructor</label>
            <input
              type="text"
              value={formData.instructor}
              onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
              placeholder="Instructor Name"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0F52BA]/20 focus:border-[#0F52BA] text-sm transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1.5">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0F52BA]/20 focus:border-[#0F52BA] text-sm bg-white transition-all"
              >
                <option value="available">Available</option>
                <option value="upcoming">Upcoming</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1.5">Capacity</label>
              <input
                type="number"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                placeholder="e.g. 30"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0F52BA]/20 focus:border-[#0F52BA] text-sm transition-all"
              />
            </div>
          </div>

          <div className="p-5 border-t border-gray-200 bg-gray-50 flex items-center justify-end gap-3 -mx-5 -mb-5 mt-2">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-5 py-2.5 rounded-xl font-medium text-gray-500 hover:bg-gray-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-5 py-2.5 rounded-xl font-semibold bg-[#0F52BA] text-white hover:bg-[#0B3D8C] transition-colors shadow-sm shadow-[#0F52BA]/20 cursor-pointer"
            >
              {editingId ? 'Update Course' : 'Save Course'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Detail Modal Component
const DetailModal = ({ isOpen, onClose, onEdit, onDelete, itemId, itemsData }) => {
  if (!isOpen || !itemId || !itemsData[itemId]) return null;

  const data = itemsData[itemId];
  const statusClass = getStatusClasses(data.status);
  const statusLabel = getStatusLabel(data.status);
  const IconComponent = getIconComponent(data.icon || 'book');

  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-gray-200 flex items-start justify-between relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-[#0F52BA]"></div>
          <div className="flex gap-4 items-center z-10">
            <div className="size-14 rounded-xl bg-[#0F52BA]/10 flex items-center justify-center shrink-0">
              <IconComponent className="size-7 text-[#0F52BA]" />
            </div>
            <div>
              <h3 className="font-bold text-xl text-gray-900">{data.name}</h3>
              <p className="text-sm text-gray-500 mt-1">{itemId}</p>
            </div>
          </div>
          <button onClick={onClose} className="size-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 cursor-pointer z-10">
            <X className="size-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1">
          <div className="grid grid-cols-2 gap-y-6 gap-x-4">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Status</p>
              <span className={`px-2.5 py-1 rounded-md text-xs font-semibold border ${statusClass}`}>
                {statusLabel}
              </span>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Category</p>
              <p className="font-medium text-gray-900 text-sm capitalize">{data.category.replace('-', ' ')}</p>
            </div>
            
            <div className="col-span-2 h-px bg-gray-200"></div>
            
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Instructor</p>
              <div className="flex items-center gap-2">
                <div className="size-6 rounded-full bg-gray-100 flex items-center justify-center">
                  <User className="size-3 text-gray-500" />
                </div>
                <p className="font-medium text-gray-900 text-sm">{data.instructor}</p>
              </div>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Capacity</p>
              <p className="font-medium text-gray-900 text-sm">{data.capacity} Enrolled</p>
            </div>

            <div className="col-span-2 h-px bg-gray-200"></div>

            <div className="col-span-2">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Schedule</p>
              <div className="bg-gray-50 rounded-xl p-3 border border-gray-200 flex items-center gap-3">
                <Calendar className="size-5 text-gray-500" />
                <div>
                  <p className="font-medium text-gray-900 text-sm">{data.date}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-5 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
          <button 
            onClick={() => { onDelete(itemId); onClose(); }} 
            className="px-4 py-2 rounded-xl font-medium text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer text-sm flex items-center gap-2"
          >
            <Trash2 className="size-4" /> Delete
          </button>
          <button 
            onClick={() => { onEdit(itemId); onClose(); }} 
            className="px-5 py-2.5 rounded-xl font-semibold bg-[#0F52BA] text-white hover:bg-[#0B3D8C] transition-colors shadow-sm shadow-[#0F52BA]/20 cursor-pointer text-sm flex items-center gap-2"
          >
            <Edit className="size-4" /> Edit Course
          </button>
        </div>
      </div>
    </div>
  );
};

// Delete Modal Component
const DeleteModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-[110] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-6 text-center animate-in zoom-in-95 duration-200">
        <div className="size-14 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="size-7 text-red-500" />
        </div>
        <h3 className="font-bold text-xl text-gray-900 mb-2">Delete Course?</h3>
        <p className="text-gray-500 text-sm mb-6">
          Are you sure you want to delete this course? This action cannot be undone and will remove all associated data.
        </p>
        <div className="flex items-center gap-3">
          <button 
            onClick={onClose} 
            className="flex-1 py-2.5 rounded-xl font-medium text-gray-500 border border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm} 
            className="flex-1 py-2.5 rounded-xl font-semibold bg-red-500 text-white hover:bg-red-500/90 transition-colors shadow-sm shadow-red-500/20 cursor-pointer"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================
// MAIN DASHBOARD COMPONENT
// ============================================
const AdminDashboard = () => {
  // States
  document.title = "Halaman dashboard - Saiful training"
  const [itemsData, setItemsData] = useState(initialItemsData);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState(0);
  const [upcoming, setUpcoming] = useState(0);
  const [missed, setMissed] = useState(0);
  const [orders, setOrders] = useState(0);

  // ============================================
  // FETCH DASHBOARD DATA
  // ============================================
  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const token = Cookies.get('token');
      
      if (!token) {
        console.warn('No token found');
        setLoading(false);
        return;
      }

      const response = await Api.get('/api/admin/dashboard', {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`
        }
      });
      setDashboardData(response.data);
      
      // Update states with data from API
      if (response.data && response.data.data) {
        const data = response.data.data;
        setCourses(data.courses || 0);
        setUpcoming(data.upcoming || 0);
        setMissed(data.missed || 0);
        setOrders(data.orders || 0);
      }
      
    } catch (error) {
      console.error('Error fetching dashboard:', error);
      
      // Handle specific error cases
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
        
        if (error.response.status === 401) {
          console.warn('Unauthorized - token mungkin expired');
        } else if (error.response.status === 404) {
          console.warn('Endpoint tidak ditemukan');
        }
      } else if (error.request) {
        console.error('No response received:', error.request);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch data when component mounts
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // ============================================
  // COMPUTED VALUES
  // ============================================
  
  const stats = useMemo(() => {
    const total = Object.keys(itemsData).length;
    const available = Object.values(itemsData).filter(d => d.status === 'available').length;
    const upcomingStats = Object.values(itemsData).filter(d => d.status === 'upcoming').length;
    return { total, available, upcoming: upcomingStats };
  }, [itemsData]);

  const filteredItems = useMemo(() => {
    return Object.entries(itemsData).filter(([id, data]) => {
      const searchMatch = searchTerm === '' || 
        `${data.name} ${id}`.toLowerCase().includes(searchTerm.toLowerCase());
      const statusMatch = statusFilter === 'all' || data.status === statusFilter;
      const categoryMatch = categoryFilter === 'all' || data.category === categoryFilter;
      return searchMatch && statusMatch && categoryMatch;
    });
  }, [itemsData, searchTerm, statusFilter, categoryFilter]);

  const filteredCount = filteredItems.length;

  // ============================================
  // HANDLERS
  // ============================================

  const handleSaveCourse = useCallback((formData) => {
    if (editingId) {
      // Edit existing
      setItemsData(prev => ({
        ...prev,
        [editingId]: {
          ...prev[editingId],
          name: formData.name,
          category: formData.category,
          instructor: formData.instructor || 'TBD',
          status: formData.status,
          capacity: `0 / ${formData.capacity || '20'}`
        }
      }));
      alert('Course updated successfully');
    } else {
      // Add new
      if (itemsData[formData.id]) {
        alert('Course ID already exists');
        return;
      }
      setItemsData(prev => ({
        ...prev,
        [formData.id]: {
          name: formData.name,
          category: formData.category,
          status: formData.status,
          instructor: formData.instructor || 'TBD',
          capacity: `0 / ${formData.capacity || '20'}`,
          date: 'TBD',
          icon: formData.category === 'technical' ? 'database' : 
                formData.category === 'leadership' ? 'award' : 'message-square'
        }
      }));
      alert('Course added successfully');
    }
    setFormModalOpen(false);
    setEditingId(null);
  }, [editingId, itemsData]);

  const handleDeleteCourse = useCallback(() => {
    if (deleteItemId) {
      setItemsData(prev => {
        const newData = { ...prev };
        delete newData[deleteItemId];
        return newData;
      });
      alert('Course deleted successfully');
      setDeleteItemId(null);
      setDeleteModalOpen(false);
    }
  }, [deleteItemId]);

  const resetFilters = useCallback(() => {
    setSearchTerm('');
    setStatusFilter('all');
    setCategoryFilter('all');
  }, []);

  // Modal Handlers
  const openAddModal = useCallback(() => {
    setEditingId(null);
    setFormModalOpen(true);
  }, []);

  const openEditModal = useCallback((id) => {
    setEditingId(id);
    setFormModalOpen(true);
  }, []);

  const openDetailModal = useCallback((id) => {
    setSelectedItemId(id);
    setDetailModalOpen(true);
  }, []);

  const openDeleteModal = useCallback((id) => {
    setDeleteItemId(id);
    setDeleteModalOpen(true);
  }, []);

  // ============================================
  // RENDER
  // ============================================
  return (
    <AdminLayout>
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Dashboard Management</h2>
            <p className="text-gray-500 text-sm mt-1">
              Manage training programs, schedules, and availability.
            </p>
          </div>
          {/* <button
            onClick={openAddModal}
            className="px-5 py-2.5 rounded-xl font-semibold bg-[#0F52BA] text-white hover:bg-[#0B3D8C] transition-colors shadow-sm shadow-[#0F52BA]/20 flex items-center gap-2 cursor-pointer"
          >
            <Plus className="size-5" /> Add New Course
          </button> */}
        </div>

        {/* Stats Grid with Loading State */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {loading ? (
            // Show skeleton loading for all cards
            <>
              <StatCardSkeleton icon={BookOpen} title="Total Courses" />
              <StatCardSkeleton icon={CheckCircle} title="Missed Courses" iconBg="bg-green-500/10" iconColor="text-green-500" />
              <StatCardSkeleton icon={CalendarClock} title="Upcoming Courses" iconBg="bg-yellow-500/10" iconColor="text-yellow-500" />
              <StatCardSkeleton icon={Users} title="Total Orders" />
            </>
          ) : (
            // Show actual data
            <>
              <StatCard
                icon={BookOpen}
                title="Total Courses"
                value={courses}
                subtitle="+12%"
                subtitleColor="text-green-500 bg-green-500/10 px-2 py-1 rounded-md"
              />
              <StatCard
                icon={CheckCircle}
                title="Missed Courses"
                value={missed}
                subtitle="Currently active"
                iconBg="bg-green-500/10"
                iconColor="text-green-500"
              />
              <StatCard
                icon={CalendarClock}
                title="Upcoming Courses"
                value={upcoming}
                subtitle="Next 30 days"
                iconBg="bg-yellow-500/10"
                iconColor="text-yellow-500"
              />
              <StatCard
                icon={Users}
                title="Total Orders"
                value={orders}
                subtitle="+5%"
                subtitleColor="text-green-500 bg-green-500/10 px-2 py-1 rounded-md"
              />
            </>
          )}
        </div>

        {/* Filters & Search */}
        {/* <div className="bg-white p-4 rounded-t-2xl border border-gray-200 border-b-0 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search courses by name or ID..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F52BA]/20 focus:border-[#0F52BA] transition-all text-sm"
            />
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 scrollbar-hide">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0F52BA]/20 focus:border-[#0F52BA] text-sm font-medium min-w-[130px] cursor-pointer transition-all"
            >
              <option value="all">All Status</option>
              <option value="available">Available</option>
              <option value="upcoming">Upcoming</option>
              <option value="completed">Completed</option>
            </select>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0F52BA]/20 focus:border-[#0F52BA] text-sm font-medium min-w-[140px] cursor-pointer transition-all"
            >
              <option value="all">All Categories</option>
              <option value="leadership">Leadership</option>
              <option value="technical">Technical</option>
              <option value="soft-skills">Soft Skills</option>
            </select>
          </div>
        </div> */}

        {/* Data Table */}
        {/* <div className="bg-white border border-gray-200 rounded-b-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-left border-collapse">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="p-4 font-semibold text-xs text-gray-500 uppercase tracking-wider">
                    Course Details
                  </th>
                  <th className="p-4 font-semibold text-xs text-gray-500 uppercase tracking-wider hidden md:table-cell">
                    Category
                  </th>
                  <th className="p-4 font-semibold text-xs text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                    Schedule
                  </th>
                  <th className="p-4 font-semibold text-xs text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                    Capacity
                  </th>
                  <th className="p-4 font-semibold text-xs text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="p-4 font-semibold text-xs text-gray-500 uppercase tracking-wider text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredItems.map(([id, data]) => (
                  <CourseTableRow
                    key={id}
                    id={id}
                    data={data}
                    onView={openDetailModal}
                    onEdit={openEditModal}
                    onDelete={openDeleteModal}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {filteredCount === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center bg-white">
              <div className="size-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Search className="size-8 text-gray-500" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">No courses found</h3>
              <p className="text-gray-500 text-sm max-w-sm">
                We couldn't find any courses matching your current filters. 
                Try adjusting your search or category.
              </p>
              <button
                onClick={resetFilters}
                className="mt-4 text-[#0F52BA] font-medium hover:underline cursor-pointer"
              >
                Clear all filters
              </button>
            </div>
          )}

          <div className="p-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white">
            <p className="text-sm text-gray-500">
              Showing <span className="font-medium text-gray-900">1</span> to{' '}
              <span className="font-medium text-gray-900">{filteredCount}</span> of{' '}
              <span className="font-medium text-gray-900">
                {Object.keys(itemsData).length}
              </span> entries
            </p>
            <div className="flex items-center gap-1">
              <button 
                className="size-8 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-100 disabled:opacity-50 cursor-pointer" 
                disabled
              >
                <ChevronLeft className="size-4" />
              </button>
              <button className="size-8 flex items-center justify-center rounded-lg bg-[#0F52BA] text-white font-medium text-sm cursor-pointer shadow-sm shadow-[#0F52BA]/20">
                1
              </button>
              <button className="size-8 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-100 font-medium text-sm text-gray-500 cursor-pointer">
                2
              </button>
              <button className="size-8 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-100 font-medium text-sm text-gray-500 hidden sm:flex cursor-pointer">
                3
              </button>
              <span className="px-1 text-gray-500 hidden sm:block">...</span>
              <button className="size-8 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-100 font-medium text-sm text-gray-500 hidden sm:flex cursor-pointer">
                25
              </button>
              <button className="size-8 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-100 cursor-pointer">
                <ChevronLeft className="size-4 rotate-180" />
              </button>
            </div>
          </div>
        </div> */}
      </div>

      {/* Modals */}
      <FormModal
        isOpen={formModalOpen}
        onClose={() => { setFormModalOpen(false); setEditingId(null); }}
        onSave={handleSaveCourse}
        editingId={editingId}
        itemsData={itemsData}
      />

      <DetailModal
        isOpen={detailModalOpen}
        onClose={() => { setDetailModalOpen(false); setSelectedItemId(null); }}
        onEdit={openEditModal}
        onDelete={openDeleteModal}
        itemId={selectedItemId}
        itemsData={itemsData}
      />

      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => { setDeleteModalOpen(false); setDeleteItemId(null); }}
        onConfirm={handleDeleteCourse}
      />
    </AdminLayout>
  );
};

export default AdminDashboard;