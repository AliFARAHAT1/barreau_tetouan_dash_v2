import { Edit2, Trash2, Search, Filter, X, Calendar, RotateCcw } from "lucide-react";
import { useState } from "react";
import { COLLECTIONS } from "../../constants";
import { EditLawyerModal } from './EditLawyerModal';
import { useDeleteLawyer } from '../../hooks/useDeleteLawyer';


export const LawyersTable = ({
  lawyers,
  loading,
  currentType,
  onTypeChange,
  totalCount,
  filterPercentage,
  searchTerm,
  onSearchChange,
  startDate,
  endDate,
  onDateChange,
  selectedCity,
  onCityChange,
  selectedGender,
  onGenderChange,
  selectedTypeOfPractice,
  onTypeOfPracticeChange,
  hasActiveFilters,
  onResetAll,
  onLawyerUpdate,
  onLawyerDelete
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [showBirthdateFilters, setShowBirthdateFilters] = useState(false);
  const [birthdateStart, setBirthdateStart] = useState("");
  const [birthdateEnd, setBirthdateEnd] = useState("");
  const [selectedLawyer, setSelectedLawyer] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [lawyerToDelete, setLawyerToDelete] = useState(null);
  const { deleteLawyer, deleting } = useDeleteLawyer();

  const handleEdit = (lawyer) => {
    setSelectedLawyer(lawyer);
    setShowEditModal(true);
  };

  const handleDelete = (lawyer) => {
    setLawyerToDelete(lawyer);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!lawyerToDelete) return;
    try {
      await deleteLawyer(lawyerToDelete.id, currentType);
      onLawyerDelete(lawyerToDelete.id);
      setShowDeleteConfirm(false);
      setLawyerToDelete(null);
    } catch (err) {
      console.error('Error deleting lawyer:', err);
    }
  };

  const handleSaveEdit = (updatedLawyer) => {
    onLawyerUpdate(updatedLawyer);
    setShowEditModal(false);
    setSelectedLawyer(null);
  };

  const isUserOffice = currentType === COLLECTIONS.USERS;
  const hasDateFilters = startDate || endDate;
  const hasBirthdateFilters = birthdateStart || birthdateEnd;

  return (
    <div className="bg-white rounded-2xl shadow-lg">
      <div className="border-b border-slate-200 py-4 p-6">
        <div className="flex items-center justify-between gap-6">
          <div className="flex gap-2">
            <button
              onClick={() => onTypeChange(COLLECTIONS.USERS)}
              className={`px-6 py-3 font-bold rounded-lg transition-colors ${isUserOffice
                  ? "bg-[#0969b3] text-white shadow-md"
                  : "text-[#0969b3] hover:bg-slate-50"
                }`}
            >
              المحامين الرسميين
            </button>
            <button
              onClick={() => onTypeChange(COLLECTIONS.USERS_TRAINEE)}
              className={`px-6 py-3 font-bold rounded-lg transition-colors ${!isUserOffice
                  ? "bg-[#0969b3] text-white shadow-md"
                  : "text-[#0969b3] hover:bg-slate-50"
                }`}
            >
              المحامين المتمرنين
            </button>
          </div>

          <div className="text-center">
            <div className="text-base text-black mb-1">المجموع</div>
            <div className="text-3xl font-bold text-[#0969b3]">
              {totalCount}
            </div>
            {/* {filterPercentage < 100 && (
              <div className="text-sm text-[#CAAA5C] font-bold mt-1">
                {filterPercentage}% من المجموع
              </div>
            )} */}
          </div>

          {/* START Filter محامي/محامية */}
          {/* <div className="relative mb-5">
            <div className="text-base font-bold text-slate-500">الجنس:</div>
            <select
              value={selectedGender}
              onChange={(e) => onGenderChange(e.target.value)}
              className={`px-4 py-3 rounded-lg font-medium transition-all cursor-pointer ${selectedGender !== "الكل"
                  ? "bg-[#CAAA5C] text-white border-[#CAAA5C] shadow-md"
                  : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
            >
              <option value="الكل">الكل</option>
              <option value="محامية">محامية</option>
              <option value="محام">محام</option>
            </select>
          </div> */}
          {/* END Filter محامي/محامية */}

          {/* START Filter المدن */}
          {/* <div className="relative mb-5">
            <div className="text-base font-bold text-slate-500">المدينة:</div>
            <select
              value={selectedCity}
              onChange={(e) => onCityChange(e.target.value)}
              className={`px-4 py-3 rounded-lg font-medium transition-all cursor-pointer ${selectedCity !== "الكل"
                  ? "bg-[#CAAA5C] text-white border-[#CAAA5C] shadow-md"
                  : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
            >
              <option value="الكل">الكل</option>
              <option value="تطوان">تطوان</option>
              <option value="أصيلة">أصيلة</option>
              <option value="العرائش">العرائش</option>
              <option value="القصر الكبير">القصر الكبير</option>
            </select>
          </div> */}
          {/* END Filter المدن */}

          {/* START Filter كيفية الممارسة */}
          {/* <div className="relative mb-5">
            <div className="text-base font-bold text-slate-500">
              كيفية الممارسة:
            </div>
            <select
              value={selectedTypeOfPractice}
              onChange={(e) => onTypeOfPracticeChange(e.target.value)}
              className={`px-4 py-3 rounded-lg font-medium transition-all cursor-pointer ${selectedTypeOfPractice !== "الكل"
                  ? "bg-[#CAAA5C] text-white border-[#CAAA5C] shadow-md"
                  : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
            >
              <option value="الكل">الكل</option>
              <option value="شريك في الشركة المدنية">شريك في الشركة المدنية</option>
              <option value="صاحب المكتب">صاحب المكتب</option>
              <option value="شريك">شريك</option>
              <option value="مساكن">مساكن</option>
              <option value="مساعد">مساعد</option>
            </select>
          </div> */}
          {/* END Filter كيفية الممارسة */}

          {/* START Filter تاريخ التسجيل */}

          {/* <div className="relative">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${hasDateFilters
                  ? "bg-[#CAAA5C] text-white shadow-md"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
            >
              <Filter size={20} />
              <span>تاريخ التسجيل</span>
              {hasDateFilters && (
                <span className="w-2 h-2 bg-white rounded-full"></span>
              )}
            </button>

            {showFilters && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowFilters(false)}
                ></div>

                <div className="absolute left-0 top-full mt-2 w-96 bg-white rounded-xl shadow-2xl border-2 border-slate-200 p-6 z-50">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-[#134262] flex items-center gap-2">
                      <Filter size={20} />
                      تاريخ التسجيل
                    </h3>
                    <button
                      onClick={() => setShowFilters(false)}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                        <Calendar size={16} className="text-[#CAAA5C]" />
                        تاريخ التسجيل
                      </label>

                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs text-slate-500 mb-1">
                            من
                          </label>
                          <input
                            type="date"
                            value={startDate}
                            onChange={(e) =>
                              onDateChange("start", e.target.value)
                            }
                            className="w-full px-3 py-2 bg-slate-50 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-[#CAAA5C] transition-colors text-sm"
                          />
                        </div>

                        <div>
                          <label className="block text-xs text-slate-500 mb-1">
                            إلى
                          </label>
                          <input
                            type="date"
                            value={endDate}
                            onChange={(e) =>
                              onDateChange("end", e.target.value)
                            }
                            className="w-full px-3 py-2 bg-slate-50 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-[#CAAA5C] transition-colors text-sm"
                          />
                        </div>
                      </div>
                    </div>

                    {hasDateFilters && (
                      <button
                        onClick={() => {
                          onDateChange("reset", "");
                          setShowFilters(false);
                        }}
                        className="w-full px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium text-sm"
                      >
                        مسح جميع الفلاتر
                      </button>
                    )}

                    <button
                      onClick={() => {
                        onDateChange("apply", "");
                        setShowFilters(false);
                      }}
                      className="w-full px-4 py-2 bg-[#CAAA5C] text-white rounded-lg hover:bg-[#b8954a] transition-colors font-medium"
                    >
                      تطبيق
                    </button>
                  </div>
                </div>
              </>
            )}
          </div> */}

          {/* END Filter تاريخ التسجيل */}

          {/* START Filter تاريخ الإزدياد */}
          {/* <div className="relative">
            <button
              onClick={() => setShowBirthdateFilters(!showBirthdateFilters)}
              className={`px-4 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${hasBirthdateFilters
                  ? "bg-[#CAAA5C] text-white shadow-md"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
            >
              <Filter size={20} />
              <span>تاريخ الإزدياد</span>
              {hasBirthdateFilters && (
                <span className="w-2 h-2 bg-white rounded-full"></span>
              )}
            </button>

            {showBirthdateFilters && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowBirthdateFilters(false)}
                ></div>

                <div className="absolute left-0 top-full mt-2 w-96 bg-white rounded-xl shadow-2xl border-2 border-slate-200 p-6 z-50">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-[#134262] flex items-center gap-2">
                      <Filter size={20} />
                      تاريخ الإزدياد
                    </h3>
                    <button
                      onClick={() => setShowBirthdateFilters(false)}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                        <Calendar size={16} className="text-[#CAAA5C]" />
                        تاريخ الإزدياد
                      </label>

                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs text-slate-500 mb-1">
                            من
                          </label>
                          <input
                            type="date"
                            value={birthdateStart}
                            onChange={(e) => setBirthdateStart(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-50 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-[#CAAA5C] transition-colors text-sm"
                          />
                        </div>

                        <div>
                          <label className="block text-xs text-slate-500 mb-1">
                            إلى
                          </label>
                          <input
                            type="date"
                            value={birthdateEnd}
                            onChange={(e) => setBirthdateEnd(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-50 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-[#CAAA5C] transition-colors text-sm"
                          />
                        </div>
                      </div>
                    </div>

                    {hasBirthdateFilters && (
                      <button
                        onClick={() => {
                          setBirthdateStart("");
                          setBirthdateEnd("");
                          setShowBirthdateFilters(false);
                        }}
                        className="w-full px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium text-sm"
                      >
                        مسح جميع الفلاتر
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setShowBirthdateFilters(false);
                      }}
                      className="w-full px-4 py-2 bg-[#CAAA5C] text-white rounded-lg hover:bg-[#b8954a] transition-colors font-medium"
                    >
                      تطبيق
                    </button>
                  </div>
                </div>
              </>
            )}
          </div> */}
          {/* END Filter تاريخ الإزدياد */}

          {/* START Search & Reset */}
          <div className="relative flex-1 max-w-md flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="البحث بالاسم..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full px-5 py-3 pr-12 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-[#CAAA5C] transition-colors"
              />
              <Search
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400"
                size={20}
              />
            </div>

            {hasActiveFilters && (
              <button
                onClick={onResetAll}
                className="px-4 py-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all flex items-center gap-2 font-medium border-2 border-red-200 hover:border-red-300"
                title="إعادة تعيين جميع الفلاتر"
              >
                <RotateCcw size={20} />
                <span>إعادة تعيين</span>
              </button>
            )}
          </div>
          {/* END Search & Reset */}
        </div>
      </div>

      <div className="overflow-x-auto">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-[#CAAA5C] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : lawyers.length === 0 ? (
          <div className="text-center py-20 text-slate-500">لا توجد بيانات</div>
        ) : (
          <table className="w-full">
            <thead className="bg-[#0969b3] text-white">
              <tr>
                <th className="px-6 py-3 text-center font-bold">الصورة</th>
                {isUserOffice && (
                  <th className="px-6 py-3 text-center font-bold">
                    الرقم المهني
                  </th>
                )}
                <th className="px-6 py-3 text-center font-bold">الاسم بالعربية</th>
                <th className="px-6 py-3 text-center font-bold">الاسم بالفرنسية</th>

              

                {!isUserOffice && (
                  <th className="px-6 py-3 text-center font-bold">
                    مكتب التمرين
                  </th>)}
                {isUserOffice && (
                  <th className="px-6 py-3 text-center font-bold">
                    كيفية الممارسة
                  </th>)}
              {isUserOffice && (
                <th className="px-6 py-3 text-center font-bold">
                  العنوان
                  </th>)}
                <th className="px-6 py-3 text-center font-bold">رقم الهاتف</th>


                <th className="px-6 py-3 text-center font-bold">
                  تاريخ التسجيل
                </th>
                <th className="px-6 py-3 text-center font-bold">
                  تعديل أو حذف
                </th>
              </tr>
            </thead>
            <tbody>
              {lawyers.map((lawyer, index) => (
                <tr
                  key={lawyer.id}
                  className={`${index % 2 === 0
                      ? "bg-white hover:bg-[#CAAA5C]/10"
                      : "bg-slate-50 hover:bg-[#CAAA5C]/10"
                    } transition-colors border-b ${lawyer.deleted ? "border-red-200" : "border-slate-100"
                    }`}
                >
                  <td className="px-6 py-3">
                    <div className="flex items-center justify-center">
                      {lawyer.image ? (
                        <img
                          src={lawyer.image}
                          alt={lawyer.fullNameAr}
                          className="w-12 h-12 rounded-full object-cover border-2 border-slate-300"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold">
                          {lawyer.fullNameAr?.charAt(0) || "؟"}
                        </div>
                      )}
                    </div>
                  </td>

                  
                  {isUserOffice && (
                    <td className="px-6 py-3 text-center text-slate-800">
                      {lawyer.serialNm || "-"}
                    </td>
                  )}

                  <td className="px-6 py-3 text-center  text-slate-800">
                    {lawyer.fullNameAr || "-"}
                  </td>

                    <td className="px-6 py-3 text-center  text-slate-800">
                    {lawyer.fullNameFr || "-"}
                  </td>


                

                  {!isUserOffice && (
                    <td className="px-6 py-3 text-center text-slate-800">
                      {lawyer.type || "-"}
                    </td>
                  )}

                

                  {isUserOffice && (
                    <td className="px-6 py-3 text-center text-slate-700">
                      {lawyer.type || "-"}
                    </td>
                  )}

                  {isUserOffice && (
                  <td className="px-6 py-3 text-center text-slate-700">
                    {lawyer.officeAdrAr || "-"}
                  </td>
                  )}

                   <td className="px-6 py-3 text-center text-slate-700">
                    {lawyer.mobilePhone || "-"}
                  </td>


                  <td className="px-6 py-3 text-center text-slate-700">
                    {lawyer.registrationDate || "-"}
                  </td>

                  <td className="px-6 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleEdit(lawyer)}
                        className="p-2 text-green-600 hover:bg-blue-100 rounded-lg transition-colors"
                        title="تعديل"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(lawyer)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                        title="حذف"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {showEditModal && selectedLawyer && (
        <EditLawyerModal
          lawyer={selectedLawyer}
          collectionName={currentType}
          currentType={currentType}
          onClose={() => {
            setShowEditModal(false);
            setSelectedLawyer(null);
          }}
          onSave={handleSaveEdit}
        />
      )}

      {showDeleteConfirm && lawyerToDelete && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowDeleteConfirm(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-center w-16 h-16 mx-auto bg-red-100 rounded-full mb-4">
                <Trash2 size={32} className="text-red-600" />
              </div>

              <h3 className="text-2xl font-bold text-center text-slate-800 mb-2">
                تأكيد الحذف
              </h3>

              <p className="text-center text-slate-600 mb-6">
                هل أنت متأكد من حذف {' '}
                <span className="font-bold text-slate-800">{lawyerToDelete.fullNameAr}</span>؟
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setLawyerToDelete(null);
                  }}
                  disabled={deleting}
                  className="flex-1 px-4 py-3 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-medium disabled:opacity-50"
                >
                  إلغاء
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={deleting}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all font-medium disabled:opacity-50"
                >
                  {deleting ? 'جاري الحذف...' : 'حذف'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};