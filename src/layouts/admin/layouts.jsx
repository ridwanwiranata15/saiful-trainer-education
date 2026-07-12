// AdminLayout.jsx
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Cookies from 'js-cookie';
import { Link, useNavigate } from 'react-router-dom';
import { 
  GraduationCap, LayoutDashboard, BookOpen, Users, PieChart, 
  LogOut, Menu, ChevronRight, Search, Bell, ChevronDown,
  Plus, CheckCircle, CalendarClock, Award, Database, MessageSquare,
  Cloud, Target, Eye, Edit, Trash2, X, AlertTriangle, User,
  Calendar, ChevronLeft, Loader2
} from 'lucide-react';
import { ChartBarIcon } from 'lucide-react';
import { ShoppingBag } from 'lucide-react';

// ============================================
// DATA STORE
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

// Sidebar Component
const Sidebar = ({ isOpen, toggleSidebar, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Remove cookies
      Cookies.remove('token');
      Cookies.remove('user');
      Cookies.remove('permissions');
      
      // Redirect to login
      navigate('/admin/login', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={toggleSidebar}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`flex flex-col w-[280px] h-screen fixed left-0 z-50 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out shadow-xl lg:shadow-none ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        {/* Logo */}
        <div className="flex items-center justify-between border-b border-gray-200 h-[72px] px-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#0F52BA] rounded-xl flex items-center justify-center shadow-sm shadow-[#0F52BA]/20">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <h1 className="font-bold text-sm leading-tight tracking-tight text-gray-900">SAIFUL TRAINING</h1>
              <span className="text-[10px] font-medium text-gray-500 tracking-widest uppercase">Consulting</span>
            </div>
          </div>
          <button onClick={toggleSidebar} className="lg:hidden size-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500">
            <X className="size-5" />
          </button>
        </div>
        
        {/* Navigation */}
        <nav className="flex flex-col p-4 gap-2 overflow-y-auto flex-1">
          <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 mt-2">Menu</p>
          
          <NavItem icon={LayoutDashboard} label="Dashboard" active={false} path={'/admin/dashboard'}/>
          <NavItem icon={BookOpen} label="Courses" active={false} path={'/admin/courses'}/>
          <NavItem icon={Users} label="Clients" active={false} />
          <NavItem icon={ShoppingBag} label="Orders" active={false} />
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-200">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 text-red-500 hover:bg-red-500/10 px-3 py-2.5 rounded-xl transition-all cursor-pointer"
          >
            <LogOut className="size-5" />
            <span className="font-medium">Log Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

// Navigation Item
const NavItem = ({ icon: Icon, label, active, path }) => (
  <Link to={path} className="group cursor-pointer">
    <div className={`flex items-center rounded-xl px-3 py-2.5 gap-3 transition-all relative overflow-hidden ${
      active ? 'bg-[#0F52BA]/10' : 'hover:bg-gray-100'
    }`}>
      {active && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#0F52BA] rounded-r-full"></div>}
      <Icon className={`size-5 transition-colors ${
        active ? 'text-[#0F52BA]' : 'text-gray-500 group-hover:text-[#0F52BA]'
      }`} />
      <span className={`transition-colors ${
        active ? 'font-semibold text-[#0F52BA]' : 'font-medium text-gray-500 group-hover:text-gray-900'
      }`}>
        {label}
      </span>
    </div>
  </Link>
);

// Toast Notification
const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed bottom-4 right-4 ${type === 'success' ? 'bg-gray-900' : 'bg-red-500'} text-white px-5 py-3 rounded-xl z-[200] shadow-xl flex items-center gap-3 text-sm font-medium animate-in slide-in-from-bottom-4 duration-300`}>
      {type === 'success' ? <CheckCircle className="size-5" /> : <AlertTriangle className="size-5" />}
      {message}
    </div>
  );
};

// Stat Card
const StatCard = ({ icon: Icon, title, value, subtitle, iconBg = 'bg-[#0F52BA]/10', iconColor = 'text-[#0F52BA]', subtitleColor = 'text-gray-500' }) => (
  <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm flex flex-col gap-4 hover:shadow-md transition-shadow">
    <div className="flex items-center gap-3">
      <div className={`size-10 ${iconBg} rounded-xl flex items-center justify-center ${iconColor}`}>
        <Icon className="size-5" />
      </div>
      <p className="font-medium text-gray-500 text-sm">{title}</p>
    </div>
    <div className="flex items-end justify-between">
      <p className="font-bold text-3xl text-gray-900">{value}</p>
      {subtitle && (
        <span className={`text-xs font-medium ${subtitleColor}`}>
          {subtitle}
        </span>
      )}
    </div>
  </div>
);

