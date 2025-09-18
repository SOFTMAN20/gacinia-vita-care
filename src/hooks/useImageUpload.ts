import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface UploadedImage {
  url: string;
  path: string;
  file: File;
}

export interface UseImageUploadOptions {
  bucket: 'category-images' | 'product-images';
  maxSizeBytes?: number;
  maxFiles?: number;
  onSuccess?: (images: UploadedImage[]) => void;
  onError?: (error: string) => void;
}

export function useImageUpload({
  bucket,
  maxSizeBytes = 10 * 1024 * 1024, // 10MB default
  maxFiles = 10,
  onSuccess,
  onError
}: UseImageUploadOptions) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const compressImage = (file: File, maxWidth = 1200, quality = 0.8): Promise<File> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img;
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              resolve(file);
            }
          },
          file.type,
          quality
        );
      };

      img.src = URL.createObjectURL(file);
    });
  };

  const uploadImages = async (files: FileList | File[]): Promise<UploadedImage[]> => {
    const fileArray = Array.from(files);
    
    if (fileArray.length > maxFiles) {
      const error = `Maximum ${maxFiles} files allowed`;
      onError?.(error);
      throw new Error(error);
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const uploadedImages: UploadedImage[] = [];
      
      for (let i = 0; i < fileArray.length; i++) {
        const file = fileArray[i];
        
        // Validate file size
        if (file.size > maxSizeBytes) {
          throw new Error(`File ${file.name} exceeds ${maxSizeBytes / (1024 * 1024)}MB limit`);
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
          throw new Error(`File ${file.name} is not an image`);
        }

        // Compress image
        const compressedFile = await compressImage(file);

        // Generate unique filename
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `${fileName}`;

        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
          .from(bucket)
          .upload(filePath, compressedFile);

        if (error) {
          throw new Error(`Failed to upload ${file.name}: ${error.message}`);
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from(bucket)
          .getPublicUrl(filePath);

        uploadedImages.push({
          url: publicUrl,
          path: filePath,
          file: compressedFile
        });

        // Update progress
        setUploadProgress(((i + 1) / fileArray.length) * 100);
      }

      onSuccess?.(uploadedImages);
      return uploadedImages;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      onError?.(errorMessage);
      throw error;
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const deleteImage = async (path: string): Promise<void> => {
    try {
      const { error } = await supabase.storage
        .from(bucket)
        .remove([path]);

      if (error) {
        throw new Error(`Failed to delete image: ${error.message}`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Delete failed';
      onError?.(errorMessage);
      throw error;
    }
  };

  return {
    uploadImages,
    deleteImage,
    isUploading,
    uploadProgress
  };
}