import React, { useRef, useState } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useImageUpload, type UploadedImage } from '@/hooks/useImageUpload';
import { toast } from 'sonner';

interface ImageUploaderProps {
  bucket: 'category-images' | 'product-images';
  maxFiles?: number;
  currentImages?: string[];
  onImagesChange: (urls: string[]) => void;
  className?: string;
}

export function ImageUploader({
  bucket,
  maxFiles = 10,
  currentImages = [],
  onImagesChange,
  className = ''
}: ImageUploaderProps) {
  const [images, setImages] = useState<string[]>(currentImages);

  // Update local state when currentImages prop changes
  React.useEffect(() => {
    setImages(currentImages);
  }, [currentImages]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { uploadImages, deleteImage, isUploading, uploadProgress } = useImageUpload({
    bucket,
    maxFiles,
    onSuccess: (uploadedImages: UploadedImage[]) => {
      const newUrls = uploadedImages.map(img => img.url);
      const updatedImages = [...images, ...newUrls];
      setImages(updatedImages);
      onImagesChange(updatedImages);
      toast.success(`${uploadedImages.length} image(s) uploaded successfully`);
    },
    onError: (error: string) => {
      toast.error(error);
    }
  });

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    try {
      await uploadImages(files);
    } catch (error) {
      // Error handled by hook
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = async (index: number) => {
    try {
      const imageUrl = images[index];
      
      // Extract path from URL for deletion from storage
      if (imageUrl.includes('supabase')) {
        const pathParts = imageUrl.split('/');
        const fileName = pathParts[pathParts.length - 1];
        await deleteImage(fileName);
      }

      const updatedImages = images.filter((_, i) => i !== index);
      setImages(updatedImages);
      onImagesChange(updatedImages);
      toast.success('Image removed successfully');
    } catch (error) {
      toast.error('Failed to remove image');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    if (files.length === 0) return;

    try {
      await uploadImages(files);
    } catch (error) {
      // Error handled by hook
    }
  };

  const isMaxReached = images.length >= maxFiles;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      {!isMaxReached && (
        <div
          className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 hover:border-muted-foreground/50 transition-colors"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <div className="text-center">
            {isUploading ? (
              <div className="space-y-4">
                <Loader2 className="mx-auto h-12 w-12 text-primary animate-spin" />
                <div className="space-y-2">
                  <p className="text-sm font-medium">Uploading images...</p>
                  <Progress value={uploadProgress} className="w-full max-w-xs mx-auto" />
                </div>
              </div>
            ) : (
              <>
                <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                <div className="mt-4">
                  <Label htmlFor="image-upload" className="cursor-pointer">
                    <span className="mt-2 block text-sm font-medium">
                      Upload images or drag and drop
                    </span>
                    <span className="mt-1 block text-xs text-muted-foreground">
                      PNG, JPG, WEBP up to 10MB each ({images.length}/{maxFiles})
                    </span>
                  </Label>
                  <input
                    ref={fileInputRef}
                    id="image-upload"
                    type="file"
                    multiple={maxFiles > 1}
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    disabled={isUploading}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Image Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((imageUrl, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square relative overflow-hidden rounded-lg border bg-muted">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={`Upload ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-8 h-8 text-muted-foreground" />
                  </div>
                )}
                
                <Button
                  size="sm"
                  variant="destructive"
                  className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleRemoveImage(index)}
                  disabled={isUploading}
                >
                  <X className="h-3 w-3" />
                </Button>
                
                {index === 0 && maxFiles > 1 && (
                  <Badge className="absolute bottom-2 left-2 text-xs">
                    Primary
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Status Messages */}
      {isMaxReached && (
        <p className="text-sm text-muted-foreground text-center">
          Maximum {maxFiles} images reached
        </p>
      )}
    </div>
  );
}