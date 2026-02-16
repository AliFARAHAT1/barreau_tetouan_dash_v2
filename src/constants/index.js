
export const AUTH_CONFIG = {
  EMAIL_DOMAIN: '@barreautanger.ma',
  DEFAULT_USERNAME: 'admin',
  STORAGE_KEY: 'isLoggedIn'
};


export const COLLECTIONS = {
  ADMINS: 'barreau_admins',
  USERS: 'barreau_users',
  USERS_TRAINEE: 'barreau_users_trainee'

};


export const PAGINATION = {
  ITEMS_PER_PAGE: 10,
  MAX_PAGE_BUTTONS: 5
};


export const LAWYER_TYPES = {
  OFFICIAL: 'المحامين الرسميين',
  TRAINEE: 'المحامين المتمرنين'
};


export const SIDEBAR_ITEMS = [
  { id: 'home', label: 'الرئيسية', icon: 'Users', path: '/' },
  { id: 'activities', label: 'أنشطة الهيئة', icon: 'FileText', path: '/activities' },
  { id: 'courses', label: 'الدورات', icon: 'BookOpen', path: '/courses' },
  { id: 'notifications', label: 'الإخبارات', icon: 'Bell', path: '/notifications' },
  { id: 'complaints', label: 'الشكايات', icon: 'File', path: '/complaints' },
  { id: 'union', label: 'النقابي', icon: 'Lightbulb', path: '/union' },
  { id: 'announcements', label: 'البلاغات', icon: 'File', path: '/announcements' },
  { id: 'statements', label: 'البيانات', icon: 'File', path: '/statements' },
  { id: 'services', label: 'الخدمات', icon: 'Settings', path: '/services' },
  { id: 'suggestions', label: 'الإقتراحات', icon: 'Lightbulb', path: '/suggestions' },
  { id: 'correspondence', label: 'المراسلات', icon: 'Mail', path: '/correspondence' },
  { id: 'improve-table', label: 'تحسين جدول المحامين', icon: 'Users', path: '/improve-table' },
  { id: 'lawyers-table', label: 'جدول المحامين', icon: 'Users', path: '/lawyers-table' }
];


export const ERROR_MESSAGES = {
  INVALID_CREDENTIALS: 'اسم المستخدم أو كلمة المرور غير صحيحة',
  LOGIN_ERROR: 'حدث خطأ أثناء تسجيل الدخول',
  FETCH_ERROR: 'حدث خطأ أثناء جلب البيانات',
  NO_DATA: 'لا توجد بيانات'
};


export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'تم تسجيل الدخول بنجاح',
  LOGOUT_SUCCESS: 'تم تسجيل الخروج بنجاح'
};