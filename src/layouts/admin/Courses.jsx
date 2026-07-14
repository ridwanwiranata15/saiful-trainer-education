// AdminDashboard.jsx
import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import {
  Search, BookOpen, CheckCircle, CalendarClock, Users,
  ChevronLeft, Plus, Eye, Edit, Trash2, X,
  AlertTriangle, Loader2, Video, FileText, Image, Calendar
} from 'lucide-react';
import { Link } from 'react-router-dom'; // ✅ TAMBAHKAN IMPORT INI
import AdminLayout from './layouts';
import Api from '../../services/Api';
import Cookies from 'js-cookie';

// ============================================
// UTILITY FUNCTIONS
// ============================================
const getStatusClasses = (status) => {
  const classes = {
    available: 'bg-green-500/10 text-green-500 border-green-500/20',
    upcoming: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    missed: 'bg-red-500/10 text-red-500 border-red-500/20',
    completed: 'bg-gray-500/10 text-gray-500 border-gray-500/20' // fallback
  };
  return classes[status] || classes.completed;
};

const getStatusLabel = (status) => {
  const labels = {
    available: 'Available',
    upcoming: 'Upcoming',
    missed: 'Missed',
    completed: 'Completed'
  };
  return labels[status] || 'Unknown';
};

const formatDate = (dateString) => {
  if (!dateString) return 'TBD';
  try {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  } catch {
    return 'TBD';
  }
};

// ✅ Perbaiki: ambil nama file dari path URL
const getFileName = (path) => {
  if (!path) return null;
  if (typeof path === 'string') {
    return path.split('/').pop();
  }
  return null;
};

// Generate page numbers for pagination
const getPageNumbers = (currentPage, lastPage) => {
  const pages = [];
  const maxVisible = 5;

  if (lastPage <= maxVisible) {
    for (let i = 1; i <= lastPage; i++) {
      pages.push(i);
    }
  } else {
    if (currentPage <= 3) {
      for (let i = 1; i <= 4; i++) pages.push(i);
      pages.push('...');
      pages.push(lastPage);
    } else if (currentPage >= lastPage - 2) {
      pages.push(1);
      pages.push('...');
      for (let i = lastPage - 3; i <= lastPage; i++) pages.push(i);
    } else {
      pages.push(1);
      pages.push('...');
      for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
      pages.push('...');
      pages.push(lastPage);
    }
  }

  return pages;
};

// ============================================
// COMPONENTS
// ============================================

// Stat Card Component
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
        <p className="font-bold text-3xl text-gray-900">{value || 0}</p>
      )}
      {subtitle && !isLoading && (
        <span className={`text-xs font-medium ${subtitleColor}`}>
          {subtitle}
        </span>
      )}
    </div>
  </div>
);

// Skeleton Stat Card
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

// Loading Skeleton for Table Rows
const TableRowSkeleton = () => (
  <tr>
    <td className="p-4">
      <div className="flex items-center gap-3">
        <div className="size-10 rounded-lg bg-gray-200 animate-pulse"></div>
        <div className="flex-1">
          <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    </td>
    <td className="p-4 hidden lg:table-cell">
      <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
      <div className="h-3 w-16 bg-gray-200 rounded animate-pulse mt-1"></div>
    </td>
    <td className="p-4">
      <div className="h-6 w-20 bg-gray-200 rounded animate-pulse"></div>
    </td>
    <td className="p-4">
      <div className="flex justify-end gap-1">
        <div className="size-8 bg-gray-200 rounded-lg animate-pulse"></div>
        <div className="size-8 bg-gray-200 rounded-lg animate-pulse"></div>
        <div className="size-8 bg-gray-200 rounded-lg animate-pulse"></div>
      </div>
    </td>
  </tr>
);

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

