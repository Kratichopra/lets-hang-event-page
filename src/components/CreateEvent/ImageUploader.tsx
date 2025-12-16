import { useRef, useState } from 'react';
import { uploadImage } from '../../services/apiClient';

interface ImageUploaderProps {
  onImageSelect: (imageUrl: string) => void;
  label: string;
  accept?: string;
  className?: string;
}

export const ImageUploader = ({ 
  onImageSelect, 
  label, 
  accept = 'image/*',
  className
}: ImageUploaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // In real backend, this would be: const url = await uploadImage(file);
      const imageUrl = await uploadImage(file);
      onImageSelect(imageUrl);
      // Reset input so same file can be selected again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />
      <button
        className={`${className || "px-4 py-2.5 bg-white/20 backdrop-blur-sm border-2 border-white/30 rounded-lg text-sm font-medium text-white cursor-pointer transition-all duration-200 hover:bg-white/30 hover:border-white/50 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed"} w-full`}
        onClick={handleClick}
        disabled={isUploading}
      >
        {isUploading ? 'Uploading...' : label}
      </button>
    </>
  );
};

