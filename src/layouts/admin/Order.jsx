// // AdminOrder.jsx
// import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
// import {
//   Search, BookOpen, CheckCircle, CalendarClock, Users,
//   ChevronLeft, Plus, Eye, Edit, Trash2, X,
//   AlertTriangle, Loader2, FileText, Image, FileCheck,
//   Check, // untuk approve
//   XCircle, // untuk reject
// } from 'lucide-react';
// import { Link } from 'react-router-dom';
// import AdminLayout from './layouts';
// import Api from '../../services/Api';
// import Cookies from 'js-cookie';

// // ============================================
// // UTILITY FUNCTIONS
// // ============================================
// const getPaymentOptionClasses = (option) => {
//   const classes = {
//     pay_now: 'bg-green-500/10 text-green-500 border-green-500/20',
//     pay_later: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
//     missed: 'bg-red-500/10 text-red-500 border-red-500/20',
//   };
//   return classes[option] || 'bg-gray-500/10 text-gray-500 border-gray-500/20';
// };

// const getPaymentOptionLabel = (option) => {
//   const labels = {
//     pay_now: 'Pay now',
//     pay_later: 'Pay later',
//     missed: 'Missed',
//   };
//   return labels[option] || option;
// };

// // ===== NEW: Status helper =====
// const getStatusClasses = (status) => {
//   const classes = {
//     pending: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
//     approved: 'bg-green-500/10 text-green-600 border-green-500/20',
//     rejected: 'bg-red-500/10 text-red-600 border-red-500/20',
//   };
//   return classes[status] || 'bg-gray-500/10 text-gray-500 border-gray-500/20';
// };

// const getStatusLabel = (status) => {
//   const labels = {
//     pending: 'Pending',
//     approved: 'Approved',
//     rejected: 'Rejected',
//   };
//   return labels[status] || status || 'Unknown';
// };

// const formatDate = (dateString) => {
//   if (!dateString) return 'TBD';
//   try {
//     const options = { year: 'numeric', month: 'short', day: 'numeric' };
//     return new Date(dateString).toLocaleDateString('en-US', options);
//   } catch {
//     return 'TBD';
//   }
// };

// const getFileName = (path) => {
//   if (!path) return null;
//   if (typeof path === 'string') {
//     return path.split('/').pop();
//   }
//   return null;
// };

// const getPageNumbers = (currentPage, lastPage) => {
//   const pages = [];
//   const maxVisible = 5;
//   if (lastPage <= maxVisible) {
//     for (let i = 1; i <= lastPage; i++) pages.push(i);
//   } else {
//     if (currentPage <= 3) {
//       for (let i = 1; i <= 4; i++) pages.push(i);
//       pages.push('...');
//       pages.push(lastPage);
//     } else if (currentPage >= lastPage - 2) {
//       pages.push(1);
//       pages.push('...');
//       for (let i = lastPage - 3; i <= lastPage; i++) pages.push(i);
//     } else {
//       pages.push(1);
//       pages.push('...');
//       for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
//       pages.push('...');
//       pages.push(lastPage);
//     }
//   }
//   return pages;
// };

// // ============================================
// // COMPONENTS
// // ============================================

// // Stat Card Component (tidak berubah)
// const StatCard = ({ icon: Icon, title, value, subtitle, isLoading = false, iconBg = 'bg-[#0F52BA]/10', iconColor = 'text-[#0F52BA]', subtitleColor = 'text-gray-500' }) => (
//   <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm flex flex-col gap-4 hover:shadow-md transition-shadow">
//     <div className="flex items-center gap-3">
//       <div className={`size-10 ${iconBg} rounded-xl flex items-center justify-center ${iconColor}`}>
//         <Icon className="size-5" />
//       </div>
//       <p className="font-medium text-gray-500 text-sm">{title}</p>
//     </div>
//     <div className="flex items-end justify-between">
//       {isLoading ? (
//         <div className="flex items-center gap-2">
//           <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
//           <Loader2 className="size-5 text-[#0F52BA] animate-spin" />
//         </div>
//       ) : (
//         <p className="font-bold text-3xl text-gray-900">{value || 0}</p>
//       )}
//       {subtitle && !isLoading && (
//         <span className={`text-xs font-medium ${subtitleColor}`}>
//           {subtitle}
//         </span>
//       )}
//     </div>
//   </div>
// );

// const StatCardSkeleton = ({ icon: Icon, title, iconBg = 'bg-[#0F52BA]/10', iconColor = 'text-[#0F52BA]' }) => (
//   <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm flex flex-col gap-4">
//     <div className="flex items-center gap-3">
//       <div className={`size-10 ${iconBg} rounded-xl flex items-center justify-center ${iconColor}`}>
//         <Icon className="size-5" />
//       </div>
//       <p className="font-medium text-gray-500 text-sm">{title}</p>
//     </div>
//     <div className="flex items-end justify-between">
//       <div className="flex items-center gap-2">
//         <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
//         <Loader2 className="size-5 text-[#0F52BA] animate-spin" />
//       </div>
//     </div>
//   </div>
// );

// const TableRowSkeleton = () => (
//   <tr>
//     <td className="p-4">
//       <div className="flex items-center gap-3">
//         <div className="size-10 rounded-lg bg-gray-200 animate-pulse"></div>
//         <div className="flex-1">
//           <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
//         </div>
//       </div>
//     </td>
//     <td className="p-4 hidden lg:table-cell">
//       <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
//     </td>
//     <td className="p-4">
//       <div className="h-6 w-20 bg-gray-200 rounded animate-pulse"></div>
//     </td>
//     <td className="p-4">
//       <div className="h-6 w-20 bg-gray-200 rounded animate-pulse"></div>
//     </td>
//     <td className="p-4">
//       <div className="flex justify-end gap-1">
//         <div className="size-8 bg-gray-200 rounded-lg animate-pulse"></div>
//         <div className="size-8 bg-gray-200 rounded-lg animate-pulse"></div>
//         <div className="size-8 bg-gray-200 rounded-lg animate-pulse"></div>
//       </div>
//     </td>
//   </tr>
// );

// const ActionButton = ({ onClick, icon: Icon, label, danger = false, disabled = false }) => (
//   <button
//     onClick={onClick}
//     disabled={disabled}
//     className={`size-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 transition-colors cursor-pointer ${danger ? 'hover:text-red-500 hover:bg-red-500/10' : 'hover:text-[#0F52BA]'
//       } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
//     title={label}
//   >
//     <Icon className="size-4" />
//   </button>
// );

// // ===== NEW: StatusActionButtons =====
// const StatusActionButtons = ({ status, onApprove, onReject, updating }) => {
//   if (status !== 'pending') return null;
//   return (
//     <div className="flex items-center gap-1">
//       <button
//         onClick={onApprove}
//         disabled={updating}
//         className="size-8 flex items-center justify-center rounded-lg bg-green-500/10 text-green-600 hover:bg-green-500/20 transition-colors cursor-pointer disabled:opacity-50"
//         title="Approve payment"
//       >
//         <Check className="size-4" />
//       </button>
//       <button
//         onClick={onReject}
//         disabled={updating}
//         className="size-8 flex items-center justify-center rounded-lg bg-red-500/10 text-red-600 hover:bg-red-500/20 transition-colors cursor-pointer disabled:opacity-50"
//         title="Reject payment"
//       >
//         <XCircle className="size-4" />
//       </button>
//     </div>
//   );
// };

// // File Input Component (tidak berubah)
// const FileInput = ({ label, id, accept, onChange, preview, icon: Icon, required = false, error }) => {
//   const fileInputRef = useRef(null);

//   const handleClear = (e) => {
//     e.stopPropagation();
//     if (fileInputRef.current) {
//       fileInputRef.current.value = '';
//     }
//     onChange({ target: { files: [] } });
//   };

//   return (
//     <div>
//       <label className="block text-sm font-medium text-gray-900 mb-1.5">
//         {label} {required && <span className="text-red-500">*</span>}
//       </label>
//       <div
//         onClick={() => fileInputRef.current?.click()}
//         className={`relative w-full px-4 py-3 rounded-xl border-2 border-dashed transition-colors cursor-pointer bg-gray-50/50 hover:bg-gray-50 ${error ? 'border-red-500 hover:border-red-600' : 'border-gray-300 hover:border-[#0F52BA]'
//           }`}
//       >
//         <input
//           ref={fileInputRef}
//           type="file"
//           id={id}
//           accept={accept}
//           onChange={onChange}
//           className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
//         />
//         <div className="flex items-center gap-3">
//           <div className={`size-10 rounded-lg flex items-center justify-center shrink-0 ${error ? 'bg-red-500/10' : 'bg-[#0F52BA]/10'
//             }`}>
//             <Icon className={`size-5 ${error ? 'text-red-500' : 'text-[#0F52BA]'}`} />
//           </div>
//           <div className="flex-1 min-w-0">
//             <p className={`text-sm font-medium ${error ? 'text-red-500' : 'text-gray-700'}`}>
//               {preview ? (
//                 <span className={error ? 'text-red-500' : 'text-[#0F52BA]'}>{preview}</span>
//               ) : (
//                 <span>Click to upload or drag and drop</span>
//               )}
//             </p>
//             <p className="text-xs text-gray-500 mt-0.5">
//               {accept || 'All files accepted'}
//             </p>
//           </div>
//           {preview && (
//             <button
//               type="button"
//               onClick={handleClear}
//               className="size-6 flex items-center justify-center rounded-full hover:bg-gray-200 text-gray-500"
//             >
//               <X className="size-4" />
//             </button>
//           )}
//         </div>
//       </div>
//       {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
//     </div>
//   );
// };