// File Input Component
const FileInput = ({ label, id, accept, onChange, preview, icon: Icon, required = false, error }) => {
  const fileInputRef = useRef(null);

  const handleClear = (e) => {
    e.stopPropagation();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onChange({ target: { files: [] } });
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-900 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div
        onClick={() => fileInputRef.current?.click()}
        className={`relative w-full px-4 py-3 rounded-xl border-2 border-dashed transition-colors cursor-pointer bg-gray-50/50 hover:bg-gray-50 ${
          error ? 'border-red-500 hover:border-red-600' : 'border-gray-300 hover:border-[#0F52BA]'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          id={id}
          accept={accept}
          onChange={onChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div className="flex items-center gap-3">
          <div className={`size-10 rounded-lg flex items-center justify-center shrink-0 ${
            error ? 'bg-red-500/10' : 'bg-[#0F52BA]/10'
          }`}>
            <Icon className={`size-5 ${error ? 'text-red-500' : 'text-[#0F52BA]'}`} />
          </div>
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-medium ${error ? 'text-red-500' : 'text-gray-700'}`}>
              {preview ? (
                <span className={error ? 'text-red-500' : 'text-[#0F52BA]'}>{preview}</span>
              ) : (
                <span>Click to upload or drag and drop</span>
              )}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              {accept || 'All files accepted'}
            </p>
          </div>
          {preview && (
            <button
              type="button"
              onClick={handleClear}
              className="size-6 flex items-center justify-center rounded-full hover:bg-gray-200 text-gray-500"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
};

// Course Table Row Component
const CourseTableRow = ({ id, data, onView, onEdit, onDelete }) => {
  const statusClass = getStatusClasses(data.status);
  const statusLabel = getStatusLabel(data.status);

  return (
    <tr className="hover:bg-gray-50/30 transition-colors group">
      <td className="p-4">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-lg bg-[#0F52BA]/10 flex items-center justify-center shrink-0 overflow-hidden">
            {data.image ? (
              <img
                src={data.image instanceof File ? URL.createObjectURL(data.image) : data.image}
                alt={data.title}
                className="size-10 rounded-lg object-cover"
              />
            ) : (
              <Image className="size-5 text-[#0F52BA]" />
            )}
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-sm">{data.title}</p>
          </div>
        </div>
      </td>
      <td className="p-4 hidden lg:table-cell">
        <div className="text-sm">
          <p className="text-gray-900">{formatDate(data.date)}</p>
          <p className="text-xs text-gray-500">{data.time || 'TBD'}</p>
        </div>
      </td>
      <td className="p-4">
        <span className={`px-2.5 py-1 rounded-md text-xs font-semibold border ${statusClass}`}>
          {statusLabel}
        </span>
      </td>
      <td className="p-4 text-right">
        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Link to={`/admin/courses/${data.slug}`}>
            <ActionButton icon={Eye} label="View Details" />
          </Link>
          <ActionButton onClick={() => onEdit(id)} icon={Edit} label="Edit" />
          <ActionButton onClick={() => onDelete(id)} icon={Trash2} label="Delete" danger />
        </div>
      </td>
    </tr>
  );
};

// ============================================
// FORM MODAL COMPONENT
// ============================================
const FormModal = ({ isOpen, onClose, onSave, editingId, itemsData, isLoading }) => {
  const [formData, setFormData] = useState({
    title: '',
    image: null,
    date: '',
    time: '',
    description: '',
    video: null,
    material_path: null,
    whatsapp_link: '',
    zoom_link: '',
    status: 'upcoming'
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (editingId && itemsData[editingId]) {
        const data = itemsData[editingId];
        setFormData({
          title: data.title || '',
          image: data.image || null,
          date: data.date || '',
          time: data.time || '',
          description: data.description || '',
          video: data.video || null,
          material_path: data.material_path || null,
          whatsapp_link: data.whatsapp_link || '',
          zoom_link: data.zoom_link || '',
          status: data.status || 'upcoming'
        });
      } else {
        setFormData({
          title: '',
          image: null,
          date: '',
          time: '',
          description: '',
          video: null,
          material_path: null,
          whatsapp_link: '',
          zoom_link: '',
          status: 'upcoming'
        });
      }
      setErrors({});
    }
  }, [isOpen, editingId, itemsData]);

  const handleFileChange = (field, e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setErrors({ ...errors, [field]: 'File size must be less than 10MB' });
        return;
      }
      setFormData({ ...formData, [field]: file });
      setErrors({ ...errors, [field]: null });
    } else {
      setFormData({ ...formData, [field]: null });
    }
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: null });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }
    if (!formData.time) {
      newErrors.time = 'Time is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('date', formData.date);
      formDataToSend.append('time', formData.time);
      formDataToSend.append('description', formData.description || '');
      formDataToSend.append('whatsapp_link', formData.whatsapp_link || '');
      formDataToSend.append('zoom_link', formData.zoom_link || '');
      formDataToSend.append('status', formData.status);

      if (formData.image instanceof File) {
        formDataToSend.append('image', formData.image);
      }
      if (formData.video instanceof File) {
        formDataToSend.append('video', formData.video);
      }
      if (formData.material_path instanceof File) {
        formDataToSend.append('material_path', formData.material_path);
      }

      if (editingId) {
        formDataToSend.append('_method', 'PUT');
        await onSave(editingId, formDataToSend);
      } else {
        await onSave(null, formDataToSend);
      }

      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  // ✅ Tentukan preview nama file dengan benar (string URL atau File)
  const getPreviewName = (file) => {
    if (!file) return null;
    if (file instanceof File) return file.name;
    if (typeof file === 'string') return getFileName(file);
    return null;
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        <div className="p-5 border-b border-gray-200 flex items-center justify-between bg-gray-50">
          <h3 className="font-bold text-lg text-gray-900">
            {editingId ? 'Edit Course' : 'Add New Course'}
          </h3>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="size-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 cursor-pointer disabled:opacity-50"
          >
            <X className="size-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-900 mb-1.5">
                Course Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="e.g. Advanced Leadership"
                className={`w-full px-4 py-2.5 rounded-xl border ${
                  errors.title ? 'border-red-500' : 'border-gray-200'
                } focus:outline-none focus:ring-2 focus:ring-[#0F52BA]/20 focus:border-[#0F52BA] text-sm transition-all`}
                required
              />
              {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1.5">
                Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                className={`w-full px-4 py-2.5 rounded-xl border ${
                  errors.date ? 'border-red-500' : 'border-gray-200'
                } focus:outline-none focus:ring-2 focus:ring-[#0F52BA]/20 focus:border-[#0F52BA] text-sm transition-all`}
                required
              />
              {errors.date && <p className="text-xs text-red-500 mt-1">{errors.date}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1.5">
                Time <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => handleInputChange('time', e.target.value)}
                className={`w-full px-4 py-2.5 rounded-xl border ${
                  errors.time ? 'border-red-500' : 'border-gray-200'
                } focus:outline-none focus:ring-2 focus:ring-[#0F52BA]/20 focus:border-[#0F52BA] text-sm transition-all`}
                required
              />
              {errors.time && <p className="text-xs text-red-500 mt-1">{errors.time}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1.5">Status</label>
              <select
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0F52BA]/20 focus:border-[#0F52BA] text-sm bg-white transition-all"
              >
                <option value="available">Available</option>
                <option value="upcoming">Upcoming</option>
                <option value="missed">Missed</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-900 mb-1.5">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Course description"
                rows="3"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0F52BA]/20 focus:border-[#0F52BA] text-sm transition-all resize-none"
              />
            </div>

            <div className="md:col-span-2">
              <FileInput
                label="Course Image"
                id="image"
                accept="image/*"
                onChange={(e) => handleFileChange('image', e)}
                preview={getPreviewName(formData.image)}
                icon={Image}
                error={errors.image}
              />
            </div>

            <div className="md:col-span-2">
              <FileInput
                label="Video File"
                id="video"
                accept="video/*"
                onChange={(e) => handleFileChange('video', e)}
                preview={getPreviewName(formData.video)}
                icon={Video}
                error={errors.video}
              />
            </div>

            <div className="md:col-span-2">
              <FileInput
                label="Material File"
                id="material"
                accept=".pdf,.doc,.docx,.ppt,.pptx"
                onChange={(e) => handleFileChange('material_path', e)}
                preview={getPreviewName(formData.material_path)}
                icon={FileText}
                error={errors.material_path}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1.5">WhatsApp Link</label>
              <input
                type="url"
                value={formData.whatsapp_link}
                onChange={(e) => handleInputChange('whatsapp_link', e.target.value)}
                placeholder="https://wa.me/1234567890"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0F52BA]/20 focus:border-[#0F52BA] text-sm transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1.5">Zoom Link</label>
              <input
                type="url"
                value={formData.zoom_link}
                onChange={(e) => handleInputChange('zoom_link', e.target.value)}
                placeholder="https://zoom.us/j/123456789"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0F52BA]/20 focus:border-[#0F52BA] text-sm transition-all"
              />
            </div>
          </div>

          <div className="p-5 border-t border-gray-200 bg-gray-50 flex items-center justify-end gap-3 -mx-5 -mb-5 mt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl font-medium text-gray-500 hover:bg-gray-100 transition-colors cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl font-semibold bg-[#0F52BA] text-white hover:bg-[#0B3D8C] transition-colors shadow-sm shadow-[#0F52BA]/20 cursor-pointer disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting && <Loader2 className="size-4 animate-spin" />}
              {editingId ? 'Update Course' : 'Save Course'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ============================================
// DETAIL MODAL COMPONENT
// ============================================
const DetailModal = ({ isOpen, onClose, onEdit, onDelete, itemId, itemsData }) => {
  if (!isOpen || !itemId || !itemsData[itemId]) return null;

  const data = itemsData[itemId];
  const statusClass = getStatusClasses(data.status);
  const statusLabel = getStatusLabel(data.status);

  const renderFilePreview = (file, type) => {
    if (!file) return null;

    if (type === 'image') {
      const imageUrl = file instanceof File ? URL.createObjectURL(file) : file;
      return (
        <img
          src={imageUrl}
          alt={data.title}
          className="w-full max-h-48 rounded-lg object-cover"
        />
      );
    }

    if (type === 'video') {
      const videoUrl = file instanceof File ? URL.createObjectURL(file) : file;
      return (
        <video
          src={videoUrl}
          controls
          className="w-full max-h-48 rounded-lg"
        />
      );
    }

    if (type === 'material') {
      const fileName = file instanceof File ? file.name : getFileName(file);
      return (
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <FileText className="size-8 text-[#0F52BA]" />
          <div>
            <p className="font-medium text-sm text-gray-900">{fileName}</p>
            <p className="text-xs text-gray-500">Click to download</p>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-gray-200 flex items-start justify-between relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-[#0F52BA]"></div>
          <div className="flex gap-4 items-center z-10">
            <div className="size-14 rounded-xl bg-[#0F52BA]/10 flex items-center justify-center shrink-0 overflow-hidden">
              {data.image ? (
                <img
                  src={data.image instanceof File ? URL.createObjectURL(data.image) : data.image}
                  alt={data.title}
                  className="size-14 rounded-xl object-cover"
                />
              ) : (
                <Image className="size-7 text-[#0F52BA]" />
              )}
            </div>
            <div>
              <h3 className="font-bold text-xl text-gray-900">{data.title}</h3>
              <p className="text-sm text-gray-500 mt-1">{itemId}</p>
            </div>
          </div>
          <button onClick={onClose} className="size-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 cursor-pointer z-10">
            <X className="size-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Status</p>
              <span className={`px-2.5 py-1 rounded-md text-xs font-semibold border ${statusClass}`}>
                {statusLabel}
              </span>
            </div>

            <div className="col-span-1 md:col-span-2 h-px bg-gray-200"></div>

            <div className="col-span-1 md:col-span-2">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Schedule</p>
              <div className="bg-gray-50 rounded-xl p-3 border border-gray-200 flex items-center gap-3">
                <Calendar className="size-5 text-gray-500" />
                <div>
                  <p className="font-medium text-gray-900 text-sm">{formatDate(data.date)}</p>
                  <p className="text-sm text-gray-500">{data.time || 'TBD'}</p>
                </div>
              </div>
            </div>

            <div className="col-span-1 md:col-span-2 h-px bg-gray-200"></div>

            <div className="col-span-1 md:col-span-2">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Description</p>
              <p className="text-sm text-gray-700 bg-gray-50 rounded-xl p-3 border border-gray-200">
                {data.description || 'No description available'}
              </p>
            </div>

            {data.image && (
              <>
                <div className="col-span-1 md:col-span-2 h-px bg-gray-200"></div>
                <div className="col-span-1 md:col-span-2">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Course Image</p>
                  {renderFilePreview(data.image, 'image')}
                </div>
              </>
            )}

            {data.video && (
              <>
                <div className="col-span-1 md:col-span-2 h-px bg-gray-200"></div>
                <div className="col-span-1 md:col-span-2">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Video</p>
                  {renderFilePreview(data.video, 'video')}
                </div>
              </>
            )}

            {data.material_path && (
              <>
                <div className="col-span-1 md:col-span-2 h-px bg-gray-200"></div>
                <div className="col-span-1 md:col-span-2">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Material</p>
                  {renderFilePreview(data.material_path, 'material')}
                </div>
              </>
            )}

            {(data.whatsapp_link || data.zoom_link) && (
              <>
                <div className="col-span-1 md:col-span-2 h-px bg-gray-200"></div>
                <div className="col-span-1 md:col-span-2">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Links</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {data.whatsapp_link && (
                      <a
                        href={data.whatsapp_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-green-600 hover:underline bg-gray-50 p-2 rounded-lg"
                      >
                        <svg className="size-4" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                        WhatsApp Group
                      </a>
                    )}
                    {data.zoom_link && (
                      <a
                        href={data.zoom_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-blue-600 hover:underline bg-gray-50 p-2 rounded-lg"
                      >
                        <Link className="size-4" /> Zoom Meeting
                      </a>
                    )}
                  </div>
                </div>
              </>
            )}
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

// ============================================
// DELETE MODAL COMPONENT
// ============================================
const DeleteModal = ({ isOpen, onClose, onConfirm, isLoading }) => {
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
            className="flex-1 py-2.5 rounded-xl font-medium text-gray-500 border border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 py-2.5 rounded-xl font-semibold bg-red-500 text-white hover:bg-red-500/90 transition-colors shadow-sm shadow-red-500/20 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading && <Loader2 className="size-4 animate-spin" />}
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
const AdminCourse = () => {
  document.title = "Halaman kelas - Saiful training";

  const [itemsData, setItemsData] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [courses, setCourses] = useState(0);
  const [upcoming, setUpcoming] = useState(0);
  const [missed, setMissed] = useState(0);
  const [orders, setOrders] = useState(0);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [courseData, setCourseData] = useState({
    current_page: 1,
    data: [],
    from: 1,
    last_page: 1,
    per_page: 10,
    to: 0,
    total: 0
  });

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

      if (response.data && response.data.data) {
        const data = response.data.data;
        setCourses(data.courses || 0);
        setUpcoming(data.upcoming || 0);
        setMissed(data.missed || 0);
        setOrders(data.orders || 0);
      }

    } catch (error) {
      console.error('Error fetching dashboard:', error);
      showNotification('Failed to fetch dashboard data', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch courses
  const fetchCourses = useCallback(async (page = 1) => {
    try {
      setTableLoading(true);
      const token = Cookies.get('token');
      if (!token) return;

      const response = await Api.get(`/api/admin/courses?page=${page}`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data && response.data.data) {
        const responseData = response.data.data;

        setCourseData({
          current_page: responseData.current_page || 1,
          data: responseData.data || [],
          from: responseData.from || 1,
          last_page: responseData.last_page || 1,
          per_page: responseData.per_page || 10,
          to: responseData.to || 0,
          total: responseData.total || 0
        });

        const itemsObject = {};
        if (responseData.data && Array.isArray(responseData.data)) {
          responseData.data.forEach(item => {
            if (item.id) {
              itemsObject[item.id] = item;
            }
          });
        }
        setItemsData(itemsObject);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
      showNotification('Failed to fetch courses', 'error');
    } finally {
      setTableLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
    fetchCourses();
  }, [fetchDashboardData, fetchCourses]);

  // ============================================
  // NOTIFICATION
  // ============================================
  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 5000);
  };

  // ============================================
  // COMPUTED VALUES
  // ============================================
  const filteredItems = useMemo(() => {
    return Object.entries(itemsData).filter(([id, data]) => {
      const searchMatch = searchTerm === '' ||
        `${data.title} ${id}`.toLowerCase().includes(searchTerm.toLowerCase());
      const statusMatch = statusFilter === 'all' || data.status === statusFilter;
      return searchMatch && statusMatch;
    });
  }, [itemsData, searchTerm, statusFilter]);

  const filteredCount = filteredItems.length;

  const pageNumbers = useMemo(() => {
    return getPageNumbers(courseData.current_page, courseData.last_page);
  }, [courseData.current_page, courseData.last_page]);

  // ============================================
  // HANDLERS
  // ============================================

  const handleSaveCourse = useCallback(async (id, formData) => {
    try {
      setSubmitting(true);
      const token = Cookies.get('token');

      if (!token) {
        showNotification('Authentication required', 'error');
        return;
      }

      let response;
      if (id) {
        response = await Api.post(`/api/admin/courses/${id}`, formData, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        });
      } else {
        response = await Api.post('/api/admin/courses', formData, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        });
      }

      if (response.data && response.data.data) {
        const courseData = response.data.data;
        setItemsData(prev => ({
          ...prev,
          [courseData.id]: courseData
        }));
        showNotification(id ? 'Course updated successfully' : 'Course created successfully');
        setFormModalOpen(false);
        setEditingId(null);
        fetchCourses(courseData.current_page || 1);
      }
    } catch (error) {
      console.error('Error saving course:', error);
      if (error.response && error.response.data) {
        const errors = error.response.data.errors;
        if (errors) {
          const errorMessage = Object.values(errors).flat().join(', ');
          showNotification(errorMessage, 'error');
        } else {
          showNotification(error.response.data.message || 'Failed to save course', 'error');
        }
      } else {
        showNotification('Failed to save course', 'error');
      }
      throw error;
    } finally {
      setSubmitting(false);
    }
  }, [fetchCourses]);

  const handleDeleteCourse = useCallback(async () => {
    if (!deleteItemId) return;

    try {
      setDeleting(true);
      const token = Cookies.get('token');

      if (!token) {
        showNotification('Authentication required', 'error');
        return;
      }

      await Api.delete(`/api/admin/courses/${deleteItemId}`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`
        }
      });

      setItemsData(prev => {
        const newData = { ...prev };
        delete newData[deleteItemId];
        return newData;
      });

      showNotification('Course deleted successfully');
      setDeleteItemId(null);
      setDeleteModalOpen(false);
      fetchCourses(courseData.current_page);
    } catch (error) {
      console.error('Error deleting course:', error);
      showNotification('Failed to delete course', 'error');
    } finally {
      setDeleting(false);
    }
  }, [deleteItemId, fetchCourses, courseData.current_page]);

  const resetFilters = useCallback(() => {
    setSearchTerm('');
    setStatusFilter('all');
  }, []);

  const handlePageChange = useCallback(async (page) => {
    if (page === '...') return;
    if (page === courseData.current_page) return;
    await fetchCourses(page);
  }, [courseData.current_page, fetchCourses]);

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
        {/* Notification */}
        {notification.show && (
          <div className={`fixed top-4 right-4 z-[200] p-4 rounded-xl shadow-lg max-w-md animate-in slide-in-from-top-2 ${
            notification.type === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
          }`}>
            <p className="text-sm font-medium">{notification.message}</p>
          </div>
        )}

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Dashboard Management</h2>
            <p className="text-gray-500 text-sm mt-1">
              Manage training programs, schedules, and availability.
            </p>
          </div>
          <button
            onClick={openAddModal}
            className="px-5 py-2.5 rounded-xl font-semibold bg-[#0F52BA] text-white hover:bg-[#0B3D8C] transition-colors shadow-sm shadow-[#0F52BA]/20 flex items-center gap-2 cursor-pointer"
          >
            <Plus className="size-5" /> Add New Course
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {loading ? (
            <>
              <StatCardSkeleton icon={BookOpen} title="Total Courses" />
              <StatCardSkeleton icon={CheckCircle} title="Missed Courses" iconBg="bg-green-500/10" iconColor="text-green-500" />
              <StatCardSkeleton icon={CalendarClock} title="Upcoming Courses" iconBg="bg-yellow-500/10" iconColor="text-yellow-500" />
              <StatCardSkeleton icon={Users} title="Total Orders" />
            </>
          ) : (
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
        <div className="bg-white p-4 rounded-t-2xl border border-gray-200 border-b-0 flex flex-col md:flex-row gap-4 items-center justify-between">
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
              <option value="missed">Missed</option>  {/* ✅ Diperbaiki */}
            </select>
            {(searchTerm || statusFilter !== 'all') && (
              <button
                onClick={resetFilters}
                className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white border border-gray-200 rounded-b-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-left border-collapse">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="p-4 font-semibold text-xs text-gray-500 uppercase tracking-wider">
                    Course Details
                  </th>
                  <th className="p-4 font-semibold text-xs text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                    Schedule
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
                {tableLoading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <TableRowSkeleton key={`skeleton-${index}`} />
                  ))
                ) : filteredItems.length > 0 ? (
                  filteredItems.map(([id, data]) => (
                    <CourseTableRow
                      key={id}
                      id={id}
                      data={data}
                      onView={openDetailModal}
                      onEdit={openEditModal}
                      onDelete={openDeleteModal}
                    />
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="p-8 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <Search className="size-8 text-gray-400" />
                        <p className="text-gray-500">No courses found</p>
                        <button
                          onClick={resetFilters}
                          className="text-[#0F52BA] text-sm hover:underline"
                        >
                          Clear filters
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {!tableLoading && filteredItems.length > 0 && (
            <div className="p-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white">
              <p className="text-sm text-gray-500">
                Showing <span className="font-medium text-gray-900">{courseData.from || 1}</span> to{' '}
                <span className="font-medium text-gray-900">{courseData.to || filteredCount}</span> of{' '}
                <span className="font-medium text-gray-900">{courseData.total || Object.keys(itemsData).length}</span> entries
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handlePageChange(courseData.current_page - 1)}
                  disabled={courseData.current_page <= 1 || tableLoading}
                  className="size-8 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-100 disabled:opacity-50 cursor-pointer"
                >
                  <ChevronLeft className="size-4" />
                </button>

                {pageNumbers.map((page, index) => (
                  <button
                    key={index}
                    onClick={() => handlePageChange(page)}
                    disabled={page === '...' || tableLoading}
                    className={`size-8 flex items-center justify-center rounded-lg font-medium text-sm cursor-pointer transition-colors ${
                      page === courseData.current_page
                        ? 'bg-[#0F52BA] text-white shadow-sm shadow-[#0F52BA]/20'
                        : page === '...'
                        ? 'text-gray-500 cursor-default'
                        : 'border border-gray-200 hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(courseData.current_page + 1)}
                  disabled={courseData.current_page >= courseData.last_page || tableLoading}
                  className="size-8 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-100 disabled:opacity-50 cursor-pointer"
                >
                  <ChevronLeft className="size-4 rotate-180" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <FormModal
        isOpen={formModalOpen}
        onClose={() => { setFormModalOpen(false); setEditingId(null); }}
        onSave={handleSaveCourse}
        editingId={editingId}
        itemsData={itemsData}
        isLoading={submitting}
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
        isLoading={deleting}  
      />
    </AdminLayout>
  );
};

export default AdminCourse;