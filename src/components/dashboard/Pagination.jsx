import { PAGINATION } from '../../constants';

export const Pagination = ({ currentPage, totalItems, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / PAGINATION.ITEMS_PER_PAGE);

  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const showPages = 5;

    if (totalPages <= showPages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-4 p-6 bg-white rounded-2xl shadow-lg">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-6 py-3 bg-[#0969b3] text-white rounded-xl font-bold hover:from-[#b8954a] hover:to-[#a68440] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-md hover:shadow-lg"
      >
        السابق
      </button>

      <div className="flex items-center gap-2">
        {getPageNumbers().map((page, index) => (
          page === '...' ? (
            <span key={`ellipsis-${index}`} className="px-3 text-slate-400 font-bold">...</span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`w-12 h-12 rounded-xl font-bold transition-all duration-300 ${
                currentPage === page
                  ? 'bg-[#0969b3] text-white shadow-lg scale-110'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {page}
            </button>
          )
        ))}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-6 py-3 bg-[#0969b3] text-white rounded-xl font-bold hover:from-[#b8954a] hover:to-[#a68440] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-md hover:shadow-lg"
      >
        التالي
      </button>

      <div className="mr-4 px-4 py-2 bg-slate-100 rounded-xl">
        <span className="text-sm text-slate-600">
          صفحة <span className="font-bold text-[#0969b3]">{currentPage}</span> من <span className="font-bold">{totalPages}</span>
        </span>
        <span className="text-sm text-slate-500 mr-3">
          ({totalItems} محامي)
        </span>
      </div>
    </div>
  );
};