// // ===== UPDATED: OrderTableRow with Status =====
// const OrderTableRow = ({ id, data, onView, onEdit, onDelete, onApprove, onReject, updatingStatus }) => {
//   const paymentOptionClass = getPaymentOptionClasses(data.payment_option);
//   const paymentOptionLabel = getPaymentOptionLabel(data.payment_option);
//   const statusClass = getStatusClasses(data.status);
//   const statusLabel = getStatusLabel(data.status);

//   return (
//     <tr className="hover:bg-gray-50/30 transition-colors group">
//       <td className="p-4">
//         <div className="flex items-center gap-3">
//           <div className="size-10 rounded-lg bg-[#0F52BA]/10 flex items-center justify-center shrink-0 overflow-hidden">
//             <BookOpen className="size-5 text-[#0F52BA]" />
//           </div>
//           <div>
//             <p className="font-semibold text-gray-900 text-sm">{data.user?.name}</p>
//             <p className="text-xs text-gray-500">Course: {data.course?.title || 'N/A'}</p>
//           </div>
//         </div>
//       </td>
//       <td className="p-4 hidden lg:table-cell">
//         <div className="text-sm">
//           <p className="text-gray-900">User: {data.user?.name || 'N/A'}</p>
//           <p className="text-xs text-gray-500">Certificate: {data.is_certificate ? 'Yes' : 'No'}</p>
//         </div>
//       </td>
//       <td className="p-4">
//         <span className={`px-2.5 py-1 rounded-md text-xs font-semibold border ${paymentOptionClass}`}>
//           {paymentOptionLabel}
//         </span>
//       </td>
//       <td className="p-4">
//         <span className={`px-2.5 py-1 rounded-md text-xs font-semibold border ${statusClass}`}>
//           {statusLabel}
//         </span>
//       </td>
//       <td className="p-4 text-right">
//         <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-wrap">
//           {/* Status action buttons (only for pending) */}
//           <StatusActionButtons
//             status={data.status}
//             onApprove={() => onApprove(id)}
//             onReject={() => onReject(id)}
//             updating={updatingStatus === id}
//           />
//           <ActionButton onClick={() => onView(id)} icon={Eye} label="View Details" />
//           <ActionButton onClick={() => onEdit(id)} icon={Edit} label="Edit" />
//           <ActionButton onClick={() => onDelete(id)} icon={Trash2} label="Delete" danger />
//         </div>
//       </td>
//     </tr>
//   );
// };

