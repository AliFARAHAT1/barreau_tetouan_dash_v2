import { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../config/firebase';

export const useEditLawyer = () => {
  const [uploading, setUploading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);

  const uploadImage = async (file, lawyerId) => {
    if (!file) return null;

    try {
      setUploading(true);
      setError(null);

      const storageRef = ref(storage, `barreau_users_images/${lawyerId}_${Date.now()}`);
      
      await uploadBytes(storageRef, file);
      
      const downloadURL = await getDownloadURL(storageRef);
      
      return downloadURL;
    } catch (err) {
      console.error('Error uploading image:', err);
      setError('فشل في رفع الصورة');
      throw err;
    } finally {
      setUploading(false);
    }
  };

  const deleteImage = async (imageUrl) => {
    if (!imageUrl) return;

    try {
      const imagePath = imageUrl.split('/o/')[1]?.split('?')[0];
      if (!imagePath) return;

      const decodedPath = decodeURIComponent(imagePath);
      const imageRef = ref(storage, decodedPath);
      
      await deleteObject(imageRef);
    } catch (err) {
      console.error('Error deleting image:', err);
    }
  };

  const updateLawyer = async (lawyerId, collectionName, data, newImageFile = null) => {
    try {
      setUpdating(true);
      setError(null);

      let imageUrl = data.image;

      if (newImageFile) {
        imageUrl = await uploadImage(newImageFile, lawyerId);
        
        if (data.image && data.image !== imageUrl) {
          await deleteImage(data.image);
        }
      }

      const lawyerRef = doc(db, collectionName, lawyerId);
      
      const updateData = {
        fullNameAr: data.fullNameAr,
        fullNameFr: data.fullNameFr,
        officeAdrAr: data.officeAdrAr,
        typeOfPractice: data.typeOfPractice,
        type: data.type,
        email: data.email,
        city: data.city,
        mobilePhone: data.mobilePhone,
        landlinePhone: data.landlinePhone,
        image: imageUrl,
        updatedAt: new Date(),
        trainee: data.trainee
      };

      await updateDoc(lawyerRef, updateData);

      return { success: true, imageUrl };
    } catch (err) {
      console.error('Error updating lawyer:', err);
      setError('فشل في تحديث البيانات');
      throw err;
    } finally {
      setUpdating(false);
    }
  };

  return {
    uploadImage,
    updateLawyer,
    uploading,
    updating,
    error
  };
};