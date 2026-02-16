
export const formatPhone = (phone) => {
  if (!phone) return '-';
  
  const cleaned = phone.replace(/\D/g, '');
  

  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 4)}-${cleaned.slice(4)}`;
  }
  
  return phone;
};

export const getFullName = (lawyer) => {
  return lawyer.fullNameAr || lawyer.fullNameFr || 'غير متوفر';
};


export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};


export const delay = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};


export const formatDate = (date) => {
  if (!date) return '-';
  
  const d = new Date(date);
  return d.toLocaleDateString('ar-MA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const truncateText = (text, maxLength = 50) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};


export const filterBySearch = (items, searchTerm) => {
  if (!searchTerm || searchTerm.trim() === '') return items;
  
  const searchLower = searchTerm.toLowerCase();
  
  return items.filter(item => {
    return Object.values(item).some(value => {
      if (value === null || value === undefined) return false;
      return value.toString().toLowerCase().includes(searchLower);
    });
  });
};


export const calculateTotalPages = (totalItems, itemsPerPage) => {
  return Math.ceil(totalItems / itemsPerPage);
};


export const paginate = (items, currentPage, itemsPerPage) => {
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  return items.slice(indexOfFirstItem, indexOfLastItem);
};