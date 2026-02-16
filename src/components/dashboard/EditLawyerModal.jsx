import { useState, useEffect } from 'react';
import { X, Upload, Loader } from 'lucide-react';
import { useEditLawyer } from '../../hooks/useEditLawyer';
import { COLLECTIONS } from '../../constants';


export const EditLawyerModal = ({ lawyer, collectionName, onClose, onSave, currentType }) => {
  const { updateLawyer, uploading, updating, error } = useEditLawyer();
  
  const [formData, setFormData] = useState({
    fullNameAr: '',
    fullNameFr: '',
    officeAdrAr: '',
    typeOfPractice: '',
    type: '',
    email: '',
    city: '',
    mobilePhone: '',
    landlinePhone: '',
    image: '',
    trainee: ''
  });

  const [newImageFile, setNewImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  const isUserOffice = currentType === COLLECTIONS.USERS;

  useEffect(() => {
    if (lawyer) {
      /* eslint-disable react-hooks/set-state-in-effect */
      setFormData({
        fullNameAr: lawyer.fullNameAr || '',
        fullNameFr: lawyer.fullNameFr || '',
        officeAdrAr: lawyer.officeAdrAr || '',
        typeOfPractice: lawyer.typeOfPractice || '',
        type: lawyer.type || '',
        email: lawyer.email || '',
        city: lawyer.city || '',
        mobilePhone: lawyer.mobilePhone || '',
        landlinePhone: lawyer.landlinePhone || '',
        image: lawyer.image || '',
        trainee: lawyer.trainee || ''
      });
      setImagePreview(lawyer.image || '');
    }
  }, [lawyer]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const result = await updateLawyer(lawyer.id, collectionName, formData, newImageFile);
      
      const updatedLawyer = {
        ...lawyer,
        ...formData,
        image: result.imageUrl || formData.image,
        registrationDate: lawyer.registrationDate  
      };
      
      onSave(updatedLawyer);   
    } catch (err) {
      console.error('Error saving lawyer:', err);
    }
  };

  return (
    <>
      {/* Overlay مع blur */}
      <div 
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div 
          className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="sticky top-0 bg-gradient-to-r from-[#134262] to-[#0d2f45] text-white px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
            <h2 className="text-2xl font-bold">تعديل بيانات المحامي</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Content scrollable */}
          <div className="p-6 overflow-y-auto flex-1">
            <form onSubmit={handleSubmit}>
              {error && (
                <div className="mb-4 p-4 bg-red-50 border-2 border-red-200 rounded-lg text-red-700">
                  {error}
                </div>
              )}

              <div className="mb-6">
                <label className="block text-lg font-bold text-slate-700 mb-3">
                  الصورة الشخصية
                </label>
                
                <div className="flex items-center gap-6">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-slate-200 bg-slate-100 flex items-center justify-center">
                    {imagePreview ? (
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-4xl text-slate-400">
                        {formData.fullNameAr?.charAt(0) || '؟'}
                      </span>
                    )}
                  </div>

                  <label className="cursor-pointer px-6 py-3 bg-[#CAAA5C] text-white rounded-lg hover:bg-[#b8954a] transition-colors flex items-center gap-2 font-medium">
                    <Upload size={20} />
                    <span>اختر صورة جديدة</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    الاسم الكامل (عربي) *
                  </label>
                  <input
                    type="text"
                    name="fullNameAr"
                    value={formData.fullNameAr}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-[#CAAA5C] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    الاسم الكامل (فرنسي)
                  </label>
                  <input
                    type="text"
                    name="fullNameFr"
                    value={formData.fullNameFr}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-[#CAAA5C] transition-colors"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    عنوان المكتب
                  </label>
                  <input
                    type="text"
                    name="officeAdrAr"
                    value={formData.officeAdrAr}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-[#CAAA5C] transition-colors"
                  />
                </div>

                {!isUserOffice && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      مكتب التمرين 
                    </label>
                    <input
                      type="text"
                      name="officeAdrAr"
                      value={formData.trainee}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-[#CAAA5C] transition-colors"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    المدينة *
                  </label>
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-[#CAAA5C] transition-colors cursor-pointer ${
                      formData.city === "" ? "text-gray-400" : "text-slate-700"
                    }`}
                  >
                    <option value="" disabled hidden>
                      اختر المدينة  
                    </option>
                    <option value="طنجة" className="text-slate-700">طنجة</option>
                    <option value="أصيلة" className="text-slate-700">أصيلة</option>
                    <option value="العرائش" className="text-slate-700">العرائش</option>
                    <option value="القصر الكبير" className="text-slate-700">القصر الكبير</option>
                  </select>
                </div>

                {isUserOffice && (
                  <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">
                        كيفية الممارسة *
                      </label>
                      <select
                        name="typeOfPractice"
                        value={formData.typeOfPractice}
                        onChange={handleInputChange}
                        required
                        className={`w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-[#CAAA5C] transition-colors cursor-pointer ${
                          formData.typeOfPractice === "" ? "text-gray-400" : "text-slate-700"
                        }`}
                      >
                        <option value="" disabled hidden>
                          اختر كيفية الممارسة
                        </option>
                        <option value="شريك في الشركة المدنية" className="text-slate-700">شريك في الشركة المدنية</option>
                        <option value="صاحب المكتب" className="text-slate-700">صاحب المكتب</option>
                        <option value="شريك" className="text-slate-700">شريك</option>
                        <option value="مساكن" className="text-slate-700">مساكن</option>
                        <option value="مساعد" className="text-slate-700">مساعد</option>
                      </select>
                  </div>
                )}

                {isUserOffice && (
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                        كيفية الممارسة (تفصيل)
                    </label>
                    <input
                      type="text"
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-[#CAAA5C] transition-colors"
                    />
                  </div>
                )}              

                <div> 
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    البريد الإلكتروني
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-[#CAAA5C] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    الهاتف المحمول
                  </label>
                  <input
                    type="tel"
                    name="mobilePhone"
                    value={formData.mobilePhone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-[#CAAA5C] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    الهاتف الثابت
                  </label>
                  <input
                    type="tel"
                    name="landlinePhone"
                    value={formData.landlinePhone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-[#CAAA5C] transition-colors"
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-4 mt-8 pt-6 border-t-2 border-slate-200">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={uploading || updating}
                  className="px-6 py-3 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-medium disabled:opacity-50"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={uploading || updating}
                  className="px-6 py-3 bg-gradient-to-r from-[#CAAA5C] to-[#b8954a] text-white rounded-lg hover:from-[#b8954a] hover:to-[#a68440] transition-all font-medium disabled:opacity-50 flex items-center gap-2"
                >
                  {(uploading || updating) && <Loader className="animate-spin" size={20} />}
                  <span>{uploading ? 'جاري رفع الصورة...' : updating ? 'جاري الحفظ...' : 'حفظ التعديلات'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};