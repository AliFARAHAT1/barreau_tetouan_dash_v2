import { useState, useCallback } from 'react';
import {
  collection,
  query,
  orderBy,
  limit,
  startAfter,
  getDocs,
  where,
  getCountFromServer
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { COLLECTIONS, PAGINATION, ERROR_MESSAGES } from '../constants';

export const useLawyers = () => {
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastDocs, setLastDocs] = useState({});
  const [currentType, setCurrentType] = useState(COLLECTIONS.USERS);
  const [totalCount, setTotalCount] = useState(0);
  const [allLawyersCache, setAllLawyersCache] = useState({});

  const formatDate = (timestamp) => {
    if (!timestamp) return '-';
    try {
      if (timestamp.seconds) return new Date(timestamp.seconds * 1000).toLocaleDateString('ar-MA');
      if (timestamp instanceof Date) return timestamp.toLocaleDateString('ar-MA');
      if (typeof timestamp === 'string') {
        const d = new Date(timestamp);
        if (!isNaN(d.getTime())) return d.toLocaleDateString('ar-MA');
      }
    } catch (err) {
      console.error('formatDate error:', err);
    }
    return '-';
  };

  const getDateFromDoc = (doc) => {
    const regDate = doc.registrationDate;
    if (!regDate) return null;
    if (regDate.seconds) return new Date(regDate.seconds * 1000);
    if (regDate instanceof Date) return regDate;
    if (typeof regDate === 'string') {
      const d = new Date(regDate);
      if (!isNaN(d.getTime())) return d;
    }
    return null;
  };

  const updateLawyerInState = useCallback((updatedLawyer) => {
    setLawyers(prev => prev.map(lawyer =>
      lawyer.id === updatedLawyer.id ? {
        ...lawyer,
        ...updatedLawyer,
        registrationDate: lawyer.registrationDate
      } : lawyer
    ));

    setAllLawyersCache(prev => {
      const newCache = { ...prev };
      delete newCache[currentType];
      return newCache;
    });
  }, [currentType]);

  const removeLawyerFromState = useCallback((lawyerId) => {
    setLawyers(prev => prev.filter(lawyer => lawyer.id !== lawyerId));
    setTotalCount(prev => prev - 1);
    setAllLawyersCache(prev => {
      const newCache = { ...prev };
      delete newCache[currentType];
      return newCache;
    });
  }, [currentType]);


  const fetchAllLawyers = useCallback(async (lawyerType) => {
    if (allLawyersCache[lawyerType]) return allLawyersCache[lawyerType];

    try {
      const collectionRef = collection(db, lawyerType);
      const q = query(collectionRef, orderBy('orderNmInt'));
      const snapshot = await getDocs(q);

      let allDocs = snapshot.docs.map(docSnap => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          _ref: docSnap,
          ...data,
          _dateObj: getDateFromDoc(data),
          registrationDateFormatted: formatDate(data.registrationDate)
        };
      });

      if (lawyerType === COLLECTIONS.USERS_TRAINEE) {
        allDocs = allDocs.filter(d => d.isUpgraded !== true);
      } else if (lawyerType === COLLECTIONS.USERS) {
        allDocs = allDocs.filter(d => d.deleted !== true);
      }

      setAllLawyersCache(prev => ({ ...prev, [lawyerType]: allDocs }));
      return allDocs;
    } catch (err) {
      console.error('fetchAllLawyers error:', err);
      return [];
    }
  }, [allLawyersCache]);

  const fetchTotalCount = useCallback(async (lawyerType, startDate = '', endDate = '', city = 'الكل', gender = 'الكل', typeOfPractice = 'الكل') => {
    try {
      const hasFilters = startDate || endDate || city !== 'الكل' || gender !== 'الكل' || typeOfPractice !== 'الكل';

      if (hasFilters || lawyerType === COLLECTIONS.USERS_TRAINEE || lawyerType === COLLECTIONS.USERS) {
        const allDocs = await fetchAllLawyers(lawyerType);
        const startDateObj = startDate ? new Date(startDate) : null;
        const endDateObj = endDate ? new Date(endDate) : null;
        if (endDateObj) endDateObj.setHours(23, 59, 59, 999);

        const filtered = allDocs.filter(doc => {
          const docDate = doc._dateObj;
          if ((startDateObj || endDateObj) && !docDate) return false;
          if (startDateObj && docDate < startDateObj) return false;
          if (endDateObj && docDate > endDateObj) return false;

          if (city !== 'الكل' && doc.city !== city) return false;
          if (gender !== 'الكل' && doc.gender !== gender) return false;
          if (typeOfPractice !== 'الكل' && doc.typeOfPractice !== typeOfPractice) return false;
          return true;
        });

        setTotalCount(filtered.length);
      } else {
        const collectionRef = collection(db, lawyerType);
        const countSnapshot = await getCountFromServer(collectionRef);
        setTotalCount(countSnapshot.data().count);
      }
    } catch (err) {
      console.error('fetchTotalCount error:', err);
    }
  }, [fetchAllLawyers]);


  const fetchLawyers = useCallback(async (lawyerType, pageNumber = 1, searchTerm = '', startDate = '', endDate = '', city = 'الكل', gender = 'الكل', typeOfPractice = 'الكل') => {
    setLoading(true);
    setError(null);

    try {
      if (searchTerm && searchTerm.trim() !== '') {
        const allDocs = await fetchAllLawyers(lawyerType);

        const startDateObj = startDate ? new Date(startDate) : null;
        const endDateObj = endDate ? new Date(endDate) : null;
        if (endDateObj) endDateObj.setHours(23, 59, 59, 999);

        let filtered = allDocs.filter(doc => {
          const searchInFields =
            (doc.fullNameAr && doc.fullNameAr.includes(searchTerm)) ||
            (doc.fullNameFr && doc.fullNameFr.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (doc.serialNm && doc.serialNm.toString().includes(searchTerm)) ||
            (doc.officeAdrAr && doc.officeAdrAr.includes(searchTerm));
          if (!searchInFields) {
            return false;
          }

          const docDate = doc._dateObj;
          if ((startDateObj || endDateObj) && !docDate) return false;
          if (startDateObj && docDate < startDateObj) return false;
          if (endDateObj && docDate > endDateObj) return false;

          if (city !== 'الكل' && doc.city !== city) return false;

          if (gender !== 'الكل' && doc.gender !== gender) return false;

          if (typeOfPractice !== 'الكل' && doc.typeOfPractice !== typeOfPractice) return false;

          return true;
        });

        const lawyersData = filtered.slice(0, 50).map(doc => ({
          id: doc.id,
          ...doc,
          registrationDate: formatDate(doc.registrationDate)
        }));

        setLawyers(lawyersData);
        setTotalCount(filtered.length);
        setCurrentType(lawyerType);
        setLoading(false);
        return;
      }

      const hasFilters = startDate || endDate || city !== 'الكل' || gender !== 'الكل' || typeOfPractice !== 'الكل';

      if (lawyerType === COLLECTIONS.USERS_TRAINEE || lawyerType === COLLECTIONS.USERS) {
        const allDocs = await fetchAllLawyers(lawyerType);

        const startDateObj = startDate ? new Date(startDate) : null;
        const endDateObj = endDate ? new Date(endDate) : null;
        if (endDateObj) endDateObj.setHours(23, 59, 59, 999);

        let filtered = allDocs.filter(doc => {
          const docDate = doc._dateObj;
          if ((startDateObj || endDateObj) && !docDate) return false;
          if (startDateObj && docDate < startDateObj) return false;
          if (endDateObj && docDate > endDateObj) return false;

          if (city !== 'الكل' && doc.city !== city) return false;
          if (gender !== 'الكل' && doc.gender !== gender) return false;
          if (typeOfPractice !== 'الكل' && doc.typeOfPractice !== typeOfPractice) return false;
          return true;
        });

        filtered.sort((a, b) => (a.orderNmInt || 0) - (b.orderNmInt || 0));

        const startIndex = (pageNumber - 1) * PAGINATION.ITEMS_PER_PAGE;
        const paginated = filtered.slice(startIndex, startIndex + PAGINATION.ITEMS_PER_PAGE);

        const lawyersData = paginated.map(doc => ({
          id: doc.id,
          ...doc,
          registrationDate: formatDate(doc.registrationDate)
        }));

        setLawyers(lawyersData);
        setTotalCount(filtered.length);
        setCurrentType(lawyerType);
        setLoading(false);
        return;
      }

      const collectionRef = collection(db, lawyerType);

      if (!hasFilters && pageNumber === 1) {
        const q = query(collectionRef, orderBy('orderNmInt'), limit(PAGINATION.ITEMS_PER_PAGE));
        const snapshot = await getDocs(q);
        const lawyersData = snapshot.docs.map(d => ({
          id: d.id,
          ...d.data(),
          registrationDate: formatDate(d.data().registrationDate)
        }));
        setLawyers(lawyersData);
        if (snapshot.docs.length > 0) {
          setLastDocs(prev => ({ ...prev, [`${lawyerType}-1`]: snapshot.docs[snapshot.docs.length - 1] }));
        }
        setCurrentType(lawyerType);
        setLoading(false);
        return;
      }

      if (hasFilters) {
        const allDocs = await fetchAllLawyers(lawyerType);
        const startDateObj = startDate ? new Date(startDate) : null;
        const endDateObj = endDate ? new Date(endDate) : null;
        if (endDateObj) endDateObj.setHours(23, 59, 59, 999);

        let filtered = allDocs.filter(doc => {
          const docDate = doc._dateObj;
          if ((startDateObj || endDateObj) && !docDate) return false;
          if (startDateObj && docDate < startDateObj) return false;
          if (endDateObj && docDate > endDateObj) return false;

          if (city !== 'الكل' && doc.city !== city) return false;
          if (gender !== 'الكل' && doc.gender !== gender) return false;
          if (typeOfPractice !== 'الكل' && doc.typeOfPractice !== typeOfPractice) return false;
          return true;
        });

        filtered.sort((a, b) => (a.orderNmInt || 0) - (b.orderNmInt || 0));

        const startIndex = (pageNumber - 1) * PAGINATION.ITEMS_PER_PAGE;
        const paginated = filtered.slice(startIndex, startIndex + PAGINATION.ITEMS_PER_PAGE);

        const lawyersData = paginated.map(doc => ({
          id: doc.id,
          ...doc,
          registrationDate: formatDate(doc.registrationDate)
        }));

        setLawyers(lawyersData);
        setTotalCount(filtered.length);
        setCurrentType(lawyerType);
        setLoading(false);
        return;
      }

      const prevPageLastDoc = lastDocs[`${lawyerType}-${pageNumber - 1}`];
      if (prevPageLastDoc) {
        const q = query(collectionRef, orderBy('orderNmInt'), startAfter(prevPageLastDoc), limit(PAGINATION.ITEMS_PER_PAGE));
        const snapshot = await getDocs(q);

        const lawyersData = snapshot.docs.map(d => ({
          id: d.id,
          ...d.data(),
          registrationDate: formatDate(d.data().registrationDate)
        }));

        setLawyers(lawyersData);
        if (snapshot.docs.length > 0) {
          setLastDocs(prev => ({ ...prev, [`${lawyerType}-${pageNumber}`]: snapshot.docs[snapshot.docs.length - 1] }));
        }
        setCurrentType(lawyerType);
        setLoading(false);
        return;
      }

      // fallback: fetch bigger chunk and slice client-side
      const skipCount = (pageNumber - 1) * PAGINATION.ITEMS_PER_PAGE;
      const tempQ = query(collectionRef, orderBy('orderNmInt'), limit(skipCount + PAGINATION.ITEMS_PER_PAGE));
      const tempSnapshot = await getDocs(tempQ);

      if (tempSnapshot.docs.length === 0) {
        setLawyers([]);
        setCurrentType(lawyerType);
        setLoading(false);
        return;
      }

      const raw = tempSnapshot.docs.map(d => ({ ref: d, data: d.data(), id: d.id }));
      const pageDocs = raw.slice(skipCount, skipCount + PAGINATION.ITEMS_PER_PAGE);

      const lawyersData = pageDocs.map(item => ({
        id: item.id,
        ...item.data,
        registrationDate: formatDate(item.data.registrationDate)
      }));

      setLawyers(lawyersData);
      if (pageDocs.length > 0) {
        setLastDocs(prev => ({ ...prev, [`${lawyerType}-${pageNumber}`]: pageDocs[pageDocs.length - 1].ref }));
      }
      setCurrentType(lawyerType);
    } catch (err) {
      console.error('fetchLawyers error:', err);
      setError(ERROR_MESSAGES.FETCH_ERROR);
    } finally {
      setLoading(false);
    }
  }, [lastDocs, fetchAllLawyers]);


  const searchLawyers = useCallback(async (searchTerm, lawyerType) => {
    if (!searchTerm || searchTerm.trim() === '') {
      fetchLawyers(lawyerType, 1);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const collectionRef = collection(db, lawyerType);
      const q = query(
        collectionRef,
        where('fullNameAr', '>=', searchTerm),
        where('fullNameAr', '<=', searchTerm + '\uf8ff'),
        orderBy('fullNameAr'),
        limit(50)
      );
      const snapshot = await getDocs(q);
      let lawyersData = snapshot.docs.map(d => ({
        id: d.id,
        ...d.data(),
        registrationDate: formatDate(d.data().registrationDate)
      }));
      if (lawyerType === COLLECTIONS.USERS_TRAINEE) {
        lawyersData = lawyersData.filter(l => l.isUpgraded !== true);
      } else if (lawyerType === COLLECTIONS.USERS) {
        lawyersData = lawyersData.filter(l => l.deleted !== true);
      }
      setLawyers(lawyersData);
      setTotalCount(lawyersData.length);
    } catch (err) {
      console.error('searchLawyers error:', err);
      setError(ERROR_MESSAGES.FETCH_ERROR);
    } finally {
      setLoading(false);
    }
  }, [fetchLawyers]);

  const switchLawyerType = useCallback((lawyerType) => {
    setLastDocs({});
    setLawyers([]);
    setAllLawyersCache(prev => ({ ...prev, [lawyerType]: undefined }));
    fetchTotalCount(lawyerType);
    fetchLawyers(lawyerType, 1);
  }, [fetchLawyers, fetchTotalCount]);

  const getTotalWithoutFilters = useCallback(async (type) => {
    const collectionRef = collection(db, type);
    const countSnapshot = await getCountFromServer(collectionRef);
    return countSnapshot.data().count;
  }, []);

  return {
    lawyers,
    loading,
    error,
    currentType,
    totalCount,
    fetchLawyers,
    searchLawyers,
    switchLawyerType,
    fetchTotalCount,
    updateLawyerInState,
    removeLawyerFromState,
    getTotalWithoutFilters
  };
};