// // FormModal (tidak berubah, bisa tambahkan field status jika diperlukan, tapi kita biarkan saja)
// const FormModal = ({ isOpen, onClose, onSave, editingId, itemsData, isLoading }) => {
//   const [formData, setFormData] = useState({
//     course_id: '',
//     user_id: '',
//     is_certificate: false,
//     payment_option: 'pay_later',
//     payment_proof_path: null,
//     certificate_file: null,
//   });
//   const [errors, setErrors] = useState({});
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   useEffect(() => {
//     if (isOpen) {
//       if (editingId && itemsData[editingId]) {
//         const data = itemsData[editingId];
//         setFormData({
//           course_id: data.course_id || '',
//           user_id: data.user_id || '',
//           is_certificate: data.is_certificate || false,
//           payment_option: data.payment_option || 'pay_later',
//           payment_proof_path: data.payment_proof_path || null,
//           certificate_file: data.certificate_file || null,
//         });
//       } else {
//         setFormData({
//           course_id: '',
//           user_id: '',
//           is_certificate: false,
//           payment_option: 'pay_later',
//           payment_proof_path: null,
//           certificate_file: null,
//         });
//       }
//       setErrors({});
//     }
//   }, [isOpen, editingId, itemsData]);

//   const handleFileChange = (field, e) => {
//     const file = e.target.files[0];
//     if (file) {
//       if (file.size > 10 * 1024 * 1024) {
//         setErrors({ ...errors, [field]: 'File size must be less than 10MB' });
//         return;
//       }
//       setFormData({ ...formData, [field]: file });
//       setErrors({ ...errors, [field]: null });
//     } else {
//       setFormData({ ...formData, [field]: null });
//     }
//   };

//   const handleInputChange = (field, value) => {
//     setFormData({ ...formData, [field]: value });
//     if (errors[field]) {
//       setErrors({ ...errors, [field]: null });
//     }
//   };

//   const validateForm = () => {
//     const newErrors = {};
//     if (!formData.course_id) newErrors.course_id = 'Course ID is required';
//     if (!formData.user_id) newErrors.user_id = 'User ID is required';
//     if (!formData.payment_option) newErrors.payment_option = 'Payment option is required';
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validateForm()) return;

//     setIsSubmitting(true);
//     try {
//       const formDataToSend = new FormData();
//       formDataToSend.append('course_id', formData.course_id);
//       formDataToSend.append('user_id', formData.user_id);
//       formDataToSend.append('is_certificate', formData.is_certificate ? '1' : '0');
//       formDataToSend.append('payment_option', formData.payment_option);

//       if (formData.payment_proof_path instanceof File) {
//         formDataToSend.append('payment_proof_path', formData.payment_proof_path);
//       }
//       if (formData.certificate_file instanceof File) {
//         formDataToSend.append('certificate_file', formData.certificate_file);
//       }

//       if (editingId) {
//         formDataToSend.append('_method', 'PUT');
//         await onSave(editingId, formDataToSend);
//       } else {
//         await onSave(null, formDataToSend);
//       }
//       onClose();
//     } catch (error) {
//       console.error('Error submitting form:', error);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   if (!isOpen) return null;

//   const getPreviewName = (file) => {
//     if (!file) return null;
//     if (file instanceof File) return file.name;
//     if (typeof file === 'string') return getFileName(file);
//     return null;
//   };

//   return (
//     <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
//       <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
//         <div className="p-5 border-b border-gray-200 flex items-center justify-between bg-gray-50">
//           <h3 className="font-bold text-lg text-gray-900">
//             {editingId ? 'Edit Order' : 'Add New Order'}
//           </h3>
//           <button
//             onClick={onClose}
//             disabled={isSubmitting}
//             className="size-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 cursor-pointer disabled:opacity-50"
//           >
//             <X className="size-5" />
//           </button>
//         </div>

//         <form onSubmit={handleSubmit} className="p-5 overflow-y-auto flex-1">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-900 mb-1.5">
//                 Course ID <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="text"
//                 value={formData.course_id}
//                 onChange={(e) => handleInputChange('course_id', e.target.value)}
//                 placeholder="e.g. 1"
//                 className={`w-full px-4 py-2.5 rounded-xl border ${errors.course_id ? 'border-red-500' : 'border-gray-200'
//                   } focus:outline-none focus:ring-2 focus:ring-[#0F52BA]/20 focus:border-[#0F52BA] text-sm transition-all`}
//                 required
//               />
//               {errors.course_id && <p className="text-xs text-red-500 mt-1">{errors.course_id}</p>}
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-900 mb-1.5">
//                 User ID <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="text"
//                 value={formData.user_id}
//                 onChange={(e) => handleInputChange('user_id', e.target.value)}
//                 placeholder="e.g. 5"
//                 className={`w-full px-4 py-2.5 rounded-xl border ${errors.user_id ? 'border-red-500' : 'border-gray-200'
//                   } focus:outline-none focus:ring-2 focus:ring-[#0F52BA]/20 focus:border-[#0F52BA] text-sm transition-all`}
//                 required
//               />
//               {errors.user_id && <p className="text-xs text-red-500 mt-1">{errors.user_id}</p>}
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-900 mb-1.5">Payment Option</label>
//               <select
//                 value={formData.payment_option}
//                 onChange={(e) => handleInputChange('payment_option', e.target.value)}
//                 className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0F52BA]/20 focus:border-[#0F52BA] text-sm bg-white transition-all"
//               >
//                 <option value="pay_now">Pay now</option>
//                 <option value="pay_later">Pay later</option>
//                 <option value="missed">Missed</option>
//               </select>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-900 mb-1.5">Has Certificate</label>
//               <div className="flex items-center gap-3 pt-2">
//                 <input
//                   type="checkbox"
//                   checked={formData.is_certificate}
//                   onChange={(e) => handleInputChange('is_certificate', e.target.checked)}
//                   className="size-5 rounded border-gray-300 text-[#0F52BA] focus:ring-[#0F52BA]/20"
//                 />
//                 <span className="text-sm text-gray-600">Yes, this order includes a certificate</span>
//               </div>
//             </div>
//             <div className="md:col-span-2">
//               <FileInput
//                 label="Payment Proof"
//                 id="payment_proof"
//                 accept="image/*,application/pdf"
//                 onChange={(e) => handleFileChange('payment_proof_path', e)}
//                 preview={getPreviewName(formData.payment_proof_path)}
//                 icon={Image}
//                 error={errors.payment_proof_path}
//               />
//             </div>
//             <div className="md:col-span-2">
//               <FileInput
//                 label="Certificate File"
//                 id="certificate"
//                 accept=".pdf,.doc,.docx"
//                 onChange={(e) => handleFileChange('certificate_file', e)}
//                 preview={getPreviewName(formData.certificate_file)}
//                 icon={FileCheck}
//                 error={errors.certificate_file}
//               />
//             </div>
//           </div>

//           <div className="p-5 border-t border-gray-200 bg-gray-50 flex items-center justify-end gap-3 -mx-5 -mb-5 mt-4">
//             <button
//               type="button"
//               onClick={onClose}
//               disabled={isSubmitting}
//               className="px-5 py-2.5 rounded-xl font-medium text-gray-500 hover:bg-gray-100 transition-colors cursor-pointer disabled:opacity-50"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               disabled={isSubmitting}
//               className="px-5 py-2.5 rounded-xl font-semibold bg-[#0F52BA] text-white hover:bg-[#0B3D8C] transition-colors shadow-sm shadow-[#0F52BA]/20 cursor-pointer disabled:opacity-50 flex items-center gap-2"
//             >
//               {isSubmitting && <Loader2 className="size-4 animate-spin" />}
//               {editingId ? 'Update Order' : 'Save Order'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// // DetailModal (tidak berubah, sudah menampilkan proof)
// const DetailModal = ({ isOpen, onClose, onEdit, onDelete, itemId, itemsData }) => {
//   if (!isOpen || !itemId || !itemsData[itemId]) return null;

//   const data = itemsData[itemId];
//   const paymentOptionClass = getPaymentOptionClasses(data.payment_option);
//   const paymentOptionLabel = getPaymentOptionLabel(data.payment_option);
//   const statusClass = getStatusClasses(data.status);
//   const statusLabel = getStatusLabel(data.status);

//   const renderFilePreview = (file, type) => {
//     if (!file) return null;
//     if (type === 'image') {
//       const imageUrl = file instanceof File ? URL.createObjectURL(file) : file;
//       return <img src={imageUrl} alt="Proof" className="w-full max-h-48 rounded-lg object-cover" />;
//     }
//     if (type === 'pdf') {
//       const fileName = file instanceof File ? file.name : getFileName(file);
//       return (
//         <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
//           <FileText className="size-8 text-[#0F52BA]" />
//           <div>
//             <p className="font-medium text-sm text-gray-900">{fileName}</p>
//             <p className="text-xs text-gray-500">Click to download</p>
//           </div>
//         </div>
//       );
//     }
//     return null;
//   };

//   return (
//     <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
//       <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
//         <div className="p-6 border-b border-gray-200 flex items-start justify-between relative overflow-hidden">
//           <div className="absolute top-0 left-0 w-full h-1 bg-[#0F52BA]"></div>
//           <div className="flex gap-4 items-center z-10">
//             <div className="size-14 rounded-xl bg-[#0F52BA]/10 flex items-center justify-center shrink-0">
//               <BookOpen className="size-7 text-[#0F52BA]" />
//             </div>
//             <div>
//               <h3 className="font-bold text-xl text-gray-900">{data.user?.name}</h3>
//               <p className="text-sm text-gray-500 mt-1">Course: {data.course?.title || 'N/A'}</p>
//             </div>
//           </div>
//           <button onClick={onClose} className="size-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 cursor-pointer z-10">
//             <X className="size-5" />
//           </button>
//         </div>

//         <div className="p-6 overflow-y-auto flex-1">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
//             <div>
//               <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Payment Option</p>
//               <span className={`px-2.5 py-1 rounded-md text-xs font-semibold border ${paymentOptionClass}`}>
//                 {paymentOptionLabel}
//               </span>
//             </div>
//             <div>
//               <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Status</p>
//               <span className={`px-2.5 py-1 rounded-md text-xs font-semibold border ${statusClass}`}>
//                 {statusLabel}
//               </span>
//             </div>
//             <div>
//               <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">User</p>
//               <p className="text-sm text-gray-700">{data.user?.name || 'N/A'}</p>
//             </div>
//             <div>
//               <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Certificate</p>
//               <p className="text-sm text-gray-700">{data.is_certificate ? 'Yes' : 'No'}</p>
//             </div>

//             {data.payment_proof_path && (
//               <>
//                 <div className="col-span-1 md:col-span-2 h-px bg-gray-200"></div>
//                 <div className="col-span-1 md:col-span-2">
//                   <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Payment Proof</p>
//                   {renderFilePreview(data.payment_proof_path, 'image')}
//                 </div>
//               </>
//             )}
//             {data.certificate_file && (
//               <>
//                 <div className="col-span-1 md:col-span-2 h-px bg-gray-200"></div>
//                 <div className="col-span-1 md:col-span-2">
//                   <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Certificate File</p>
//                   {renderFilePreview(data.certificate_file, 'pdf')}
//                 </div>
//               </>
//             )}
//           </div>
//         </div>

//         <div className="p-5 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
//           <button
//             onClick={() => { onDelete(itemId); onClose(); }}
//             className="px-4 py-2 rounded-xl font-medium text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer text-sm flex items-center gap-2"
//           >
//             <Trash2 className="size-4" /> Delete
//           </button>
//           <button
//             onClick={() => { onEdit(itemId); onClose(); }}
//             className="px-5 py-2.5 rounded-xl font-semibold bg-[#0F52BA] text-white hover:bg-[#0B3D8C] transition-colors shadow-sm shadow-[#0F52BA]/20 cursor-pointer text-sm flex items-center gap-2"
//           >
//             <Edit className="size-4" /> Edit Order
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// // DeleteModal (tidak berubah)
// const DeleteModal = ({ isOpen, onClose, onConfirm, isLoading }) => {
//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black/50 z-[110] flex items-center justify-center p-4 backdrop-blur-sm">
//       <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-6 text-center animate-in zoom-in-95 duration-200">
//         <div className="size-14 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
//           <AlertTriangle className="size-7 text-red-500" />
//         </div>
//         <h3 className="font-bold text-xl text-gray-900 mb-2">Delete Order?</h3>
//         <p className="text-gray-500 text-sm mb-6">
//           Are you sure you want to delete this order? This action cannot be undone.
//         </p>
//         <div className="flex items-center gap-3">
//           <button
//             onClick={onClose}
//             disabled={isLoading}
//             className="flex-1 py-2.5 rounded-xl font-medium text-gray-500 border border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer disabled:opacity-50"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={onConfirm}
//             disabled={isLoading}
//             className="flex-1 py-2.5 rounded-xl font-semibold bg-red-500 text-white hover:bg-red-500/90 transition-colors shadow-sm shadow-red-500/20 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
//           >
//             {isLoading && <Loader2 className="size-4 animate-spin" />}
//             Delete
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// // ============================================
// // MAIN DASHBOARD COMPONENT
// // ============================================
// const AdminOrder = () => {
//   document.title = "Order Management - Saiful training";

//   const [itemsData, setItemsData] = useState({});
//   const [searchTerm, setSearchTerm] = useState('');
//   const [paymentFilter, setPaymentFilter] = useState('all');
//   const [formModalOpen, setFormModalOpen] = useState(false);
//   const [editingId, setEditingId] = useState(null);
//   const [detailModalOpen, setDetailModalOpen] = useState(false);
//   const [selectedItemId, setSelectedItemId] = useState(null);
//   const [deleteModalOpen, setDeleteModalOpen] = useState(false);
//   const [deleteItemId, setDeleteItemId] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [tableLoading, setTableLoading] = useState(false);
//   const [submitting, setSubmitting] = useState(false);
//   const [deleting, setDeleting] = useState(false);
//   const [updatingStatus, setUpdatingStatus] = useState(null); // id yang sedang di-update

//   // Stats
//   const [totalOrders, setTotalOrders] = useState(0);
//   const [payNowCount, setPayNowCount] = useState(0);
//   const [payLaterCount, setPayLaterCount] = useState(0);
//   const [missedCount, setMissedCount] = useState(0);

//   const [notification, setNotification] = useState({ show: false, message: '', type: '' });
//   const [orderData, setOrderData] = useState({
//     current_page: 1,
//     data: [],
//     from: 1,
//     last_page: 1,
//     per_page: 10,
//     to: 0,
//     total: 0
//   });

//   // ============================================
//   // FETCH DASHBOARD DATA
//   // ============================================
//   const fetchDashboardData = useCallback(async () => {
//     try {
//       setLoading(true);
//       const token = Cookies.get('token');
//       if (!token) {
//         console.warn('No token found');
//         setLoading(false);
//         return;
//       }
//       const response = await Api.get('/api/admin/dashboard', {
//         headers: {
//           Accept: "application/json",
//           Authorization: `Bearer ${token}`
//         }
//       });
//       if (response.data && response.data.data) {
//         const data = response.data.data;
//         setTotalOrders(data.total_orders || 0);
//         setPayNowCount(data.pay_now || 0);
//         setPayLaterCount(data.pay_later || 0);
//         setMissedCount(data.missed || 0);
//       }
      
//     } catch (error) {
//       console.error('Error fetching dashboard:', error);
//       showNotification('Failed to fetch dashboard data', 'error');
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   // Fetch orders
//   const fetchOrders = useCallback(async (page = 1) => {
//     try {
//       setTableLoading(true);
//       const token = Cookies.get('token');
//       if (!token) return;

//       const response = await Api.get(`/api/admin/orders?page=${page}`, {
//         headers: {
//           Accept: "application/json",
//           Authorization: `Bearer ${token}`
//         }
//       });
      

//       if (response.data && response.data.data) {
//         const responseData = response.data.data;
//         setOrderData({
//           current_page: responseData.current_page || 1,
//           data: responseData.data || [],
//           from: responseData.from || 1,
//           last_page: responseData.last_page || 1,
//           per_page: responseData.per_page || 10,
//           to: responseData.to || 0,
//           total: responseData.total || 0
//         });

//         const itemsObject = {};
//         if (responseData.data && Array.isArray(responseData.data)) {
//           responseData.data.forEach(item => {
//             if (item.id) {
//               itemsObject[item.id] = item;
//             }
//           });
//         }
//         setItemsData(itemsObject);
//       }
//     } catch (error) {
//       console.error('Error fetching orders:', error);
//       showNotification('Failed to fetch orders', 'error');
//     } finally {
//       setTableLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchDashboardData();
//     fetchOrders();
//   }, [fetchDashboardData, fetchOrders]);

//   // ============================================
//   // NOTIFICATION
//   // ============================================
//   const showNotification = (message, type = 'success') => {
//     setNotification({ show: true, message, type });
//     setTimeout(() => {
//       setNotification({ show: false, message: '', type: '' });
//     }, 5000);
//   };

//   // ============================================
//   // COMPUTED VALUES
//   // ============================================
//   const filteredItems = useMemo(() => {
//     return Object.entries(itemsData).filter(([id, data]) => {
//       const searchMatch = searchTerm === '' ||
//         `${data.course_id} ${data.user_id} ${id}`.toLowerCase().includes(searchTerm.toLowerCase());
//       const paymentMatch = paymentFilter === 'all' || data.payment_option === paymentFilter;
//       return searchMatch && paymentMatch;
//     });
//   }, [itemsData, searchTerm, paymentFilter]);

//   const filteredCount = filteredItems.length;

//   const pageNumbers = useMemo(() => {
//     return getPageNumbers(orderData.current_page, orderData.last_page);
//   }, [orderData.current_page, orderData.last_page]);

//   // ============================================
//   // HANDLERS
//   // ============================================

//   const handleSaveOrder = useCallback(async (id, formData) => {
//     try {
//       setSubmitting(true);
//       const token = Cookies.get('token');
//       if (!token) {
//         showNotification('Authentication required', 'error');
//         return;
//       }

//       let response;
//       if (id) {
//         response = await Api.post(`/api/admin/orders/${id}`, formData, {
//           headers: {
//             Accept: "application/json",
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "multipart/form-data"
//           }
//         });
//       } else {
//         response = await Api.post('/api/admin/orders', formData, {
//           headers: {
//             Accept: "application/json",
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "multipart/form-data"
//           }
//         });
//       }

//       if (response.data && response.data.data) {
//         const order = response.data.data;
//         setItemsData(prev => ({
//           ...prev,
//           [order.id]: order
//         }));
//         showNotification(id ? 'Order updated successfully' : 'Order created successfully');
//         setFormModalOpen(false);
//         setEditingId(null);
//         fetchOrders(orderData.current_page || 1);
//         fetchDashboardData();
//       }
//     } catch (error) {
//       console.error('Error saving order:', error);
//       if (error.response && error.response.data) {
//         const errors = error.response.data.errors;
//         if (errors) {
//           const errorMessage = Object.values(errors).flat().join(', ');
//           showNotification(errorMessage, 'error');
//         } else {
//           showNotification(error.response.data.message || 'Failed to save order', 'error');
//         }
//       } else {
//         showNotification('Failed to save order', 'error');
//       }
//       throw error;
//     } finally {
//       setSubmitting(false);
//     }
//   }, [fetchOrders, fetchDashboardData, orderData.current_page]);

//   const handleDeleteOrder = useCallback(async () => {
//     if (!deleteItemId) return;

//     try {
//       setDeleting(true);
//       const token = Cookies.get('token');
//       if (!token) {
//         showNotification('Authentication required', 'error');
//         return;
//       }

//       await Api.delete(`/api/admin/orders/${deleteItemId}`, {
//         headers: {
//           Accept: "application/json",
//           Authorization: `Bearer ${token}`
//         }
//       });

//       setItemsData(prev => {
//         const newData = { ...prev };
//         delete newData[deleteItemId];
//         return newData;
//       });

//       showNotification('Order deleted successfully');
//       setDeleteItemId(null);
//       setDeleteModalOpen(false);
//       fetchOrders(orderData.current_page);
//     } catch (error) {
//       console.error('Error deleting order:', error);
//       showNotification('Failed to delete order', 'error');
//     } finally {
//       setDeleting(false);
//     }
//   }, [deleteItemId, fetchOrders, orderData.current_page]);

//   // ===== NEW: Status update handlers =====
//   const handleStatusUpdate = useCallback(async (id, newStatus) => {
//     try {
//       setUpdatingStatus(id);
//       const token = Cookies.get('token');
//       if (!token) {
//         showNotification('Authentication required', 'error');
//         return;
//       }

//       await Api.patch(`/api/admin/orders/${id}/status`, 
//         { status: newStatus },
//         {
//           headers: {
//             Accept: "application/json",
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json"
//           }
//         }
//       );

//       // Update local state
//       setItemsData(prev => ({
//         ...prev,
//         [id]: { ...prev[id], status: newStatus }
//       }));

//       showNotification(`Payment ${newStatus === 'approved' ? 'approved' : 'rejected'} successfully`);
//       // Refresh stats and order list
//       fetchDashboardData();
//       fetchOrders(orderData.current_page);
//     } catch (error) {
//       console.error('Error updating status:', error);
//       showNotification('Failed to update status', 'error');
//     } finally {
//       setUpdatingStatus(null);
//     }
//   }, [fetchDashboardData, fetchOrders, orderData.current_page]);

//   const resetFilters = useCallback(() => {
//     setSearchTerm('');
//     setPaymentFilter('all');
//   }, []);

//   const handlePageChange = useCallback(async (page) => {
//     if (page === '...') return;
//     if (page === orderData.current_page) return;
//     await fetchOrders(page);
//   }, [orderData.current_page, fetchOrders]);

//   const openAddModal = useCallback(() => {
//     setEditingId(null);
//     setFormModalOpen(true);
//   }, []);

//   const openEditModal = useCallback((id) => {
//     setEditingId(id);
//     setFormModalOpen(true);
//   }, []);

//   const openDetailModal = useCallback((id) => {
//     setSelectedItemId(id);
//     setDetailModalOpen(true);
//   }, []);

//   const openDeleteModal = useCallback((id) => {
//     setDeleteItemId(id);
//     setDeleteModalOpen(true);
//   }, []);

//   // ============================================
//   // RENDER
//   // ============================================
//   return (
//     <AdminLayout>
//       <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
//         {/* Notification */}
//         {notification.show && (
//           <div className={`fixed top-4 right-4 z-[200] p-4 rounded-xl shadow-lg max-w-md animate-in slide-in-from-top-2 ${notification.type === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
//             }`}>
//             <p className="text-sm font-medium">{notification.message}</p>
//           </div>
//         )}

//         {/* Page Header */}
//         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
//           <div>
//             <h2 className="text-2xl font-bold text-gray-900">Orders Management</h2>
//             <p className="text-gray-500 text-sm mt-1">
//               Manage user orders, payments, and certificates.
//             </p>
//           </div>
//           <button
//             onClick={openAddModal}
//             className="px-5 py-2.5 rounded-xl font-semibold bg-[#0F52BA] text-white hover:bg-[#0B3D8C] transition-colors shadow-sm shadow-[#0F52BA]/20 flex items-center gap-2 cursor-pointer"
//           >
//             <Plus className="size-5" /> Add New Order
//           </button>
//         </div>

//         {/* Stats Grid */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
//           {loading ? (
//             <>
//               <StatCardSkeleton icon={BookOpen} title="Total Orders" />
//               <StatCardSkeleton icon={CheckCircle} title="Pay Now" iconBg="bg-green-500/10" iconColor="text-green-500" />
//               <StatCardSkeleton icon={CalendarClock} title="Pay Later" iconBg="bg-yellow-500/10" iconColor="text-yellow-500" />
//               <StatCardSkeleton icon={AlertTriangle} title="Missed" iconBg="bg-red-500/10" iconColor="text-red-500" />
//             </>
//           ) : (
//             <>
//               <StatCard
//                 icon={BookOpen}
//                 title="Total Orders"
//                 value={totalOrders}
//                 subtitle="+12%"
//                 subtitleColor="text-green-500 bg-green-500/10 px-2 py-1 rounded-md"
//               />
//               <StatCard
//                 icon={CheckCircle}
//                 title="Pay Now"
//                 value={payNowCount}
//                 subtitle="Paid"
//                 iconBg="bg-green-500/10"
//                 iconColor="text-green-500"
//               />
//               <StatCard
//                 icon={CalendarClock}
//                 title="Pay Later"
//                 value={payLaterCount}
//                 subtitle="Pending"
//                 iconBg="bg-yellow-500/10"
//                 iconColor="text-yellow-500"
//               />
//               <StatCard
//                 icon={AlertTriangle}
//                 title="Missed"
//                 value={missedCount}
//                 subtitle="Expired"
//                 iconBg="bg-red-500/10"
//                 iconColor="text-red-500"
//               />
//             </>
//           )}
//         </div>

//         {/* Filters & Search */}
//         <div className="bg-white p-4 rounded-t-2xl border border-gray-200 border-b-0 flex flex-col md:flex-row gap-4 items-center justify-between">
//           <div className="relative w-full md:max-w-md">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-500" />
//             <input
//               type="text"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               placeholder="Search orders by course or user ID..."
//               className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F52BA]/20 focus:border-[#0F52BA] transition-all text-sm"
//             />
//           </div>
//           <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 scrollbar-hide">
//             <select
//               value={paymentFilter}
//               onChange={(e) => setPaymentFilter(e.target.value)}
//               className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0F52BA]/20 focus:border-[#0F52BA] text-sm font-medium min-w-[130px] cursor-pointer transition-all"
//             >
//               <option value="all">All Payment</option>
//               <option value="pay_now">Pay now</option>
//               <option value="pay_later">Pay later</option>
//               <option value="missed">Missed</option>
//             </select>
//             {(searchTerm || paymentFilter !== 'all') && (
//               <button
//                 onClick={resetFilters}
//                 className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
//               >
//                 Clear Filters
//               </button>
//             )}
//           </div>
//         </div>

//         {/* Data Table */}
//         <div className="bg-white border border-gray-200 rounded-b-2xl overflow-hidden shadow-sm">
//           <div className="overflow-x-auto">
//             <table className="w-full min-w-[900px] text-left border-collapse">
//               <thead className="bg-gray-50 border-b border-gray-200">
//                 <tr>
//                   <th className="p-4 font-semibold text-xs text-gray-500 uppercase tracking-wider">
//                     Order Details
//                   </th>
//                   <th className="p-4 font-semibold text-xs text-gray-500 uppercase tracking-wider hidden lg:table-cell">
//                     User / Certificate
//                   </th>
//                   <th className="p-4 font-semibold text-xs text-gray-500 uppercase tracking-wider">
//                     Payment Option
//                   </th>
//                   <th className="p-4 font-semibold text-xs text-gray-500 uppercase tracking-wider">
//                     Status
//                   </th>
//                   <th className="p-4 font-semibold text-xs text-gray-500 uppercase tracking-wider text-right">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-200">
//                 {tableLoading ? (
//                   Array.from({ length: 5 }).map((_, index) => (
//                     <TableRowSkeleton key={`skeleton-${index}`} />
//                   ))
//                 ) : filteredItems.length > 0 ? (
//                   filteredItems.map(([id, data]) => (
//                     <OrderTableRow
//                       key={id}
//                       id={id}
//                       data={data}
//                       onView={openDetailModal}
//                       onEdit={openEditModal}
//                       onDelete={openDeleteModal}
//                       onApprove={() => handleStatusUpdate(id, 'approved')}
//                       onReject={() => handleStatusUpdate(id, 'rejected')}
//                       updatingStatus={updatingStatus}
//                     />
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="5" className="p-8 text-center">
//                       <div className="flex flex-col items-center gap-2">
//                         <Search className="size-8 text-gray-400" />
//                         <p className="text-gray-500">No orders found</p>
//                         <button
//                           onClick={resetFilters}
//                           className="text-[#0F52BA] text-sm hover:underline"
//                         >
//                           Clear filters
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>

//           {!tableLoading && filteredItems.length > 0 && (
//             <div className="p-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white">
//               <p className="text-sm text-gray-500">
//                 Showing <span className="font-medium text-gray-900">{orderData.from || 1}</span> to{' '}
//                 <span className="font-medium text-gray-900">{orderData.to || filteredCount}</span> of{' '}
//                 <span className="font-medium text-gray-900">{orderData.total || Object.keys(itemsData).length}</span> entries
//               </p>
//               <div className="flex items-center gap-1">
//                 <button
//                   onClick={() => handlePageChange(orderData.current_page - 1)}
//                   disabled={orderData.current_page <= 1 || tableLoading}
//                   className="size-8 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-100 disabled:opacity-50 cursor-pointer"
//                 >
//                   <ChevronLeft className="size-4" />
//                 </button>

//                 {pageNumbers.map((page, index) => (
//                   <button
//                     key={index}
//                     onClick={() => handlePageChange(page)}
//                     disabled={page === '...' || tableLoading}
//                     className={`size-8 flex items-center justify-center rounded-lg font-medium text-sm cursor-pointer transition-colors ${page === orderData.current_page
//                         ? 'bg-[#0F52BA] text-white shadow-sm shadow-[#0F52BA]/20'
//                         : page === '...'
//                           ? 'text-gray-500 cursor-default'
//                           : 'border border-gray-200 hover:bg-gray-100 text-gray-700'
//                       }`}
//                   >
//                     {page}
//                   </button>
//                 ))}

//                 <button
//                   onClick={() => handlePageChange(orderData.current_page + 1)}
//                   disabled={orderData.current_page >= orderData.last_page || tableLoading}
//                   className="size-8 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-100 disabled:opacity-50 cursor-pointer"
//                 >
//                   <ChevronLeft className="size-4 rotate-180" />
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Modals */}
//       <FormModal
//         isOpen={formModalOpen}
//         onClose={() => { setFormModalOpen(false); setEditingId(null); }}
//         onSave={handleSaveOrder}
//         editingId={editingId}
//         itemsData={itemsData}
//         isLoading={submitting}
//       />

