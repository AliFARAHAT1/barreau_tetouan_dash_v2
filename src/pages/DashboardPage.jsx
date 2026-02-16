import { useState, useEffect, useRef } from 'react';
import { Sidebar } from '../components/dashboard/Sidebar';
import { LawyersTable } from '../components/dashboard/LawyersTable';
import { Pagination } from '../components/dashboard/Pagination';
import { useLawyers } from '../hooks/useLawyers';
import { COLLECTIONS, PAGINATION } from '../constants';
import { useAuth } from '../context/AuthContext';
import { LogOut } from 'lucide-react';

export const DashboardPage = () => {
  const { 
    lawyers,
    loading,
    error,
    currentType,
    totalCount,
    fetchLawyers,
    switchLawyerType,
    fetchTotalCount,
    updateLawyerInState,
    removeLawyerFromState,
    getTotalWithoutFilters
  } = useLawyers();
  
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedCity, setSelectedCity] = useState('الكل');
  const [selectedGender, setSelectedGender] = useState('الكل');
  const [selectedTypeOfPractice, setSelectedTypeOfPractice] = useState('الكل');
  const [totalWithoutFilters, setTotalWithoutFilters] = useState(0);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true;
      fetchTotalCount(COLLECTIONS.USERS);
      fetchLawyers(COLLECTIONS.USERS, 1);
    }
  }, [fetchTotalCount, fetchLawyers]);

  useEffect(() => {
    getTotalWithoutFilters(currentType).then(setTotalWithoutFilters);
  }, [currentType, getTotalWithoutFilters]);

  const handleSearchChange = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
    
    if (term.trim() === '') {
      fetchTotalCount(currentType, startDate, endDate, selectedCity, selectedGender, selectedTypeOfPractice);
      fetchLawyers(currentType, 1, '', startDate, endDate, selectedCity, selectedGender, selectedTypeOfPractice);
    } else {
      fetchLawyers(currentType, 1, term, startDate, endDate, selectedCity, selectedGender, selectedTypeOfPractice);
    }
  };

  const handleCityChange = (city) => {
    setSelectedCity(city);
    setCurrentPage(1);
    setSearchTerm('');
    fetchTotalCount(currentType, startDate, endDate, city, selectedGender, selectedTypeOfPractice);
    fetchLawyers(currentType, 1, '', startDate, endDate, city, selectedGender, selectedTypeOfPractice);
  };

  const handleGenderChange = (gender) => {
    setSelectedGender(gender);
    setCurrentPage(1);
    setSearchTerm('');
    fetchTotalCount(currentType, startDate, endDate, selectedCity, gender, selectedTypeOfPractice);
    fetchLawyers(currentType, 1, '', startDate, endDate, selectedCity, gender, selectedTypeOfPractice);
  };

  const handleTypeOfPracticeChange = (typeOfPractice) => {
    setSelectedTypeOfPractice(typeOfPractice);
    setCurrentPage(1);
    setSearchTerm('');
    fetchTotalCount(currentType, startDate, endDate, selectedCity, selectedGender, typeOfPractice);
    fetchLawyers(currentType, 1, '', startDate, endDate, selectedCity, selectedGender, typeOfPractice);
  };

  const handleDateChange = (type, value) => {
    if (type === 'reset') {
      setStartDate('');
      setEndDate('');
      setSearchTerm('');
      setSelectedCity('الكل');
      setSelectedGender('الكل');
      setSelectedTypeOfPractice('الكل');
      setCurrentPage(1);
      fetchTotalCount(currentType);
      fetchLawyers(currentType, 1);
      return;
    }

    if (type === 'start') {
      setStartDate(value);
    } else if (type === 'end') {
      setEndDate(value);
    } else if (type === 'apply') {
      if (startDate || endDate) {
        setCurrentPage(1);
        setSearchTerm('');
        fetchTotalCount(currentType, startDate, endDate, selectedCity, selectedGender, selectedTypeOfPractice);
        fetchLawyers(currentType, 1, '', startDate, endDate, selectedCity, selectedGender, selectedTypeOfPractice);
      }
    }
  };

  const handleResetAll = () => {
    setStartDate('');
    setEndDate('');
    setSearchTerm('');
    setSelectedCity('الكل');
    setSelectedGender('الكل');
    setSelectedTypeOfPractice('الكل');
    setCurrentPage(1);
    fetchTotalCount(currentType);
    fetchLawyers(currentType, 1);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    fetchLawyers(currentType, pageNumber, searchTerm, startDate, endDate, selectedCity, selectedGender, selectedTypeOfPractice);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTypeChange = (type) => {
    setCurrentPage(1);
    setSearchTerm('');
    setStartDate('');
    setEndDate('');
    setSelectedCity('الكل');
    setSelectedGender('الكل');
    setSelectedTypeOfPractice('الكل');
    switchLawyerType(type);
  };

  const { logout } = useAuth();
  
  const handleLogout = () => {
    logout();
  };

  const hasActiveFilters = 
    searchTerm || 
    startDate || 
    endDate || 
    selectedCity !== 'الكل' || 
    selectedGender !== 'الكل' || 
    selectedTypeOfPractice !== 'الكل';


    const filterPercentage = hasActiveFilters && !searchTerm && totalWithoutFilters > 0
    ? Math.round((totalCount / totalWithoutFilters) * 100)
    : 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex" dir="rtl">
      <div className="flex-1 p-8">
        <LawyersTable 
          lawyers={lawyers} 
          loading={loading}
          error={error}
          currentType={currentType}
          onTypeChange={handleTypeChange}
          totalCount={totalCount}
          filterPercentage={filterPercentage}
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          startDate={startDate}
          endDate={endDate}
          onDateChange={handleDateChange}
          selectedCity={selectedCity}
          onCityChange={handleCityChange}
          selectedGender={selectedGender}
          onGenderChange={handleGenderChange}
          selectedTypeOfPractice={selectedTypeOfPractice}
          onTypeOfPracticeChange={handleTypeOfPracticeChange}
          hasActiveFilters={hasActiveFilters}
          onResetAll={handleResetAll}
          onLawyerUpdate={updateLawyerInState}
          onLawyerDelete={removeLawyerFromState}
        />

        {!loading && totalCount > PAGINATION.ITEMS_PER_PAGE && (
          <div className="mt-6">
            <Pagination
              currentPage={currentPage}
              totalItems={totalCount}
              onPageChange={handlePageChange}
            />
          </div>
        )}

        <button
          onClick={handleLogout}
          className="w-72 mt-8 flex items-center justify-center gap-3 px-4 py-3 bg-gradient-to-r from-[#CAAA5C] to-[#b8954a] rounded-lg hover:from-[#b8954a] hover:to-[#a68440] transition-all duration-300 shadow-lg"
        >
          <span className="font-medium">تسجيل الخروج</span>
          <LogOut size={20} />
        </button>
      </div>
    </div>
  );
};