// Course Table Row
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

// Action Button
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

// Form Modal
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
          {/* Course Name */}
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
          
          {/* Course ID & Category */}
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

          {/* Instructor */}
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

          {/* Status & Capacity */}
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

          {/* Actions */}
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

// Detail Modal
const DetailModal = ({ isOpen, onClose, onEdit, onDelete, itemId, itemsData }) => {
  if (!isOpen || !itemId || !itemsData[itemId]) return null;

  const data = itemsData[itemId];
  const statusClass = getStatusClasses(data.status);
  const statusLabel = getStatusLabel(data.status);
  const IconComponent = getIconComponent(data.icon || 'book');

  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        {/* Header */}
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
        
        {/* Content */}
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
        
        {/* Actions */}
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

// Delete Modal
const DeleteModal = ({ isOpen, onClose, onConfirm, isLoading = false }) => {
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
            disabled={isLoading}
            className="flex-1 py-2.5 rounded-xl font-medium text-gray-500 border border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm} 
            disabled={isLoading}
            className="flex-1 py-2.5 rounded-xl font-semibold bg-red-500 text-white hover:bg-red-500/90 transition-colors shadow-sm shadow-red-500/20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Deleting...
              </>
            ) : (
              'Delete'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// Search Modal
const SearchModal = ({ isOpen, onClose }) => {
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 z-[100] flex items-start justify-center pt-[10vh] p-4 backdrop-blur-sm" 
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 duration-200">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-3 bg-gray-100 rounded-xl px-4 border border-transparent focus-within:border-[#0F52BA] focus-within:bg-white transition-colors">
            <Search className="size-5 text-gray-500" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search courses, clients, or reports..."
              className="flex-1 py-3 bg-transparent outline-none text-sm"
            />
            <kbd className="hidden sm:inline-flex px-2 py-1 bg-white rounded-md text-[10px] font-semibold text-gray-500 border border-gray-200 shadow-sm">
              ESC
            </kbd>
          </div>
        </div>
        <div className="p-4 overflow-y-auto flex-1">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Quick Links</p>
          <div className="flex flex-col gap-1">
            <SearchLink 
              icon={Plus} 
              label="Add New Course" 
              description="Create a new training program"
              iconBg="bg-[#0F52BA]/10"
              iconColor="text-[#0F52BA]"
            />
            <SearchLink 
              icon={Users} 
              label="View Clients" 
              description="Manage client database"
              iconBg="bg-green-500/10"
              iconColor="text-green-500"
            />
            <SearchLink 
              icon={PieChart} 
              label="Sales Report" 
              description="View monthly performance"
              iconBg="bg-yellow-500/10"
              iconColor="text-yellow-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Search Link Item
const SearchLink = ({ icon: Icon, label, description, iconBg, iconColor }) => (
  <a href="#" className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 transition-all group">
    <div className={`size-10 ${iconBg} rounded-xl flex items-center justify-center group-hover:bg-[#0F52BA] group-hover:text-white transition-colors`}>
      <Icon className={`size-5 ${iconColor} group-hover:text-white`} />
    </div>
    <div className="flex-1 min-w-0">
      <p className="font-medium text-sm text-gray-900">{label}</p>
      <p className="text-xs text-gray-500">{description}</p>
    </div>
  </a>
);

// ============================================
// MAIN ADMIN LAYOUT
// ============================================
const AdminLayout = ({children}) => {
  const navigate = useNavigate();
  
  // States
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [itemsData, setItemsData] = useState(initialItemsData);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [toast, setToast] = useState(null);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [user, SetUser] = useState([]);

const fetchUser = async () => {
    try {
        const userCookie = Cookies.get('user');
        if (!userCookie) {
           
            return null;
        }
        
        // ✅ Parse JSON string ke object
        const userData = JSON.parse(userCookie);
        
        
        // Simpan ke state
        SetUser(userData);
       
        
        return userData;
    } catch (error) {
        console.error('Error parsing user data:', error);
        // Jika parsing gagal, tampilkan raw value
       
        return null;
    }
};

  // ============================================
  // EFFECTS
  // ============================================
  
  // Check authentication
  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      navigate('/admin/login', { replace: true });
    }
    fetchUser();
  }, [navigate]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchModalOpen(true);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // ============================================
  // HANDLERS
  // ============================================
  
  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
  }, []);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen(prev => !prev);
  }, []);

  // Filtered items dengan useMemo untuk performance
  const filteredItems = useMemo(() => {
    return Object.entries(itemsData).filter(([id, data]) => {
      const searchMatch = searchTerm === '' || 
        `${data.name} ${id}`.toLowerCase().includes(searchTerm.toLowerCase());
      const statusMatch = statusFilter === 'all' || data.status === statusFilter;
      const categoryMatch = categoryFilter === 'all' || data.category === categoryFilter;
      return searchMatch && statusMatch && categoryMatch;
    });
  }, [itemsData, searchTerm, statusFilter, categoryFilter]);

  // Stats dengan useMemo
  const stats = useMemo(() => {
    const total = Object.keys(itemsData).length;
    const available = Object.values(itemsData).filter(d => d.status === 'available').length;
    const upcoming = Object.values(itemsData).filter(d => d.status === 'upcoming').length;
    return { total, available, upcoming };
  }, [itemsData]);

  // CRUD Handlers
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
      showToast('Course updated successfully');
    } else {
      // Add new
      if (itemsData[formData.id]) {
        showToast('Course ID already exists', 'error');
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
      showToast('Course added successfully');
    }
    setFormModalOpen(false);
    setEditingId(null);
  }, [editingId, itemsData, showToast]);

  const handleDeleteCourse = useCallback(async () => {
    if (!deleteItemId) return;
    
    setIsDeleting(true);
    
    // Simulate async delete (replace with actual API call)
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setItemsData(prev => {
      const newData = { ...prev };
      delete newData[deleteItemId];
      return newData;
    });
    
    showToast('Course deleted successfully');
    setDeleteItemId(null);
    setIsDeleting(false);
    setDeleteModalOpen(false);
  }, [deleteItemId, showToast]);

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

  const filteredCount = filteredItems.length;

  return (
    <div className="font-sans bg-gray-100 min-h-screen flex overflow-hidden">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content */}
      <main className="flex-1 lg:ml-[280px] flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-[72px] bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 lg:px-8 shrink-0 z-30">
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleSidebar} 
              className="lg:hidden size-10 flex items-center justify-center rounded-xl border border-gray-200 hover:bg-gray-100 text-gray-500 transition-colors"
            >
              <Menu className="size-5" />
            </button>
            <div className="hidden sm:flex items-center gap-2 text-sm font-medium text-gray-500">
              {/* <span>Management</span>
              <ChevronRight className="size-4" />
              <span className="text-gray-900">Courses</span> */}
              {/* <h1 className='text-xl text-black'>SAIFUL TRAINING CONSULTING</h1> */}
            </div>
          </div>
          
          <div className="flex items-center gap-3 sm:gap-4">
            <button 
              onClick={() => setSearchModalOpen(true)} 
              className="size-10 flex items-center justify-center rounded-xl border border-gray-200 hover:bg-gray-100 text-gray-500 transition-colors" 
              title="Search (Ctrl+K)"
            >
              <Search className="size-5" />
            </button>
            <button 
              className="size-10 flex items-center justify-center rounded-xl border border-gray-200 hover:bg-gray-100 text-gray-500 transition-colors relative" 
              title="Notifications"
            >
              <Bell className="size-5" />
              <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full ring-2 ring-white"></span>
            </button>
            <div className="h-8 w-px bg-gray-200 hidden sm:block mx-1"></div>
            <button className="flex items-center gap-3 hover:bg-gray-100 p-1 pr-3 rounded-full transition-colors border border-transparent hover:border-gray-200">
              <img 
                src={user.photo ? user.photo : 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop'} 
                alt="Admin" 
                className="size-8 rounded-full object-cover ring-2 ring-white shadow-sm" 
              />
              <div className="hidden md:flex flex-col items-start text-left">
                <span className="text-sm font-semibold text-gray-900 leading-none">{user.name}</span>
                <span className="text-[11px] text-gray-500 mt-1">{user.email}</span>
              </div>
              <ChevronDown className="size-4 text-gray-500 hidden md:block ml-1" />
            </button>
          </div>
        </header>

        {/* Page Content */}
        {children}
      </main>

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
        isLoading={isDeleting}
      />

      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
      />

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default AdminLayout;