//       <DetailModal
//         isOpen={detailModalOpen}
//         onClose={() => { setDetailModalOpen(false); setSelectedItemId(null); }}
//         onEdit={openEditModal}
//         onDelete={openDeleteModal}
//         itemId={selectedItemId}
//         itemsData={itemsData}
//       />

//       <DeleteModal
//         isOpen={deleteModalOpen}
//         onClose={() => { setDeleteModalOpen(false); setDeleteItemId(null); }}
//         onConfirm={handleDeleteOrder}
//         isLoading={deleting}
//       />
//     </AdminLayout>
//   );
// };

// export default AdminOrder;

// AdminOrder.jsx
import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import {
  Search, BookOpen, CheckCircle, CalendarClock, Users,
  ChevronLeft, Plus, Eye, Edit, Trash2, X,
  AlertTriangle, Loader2, FileText, Image, FileCheck,
  Check, XCircle, Download
} from 'lucide-react';
import AdminLayout from './layouts';
import Api from '../../services/Api';
import Cookies from 'js-cookie';

// ============================================
// UTILITY FUNCTIONS
// ============================================

const getPaymentOptionClasses = (option) => {
  const classes = {
    pay_now: 'bg-green-500/10 text-green-500 border-green-500/20',
    pay_later: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    missed: 'bg-red-500/10 text-red-500 border-red-500/20',
  };
  return classes[option] || 'bg-gray-500/10 text-gray-500 border-gray-500/20';
};

