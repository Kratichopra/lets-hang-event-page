import { useRecoilState } from 'recoil';
import { useRef, useState } from 'react';
import { eventState } from '../../state/atoms';
import { uploadImage } from '../../services/apiClient';
import { ImageUploader } from './ImageUploader';

export const FlyerSection = () => {
  const [event, setEvent] = useRecoilState(eventState);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Default placeholder image - you can replace this with an actual default image URL
  const defaultImage = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="520" height="520"%3E%3Crect width="520" height="520" fill="%23f093fb"/%3E%3Ctext x="50%25" y="50%25" font-size="48" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="middle"%3EYOU%27RE INVITED%3C/text%3E%3C/svg%3E';
  
  const currentImage = event.flyerImage || defaultImage;

  const handleFlyerImageChange = (imageUrl: string) => {
    setEvent({ ...event, flyerImage: imageUrl });
  };

  const handleBackgroundImageChange = (imageUrl: string) => {
    setEvent({ ...event, backgroundImage: imageUrl });
  };

  const handleImageButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const imageUrl = await uploadImage(file);
      handleFlyerImageChange(imageUrl);
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

  return (
    <div 
      className="flex-[0_0_45%] flex flex-col items-center justify-center p-10 min-h-[600px] bg-white/10"
    >
      <div className="flex flex-col items-center justify-center w-full flex-1">
        {/* Flyer Image Container - 520x520px */}
        <div className="relative w-[520px] h-[520px] flex items-center justify-center">
          <img 
            src={currentImage} 
            alt="Event Flyer" 
            className="w-full h-full object-cover rounded-xl shadow-2xl"
          />
          
          {/* Edit button - bottom right corner of image */}
          <button
            onClick={handleImageButtonClick}
            disabled={isUploading}
            className="absolute bottom-3 right-3 w-10 h-10 bg-white/20 backdrop-blur-sm border-2 border-white/30 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 hover:bg-white/30 hover:border-white/50 hover:scale-110 disabled:opacity-60 disabled:cursor-not-allowed"
            title="Change image"
          >
            {isUploading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            )}
          </button>
          
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
        
        {/* Change background button - below the image */}
        <div className="mt-5 w-[520px]">
          <ImageUploader
            onImageSelect={handleBackgroundImageChange}
            label="🖼 Change background"
            accept="image/*"
          />
        </div>
      </div>
    </div>
  );
};

