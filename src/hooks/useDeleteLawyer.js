import { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

export const useDeleteLawyer = () => {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);

  const deleteLawyer = async (lawyerId, collectionName) => {
    try {
      setDeleting(true);
      setError(null);

      const lawyerRef = doc(db, collectionName, lawyerId);
      
      await updateDoc(lawyerRef, {
        deleted: true,
        deletedAt: new Date()
      });

      return { success: true };
    } catch (err) {
      console.error('Error deleting lawyer:', err);
      setError('فشل في حذف المحامي');
      throw err;
    } finally {
      setDeleting(false);
    }
  };

  return {
    deleteLawyer,
    deleting,
    error
  };
};