const getPaymentOptionLabel = (option) => {
  const labels = {
    pay_now: 'Pay now',
    pay_later: 'Pay later',
    missed: 'Missed',
  };
  return labels[option] || option;
};

const getStatusClasses = (status) => {
  const classes = {
    pending: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
    approved: 'bg-green-500/10 text-green-600 border-green-500/20',
    rejected: 'bg-red-500/10 text-red-600 border-red-500/20',
  };
  return classes[status] || 'bg-gray-500/10 text-gray-500 border-gray-500/20';
};

const getStatusLabel = (status) => {
  const labels = {
    pending: 'Pending',
    approved: 'Approved',
    rejected: 'Rejected',
  };
  return labels[status] || status || 'Unknown';
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

const getFileName = (path) => {
  if (!path) return null;
  if (typeof path === 'string') {
    return path.split('/').pop();
  }
  return null;
};

const getPageNumbers = (currentPage, lastPage) => {
  const pages = [];
  const maxVisible = 5;
  if (lastPage <= maxVisible) {
    for (let i = 1; i <= lastPage; i++) pages.push(i);
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
// FILE UTILITY untuk Detail Modal
// ============================================
const getFileUrl = (path, baseUrl = 'http://127.0.0.1:8000') => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `${baseUrl}/storage/${path}`;
};

const getFileType = (path) => {
  if (!path) return 'unknown';
  const ext = path.split('.').pop().toLowerCase();
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'].includes(ext)) return 'image';
  if (['pdf'].includes(ext)) return 'pdf';
  return 'other';
};

// ============================================
// COMPONENTS
// ============================================

// Stat Card
const StatCard = ({ icon: Icon, title, value, subtitle, isLoading = false, iconBg = 'bg-[#0F52BA]/10', iconColor = 'text-[#0F52BA]', subtitleColor = 'text-gray-500' }) => (
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

// Skeleton Table Row
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
    </td>
    <td className="p-4">
      <div className="h-6 w-20 bg-gray-200 rounded animate-pulse"></div>
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
const ActionButton = ({ onClick, icon: Icon, label, danger = false, disabled = false }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`size-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 transition-colors cursor-pointer ${danger ? 'hover:text-red-500 hover:bg-red-500/10' : 'hover:text-[#0F52BA]'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    title={label}
  >
    <Icon className="size-4" />
  </button>
);

// Status Action Buttons (Approve / Reject)
const StatusActionButtons = ({ status, onApprove, onReject, updating }) => {
  if (status !== 'pending') return null;
  return (
    <div className="flex items-center gap-1">
      <button
        onClick={onApprove}
        disabled={updating}
        className="size-8 flex items-center justify-center rounded-lg bg-green-500/10 text-green-600 hover:bg-green-500/20 transition-colors cursor-pointer disabled:opacity-50"
        title="Approve payment"
      >
        <Check className="size-4" />
      </button>
      <button
        onClick={onReject}
        disabled={updating}
        className="size-8 flex items-center justify-center rounded-lg bg-red-500/10 text-red-600 hover:bg-red-500/20 transition-colors cursor-pointer disabled:opacity-50"
        title="Reject payment"
      >
        <XCircle className="size-4" />
      </button>
    </div>
  );
};

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
        className={`relative w-full px-4 py-3 rounded-xl border-2 border-dashed transition-colors cursor-pointer bg-gray-50/50 hover:bg-gray-50 ${error ? 'border-red-500 hover:border-red-600' : 'border-gray-300 hover:border-[#0F52BA]'
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
          <div className={`size-10 rounded-lg flex items-center justify-center shrink-0 ${error ? 'bg-red-500/10' : 'bg-[#0F52BA]/10'
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

// Order Table Row dengan Status
const OrderTableRow = ({ id, data, onView, onEdit, onDelete, onApprove, onReject, updatingStatus }) => {
  const paymentOptionClass = getPaymentOptionClasses(data.payment_option);
  const paymentOptionLabel = getPaymentOptionLabel(data.payment_option);
  const statusClass = getStatusClasses(data.status);
  const statusLabel = getStatusLabel(data.status);

  return (
    <tr className="hover:bg-gray-50/30 transition-colors group">
      <td className="p-4">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-lg bg-[#0F52BA]/10 flex items-center justify-center shrink-0 overflow-hidden">
            <BookOpen className="size-5 text-[#0F52BA]" />
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-sm">{data.user?.name || 'Unknown'}</p>
            <p className="text-xs text-gray-500">Course: {data.course?.title || 'N/A'}</p>
          </div>
        </div>
      </td>
      <td className="p-4 hidden lg:table-cell">
        <div className="text-sm">
          <p className="text-xs text-gray-500">Certificate: {data.is_certificate ? 'Yes' : 'No'}</p>
        </div>
      </td>
      <td className="p-4">
        <span className={`px-2.5 py-1 rounded-md text-xs font-semibold border ${paymentOptionClass}`}>
          {paymentOptionLabel}
        </span>
      </td>
      <td className="p-4">
        <span className={`px-2.5 py-1 rounded-md text-xs font-semibold border ${statusClass}`}>
          {statusLabel}
        </span>
      </td>
      <td className="p-4 text-right">
        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-wrap">
          <StatusActionButtons
            status={data.status}
            onApprove={() => onApprove(id)}
            onReject={() => onReject(id)}
            updating={updatingStatus === id}
          />
          <ActionButton onClick={() => onView(id)} icon={Eye} label="View Details" />
          <ActionButton onClick={() => onEdit(id)} icon={Edit} label="Edit" />
          <ActionButton onClick={() => onDelete(id)} icon={Trash2} label="Delete" danger />
        </div>
      </td>
    </tr>
  );
};

// ============================================
// FORM MODAL
// ============================================
const FormModal = ({ isOpen, onClose, onSave, editingId, itemsData, isLoading }) => {
  const [formData, setFormData] = useState({
    course_id: '',
    user_id: '',
    is_certificate: false,
    payment_option: 'pay_later',
    payment_proof_path: null,
    certificate_file: null,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (editingId && itemsData[editingId]) {
        const data = itemsData[editingId];
        setFormData({
          course_id: data.course_id || '',
          user_id: data.user_id || '',
          is_certificate: data.is_certificate || false,
          payment_option: data.payment_option || 'pay_later',
          payment_proof_path: data.payment_proof_path || null,
          certificate_file: data.certificate_file || null,
        });
      } else {
        setFormData({
          course_id: '',
          user_id: '',
          is_certificate: false,
          payment_option: 'pay_later',
          payment_proof_path: null,
          certificate_file: null,
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
    if (!formData.course_id) newErrors.course_id = 'Course ID is required';
    if (!formData.user_id) newErrors.user_id = 'User ID is required';
    if (!formData.payment_option) newErrors.payment_option = 'Payment option is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('course_id', formData.course_id);
      formDataToSend.append('user_id', formData.user_id);
      formDataToSend.append('is_certificate', formData.is_certificate ? '1' : '0');
      formDataToSend.append('payment_option', formData.payment_option);

      if (formData.payment_proof_path instanceof File) {
        formDataToSend.append('payment_proof_path', formData.payment_proof_path);
      }
      if (formData.certificate_file instanceof File) {
        formDataToSend.append('certificate_file', formData.certificate_file);
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
            {editingId ? 'Edit Order' : 'Add New Order'}
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
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1.5">
                Course ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.course_id}
                onChange={(e) => handleInputChange('course_id', e.target.value)}
                placeholder="e.g. 1"
                className={`w-full px-4 py-2.5 rounded-xl border ${errors.course_id ? 'border-red-500' : 'border-gray-200'
                  } focus:outline-none focus:ring-2 focus:ring-[#0F52BA]/20 focus:border-[#0F52BA] text-sm transition-all`}
                required
              />
              {errors.course_id && <p className="text-xs text-red-500 mt-1">{errors.course_id}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1.5">
                User ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.user_id}
                onChange={(e) => handleInputChange('user_id', e.target.value)}
                placeholder="e.g. 5"
                className={`w-full px-4 py-2.5 rounded-xl border ${errors.user_id ? 'border-red-500' : 'border-gray-200'
                  } focus:outline-none focus:ring-2 focus:ring-[#0F52BA]/20 focus:border-[#0F52BA] text-sm transition-all`}
                required
              />
              {errors.user_id && <p className="text-xs text-red-500 mt-1">{errors.user_id}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1.5">Payment Option</label>
              <select
                value={formData.payment_option}
                onChange={(e) => handleInputChange('payment_option', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0F52BA]/20 focus:border-[#0F52BA] text-sm bg-white transition-all"
              >
                <option value="pay_now">Pay now</option>
                <option value="pay_later">Pay later</option>
                <option value="missed">Missed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1.5">Has Certificate</label>
              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  checked={formData.is_certificate}
                  onChange={(e) => handleInputChange('is_certificate', e.target.checked)}
                  className="size-5 rounded border-gray-300 text-[#0F52BA] focus:ring-[#0F52BA]/20"
                />
                <span className="text-sm text-gray-600">Yes, this order includes a certificate</span>
              </div>
            </div>
            <div className="md:col-span-2">
              <FileInput
                label="Payment Proof"
                id="payment_proof"
                accept="image/*,application/pdf"
                onChange={(e) => handleFileChange('payment_proof_path', e)}
                preview={getPreviewName(formData.payment_proof_path)}
                icon={Image}
                error={errors.payment_proof_path}
              />
            </div>
            <div className="md:col-span-2">
              <FileInput
                label="Certificate File"
                id="certificate"
                accept=".pdf,.doc,.docx,image/*"
                onChange={(e) => handleFileChange('certificate_file', e)}
                preview={getPreviewName(formData.certificate_file)}
                icon={FileCheck}
                error={errors.certificate_file}
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
              {editingId ? 'Update Order' : 'Save Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ============================================
// DETAIL MODAL - LENGKAP DENGAN PREVIEW GAMBAR
// ============================================
const DetailModal = ({ isOpen, onClose, onEdit, onDelete, itemId, itemsData }) => {
  if (!isOpen || !itemId || !itemsData[itemId]) return null;

  const data = itemsData[itemId];
  const paymentOptionClass = getPaymentOptionClasses(data.payment_option);
  const paymentOptionLabel = getPaymentOptionLabel(data.payment_option);
  const statusClass = getStatusClasses(data.status);
  const statusLabel = getStatusLabel(data.status);

  const baseUrl = 'http://127.0.0.1:8000';

  // Render preview file
  const renderFilePreview = (filePath, label) => {
    if (!filePath) return <p className="text-sm text-gray-500">No file uploaded</p>;

    const url = getFileUrl(filePath, baseUrl);
    const fileType = getFileType(filePath);
    const fileName = getFileName(filePath);

    if (fileType === 'image') {
      return (
        <div className="mt-1">
          <img
            src={url}
            alt={label}
            className="max-w-full max-h-56 rounded-lg border border-gray-200 object-contain bg-gray-50"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextElementSibling?.classList.remove('hidden');
            }}
          />
          <div className="hidden text-sm text-red-500 mt-1">Failed to load image</div>
          <div className="flex gap-3 mt-2">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[#0F52BA] hover:underline flex items-center gap-1"
            >
              <Download className="size-3" /> Download
            </a>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[#0F52BA] hover:underline"
            >
              Open in new tab
            </a>
          </div>
        </div>
      );
    }

    // PDF atau file lainnya
    return (
      <div className="mt-1 flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
        <FileText className="size-8 text-[#0F52BA]" />
        <div>
          <p className="font-medium text-sm text-gray-900">{fileName}</p>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-[#0F52BA] hover:underline flex items-center gap-1"
          >
            <Download className="size-3" /> Download / View
          </a>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-gray-200 flex items-start justify-between relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-[#0F52BA]"></div>
          <div className="flex gap-4 items-center z-10">
            <div className="size-14 rounded-xl bg-[#0F52BA]/10 flex items-center justify-center shrink-0">
              <BookOpen className="size-7 text-[#0F52BA]" />
            </div>
            <div>
              <h3 className="font-bold text-xl text-gray-900">{data.user?.name || 'User'}</h3>
              <p className="text-sm text-gray-500 mt-1">Order #{data.id}</p>
            </div>
          </div>
          <button onClick={onClose} className="size-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 cursor-pointer z-10">
            <X className="size-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
            {/* Course ID */}
           
            {/* User ID */}
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">User</p>
              <p className="text-sm font-medium text-gray-900">{data?.user?.name || 'N/A'}</p>
            </div>
            {/* Course Title */}
            <div className="md:col-span-2">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Course Title</p>
              <p className="text-sm font-medium text-gray-900">{data.course?.title || 'N/A'}</p>
            </div>
            {/* Payment Option */}
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Payment Option</p>
              <span className={`px-2.5 py-1 rounded-md text-xs font-semibold border ${paymentOptionClass}`}>
                {paymentOptionLabel}
              </span>
            </div>
            {/* Status */}
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Status</p>
              <span className={`px-2.5 py-1 rounded-md text-xs font-semibold border ${statusClass}`}>
                {statusLabel}
              </span>
            </div>
            {/* Has Certificate */}
            <div>
             
              <p className="text-sm font-medium text-gray-900">{data.is_certificate ? '✅ Yes' : '❌ No'}</p>
            </div>
            {/* Created At (jika ada) */}
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Created At</p>
              <p className="text-sm font-medium text-gray-900">{formatDate(data.created_at)}</p>
            </div>

            {/* Payment Proof */}
            <div className="md:col-span-2">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Payment Proof</p>
              {
                renderFilePreview(
                  `orders/payments/${
                  data.payment_proof_path
                  }`, 'Payment Proof'
                )
              }
            </div>

            {/* Certificate File */}
            <div className="md:col-span-2">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Certificate File</p>
              {renderFilePreview(`orders/certificates/${data.certificate_file}`, 'Certificate File')}
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
          <div className="flex gap-2">
            {data.status === 'pending' && (
              <>
                <button
                  onClick={() => { onEdit(itemId); onClose(); }}
                  className="px-4 py-2 rounded-xl font-medium bg-green-500 text-white hover:bg-green-600 transition-colors text-sm flex items-center gap-2"
                >
                  <Check className="size-4" /> Approve
                </button>
                <button
                  onClick={() => { onEdit(itemId); onClose(); }}
                  className="px-4 py-2 rounded-xl font-medium bg-red-500 text-white hover:bg-red-600 transition-colors text-sm flex items-center gap-2"
                >
                  <XCircle className="size-4" /> Reject
                </button>
              </>
            )}
            <button
              onClick={() => { onEdit(itemId); onClose(); }}
              className="px-5 py-2.5 rounded-xl font-semibold bg-[#0F52BA] text-white hover:bg-[#0B3D8C] transition-colors shadow-sm shadow-[#0F52BA]/20 cursor-pointer text-sm flex items-center gap-2"
            >
              <Edit className="size-4" /> Edit Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// DELETE MODAL
// ============================================
const DeleteModal = ({ isOpen, onClose, onConfirm, isLoading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-[110] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-6 text-center animate-in zoom-in-95 duration-200">
        <div className="size-14 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="size-7 text-red-500" />
        </div>
        <h3 className="font-bold text-xl text-gray-900 mb-2">Delete Order?</h3>
        <p className="text-gray-500 text-sm mb-6">
          Are you sure you want to delete this order? This action cannot be undone.
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
// MAIN ADMIN ORDER COMPONENT
// ============================================
const AdminOrder = () => {
  document.title = "Order Management - Saiful training";

  const [itemsData, setItemsData] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('all');
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
  const [updatingStatus, setUpdatingStatus] = useState(null);

  // Stats
  const [totalOrders, setTotalOrders] = useState(0);
  const [payNowCount, setPayNowCount] = useState(0);
  const [payLaterCount, setPayLaterCount] = useState(0);
  const [missedCount, setMissedCount] = useState(0);
  const [rejeced, SetRejceted] = useState(0);
  const [pending, SetPending] = useState(0)

  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [orderData, setOrderData] = useState({
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
  const fetchDashboardData = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      const token = Cookies.get('token');
      if (!token) {
        console.warn('No token found');
        setLoading(false);
        return;
      }
      const response = await Api.get(`/api/admin/orders?page=${page}`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`
        }
      });
     
      if (response.data && response.data.data) {
        const data = response.data.data[1];
        setTotalOrders(data.approved || 0);
        setPayNowCount(data.pay_now || 0);
        setPayLaterCount(data.pay_later || 0);
        setMissedCount(data.missed || 0);
        //pending, rejected
        SetRejceted(data.rejeced || 0);
        SetPending(data.pending || 0);


      }
    } catch (error) {
      console.error('Error fetching dashboard:', error);
      showNotification('Failed to fetch dashboard data', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch orders
  const fetchOrders = useCallback(async (page = 1) => {
    try {
      setTableLoading(true);
      const token = Cookies.get('token');
      if (!token) return;

      const response = await Api.get(`/api/admin/orders?page=${page}`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`
        }
      });
      console.log(response);

      if (response.data && response.data.data) {
        const responseData = response.data.data[0];

        setOrderData({
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
      console.error('Error fetching orders:', error);
      showNotification('Failed to fetch orders', 'error');
    } finally {
      setTableLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
    fetchOrders();
  }, [fetchDashboardData, fetchOrders]);

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
        `${data.course_id} ${data.user_id} ${id} ${data.user?.name || ''} ${data.course?.title || ''}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      const paymentMatch = paymentFilter === 'all' || data.payment_option === paymentFilter;
      return searchMatch && paymentMatch;
    });
  }, [itemsData, searchTerm, paymentFilter]);

  const filteredCount = filteredItems.length;

  const pageNumbers = useMemo(() => {
    return getPageNumbers(orderData.current_page, orderData.last_page);
  }, [orderData.current_page, orderData.last_page]);

  // ============================================
  // HANDLERS
  // ============================================

  const handleSaveOrder = useCallback(async (id, formData) => {
    try {
      setSubmitting(true);
      const token = Cookies.get('token');
      if (!token) {
        showNotification('Authentication required', 'error');
        return;
      }

      let response;
      if (id) {
        response = await Api.post(`/api/admin/orders/${id}`, formData, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        });
      } else {
        response = await Api.post('/api/admin/orders', formData, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        });
      }

      if (response.data && response.data.data) {
        const order = response.data.data;
        setItemsData(prev => ({
          ...prev,
          [order.id]: order
        }));
        showNotification(id ? 'Order updated successfully' : 'Order created successfully');
        setFormModalOpen(false);
        setEditingId(null);
        fetchOrders(orderData.current_page || 1);
        fetchDashboardData();
      }
    } catch (error) {
      console.error('Error saving order:', error);
      if (error.response && error.response.data) {
        const errors = error.response.data.errors;
        if (errors) {
          const errorMessage = Object.values(errors).flat().join(', ');
          showNotification(errorMessage, 'error');
        } else {
          showNotification(error.response.data.message || 'Failed to save order', 'error');
        }
      } else {
        showNotification('Failed to save order', 'error');
      }
      throw error;
    } finally {
      setSubmitting(false);
    }
  }, [fetchOrders, fetchDashboardData, orderData.current_page]);

  const handleDeleteOrder = useCallback(async () => {
    if (!deleteItemId) return;

    try {
      setDeleting(true);
      const token = Cookies.get('token');
      if (!token) {
        showNotification('Authentication required', 'error');
        return;
      }

      await Api.delete(`/api/admin/orders/${deleteItemId}`, {
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

      showNotification('Order deleted successfully');
      setDeleteItemId(null);
      setDeleteModalOpen(false);
      fetchOrders(orderData.current_page);
    } catch (error) {
      console.error('Error deleting order:', error);
      showNotification('Failed to delete order', 'error');
    } finally {
      setDeleting(false);
    }
  }, [deleteItemId, fetchOrders, orderData.current_page]);

  // Status update handlers
  const handleStatusUpdate = useCallback(async (id, newStatus) => {
    try {
      setUpdatingStatus(id);
      const token = Cookies.get('token');
      if (!token) {
        showNotification('Authentication required', 'error');
        return;
      }

      await Api.patch(`/api/admin/orders/${id}`,
        { status: newStatus },
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      setItemsData(prev => ({
        ...prev,
        [id]: { ...prev[id], status: newStatus }
      }));

      showNotification(`Payment ${newStatus === 'approved' ? 'approved' : 'rejected'} successfully`);
      fetchDashboardData();
      fetchOrders(orderData.current_page);
    } catch (error) {
      console.error('Error updating status:', error.response);
      showNotification('Failed to update status', 'error');
    } finally {
      setUpdatingStatus(null);
    }
  }, [fetchDashboardData, fetchOrders, orderData.current_page]);

  const resetFilters = useCallback(() => {
    setSearchTerm('');
    setPaymentFilter('all');
  }, []);

  const handlePageChange = useCallback(async (page) => {
    if (page === '...') return;
    if (page === orderData.current_page) return;
    await fetchOrders(page);
  }, [orderData.current_page, fetchOrders]);

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
          <div className={`fixed top-4 right-4 z-[200] p-4 rounded-xl shadow-lg max-w-md animate-in slide-in-from-top-2 ${notification.type === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
            }`}>
            <p className="text-sm font-medium">{notification.message}</p>
          </div>
        )}

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Orders Management</h2>
            <p className="text-gray-500 text-sm mt-1">
              Manage user orders, payments, and certificates.
            </p>
          </div>
          {/* <button
            onClick={openAddModal}
            className="px-5 py-2.5 rounded-xl font-semibold bg-[#0F52BA] text-white hover:bg-[#0B3D8C] transition-colors shadow-sm shadow-[#0F52BA]/20 flex items-center gap-2 cursor-pointer"
          >
            <Plus className="size-5" /> Add New Order
          </button> */}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {loading ? (
            <>
              <StatCardSkeleton icon={BookOpen} title="Total Orders"  />
              <StatCardSkeleton icon={CheckCircle} title="Pay Now" iconBg="bg-green-500/10" iconColor="text-green-500" />
              <StatCardSkeleton icon={CalendarClock} title="Pay Later" iconBg="bg-yellow-500/10" iconColor="text-yellow-500" />
              <StatCardSkeleton icon={AlertTriangle} title="Missed" iconBg="bg-red-500/10" iconColor="text-red-500" />
            </>
          ) : (
            <>
              <StatCard
                icon={BookOpen}
                title="Total Orders"
                value={totalOrders}
                subtitle="+12%"
                subtitleColor="text-green-500 bg-green-500/10 px-2 py-1 rounded-md"
              />
              <StatCard
                icon={CheckCircle}
                title="Pay Now"
                value={payNowCount}
                subtitle="Paid"
                iconBg="bg-green-500/10"
                iconColor="text-green-500"
              />
              <StatCard
                icon={CalendarClock}
                title="Pay Later"
                value={payLaterCount}
                subtitle="Pending"
                iconBg="bg-yellow-500/10"
                iconColor="text-yellow-500"
              />
              <StatCard
                icon={AlertTriangle}
                title="Missed"
                value={missedCount}
                subtitle="Expired"
                iconBg="bg-red-500/10"
                iconColor="text-red-500"
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
              placeholder="Search by user, course, or ID..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F52BA]/20 focus:border-[#0F52BA] transition-all text-sm"
            />
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 scrollbar-hide">
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0F52BA]/20 focus:border-[#0F52BA] text-sm font-medium min-w-[130px] cursor-pointer transition-all"
            >
              <option value="all">All Payment</option>
              <option value="pay_now">Pay now</option>
              <option value="pay_later">Pay later</option>
              <option value="missed">Missed</option>
            </select>
            {(searchTerm || paymentFilter !== 'all') && (
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
            <table className="w-full min-w-[900px] text-left border-collapse">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="p-4 font-semibold text-xs text-gray-500 uppercase tracking-wider">
                    Order Details
                  </th>
                  <th className="p-4 font-semibold text-xs text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                     Certificate
                  </th>
                  <th className="p-4 font-semibold text-xs text-gray-500 uppercase tracking-wider">
                    Payment Option
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
                    <OrderTableRow
                      key={id}
                      id={id}
                      data={data}
                      onView={openDetailModal}
                      onEdit={openEditModal}
                      onDelete={openDeleteModal}
                      onApprove={() => handleStatusUpdate(id, 'approved')}
                      onReject={() => handleStatusUpdate(id, 'rejected')}
                      updatingStatus={updatingStatus}
                    />
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="p-8 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <Search className="size-8 text-gray-400" />
                        <p className="text-gray-500">No orders found</p>
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
                Showing <span className="font-medium text-gray-900">{orderData.from || 1}</span> to{' '}
                <span className="font-medium text-gray-900">{orderData.to || filteredCount}</span> of{' '}
                <span className="font-medium text-gray-900">{orderData.total || Object.keys(itemsData).length}</span> entries
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handlePageChange(orderData.current_page - 1)}
                  disabled={orderData.current_page <= 1 || tableLoading}
                  className="size-8 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-100 disabled:opacity-50 cursor-pointer"
                >
                  <ChevronLeft className="size-4" />
                </button>

                {pageNumbers.map((page, index) => (
                  <button
                    key={index}
                    onClick={() => handlePageChange(page)}
                    disabled={page === '...' || tableLoading}
                    className={`size-8 flex items-center justify-center rounded-lg font-medium text-sm cursor-pointer transition-colors ${page === orderData.current_page
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
                  onClick={() => handlePageChange(orderData.current_page + 1)}
                  disabled={orderData.current_page >= orderData.last_page || tableLoading}
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
        onSave={handleSaveOrder}
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
        onConfirm={handleDeleteOrder}
        isLoading={deleting}
      />
    </AdminLayout>
  );
};

export default AdminOrder;