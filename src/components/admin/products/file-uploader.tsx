'use client';

import { ChangeEvent, useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import Image from 'next/image';
import { Upload, X } from 'lucide-react';
import { useUploadStorage } from '@/hooks/use-upload-storage';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';

interface FileUploaderProps {
  fieldName: string;
  defaultUrl?: string | null;
}

export default function FileUploader({ fieldName, defaultUrl }: FileUploaderProps) {
  const { setValue, getValues, formState } = useFormContext();
  const [preview, setPreview] = useState<string | null>(defaultUrl || null);
  const { progress, startUpload, isUploading, error } = useUploadStorage();

  // Effect to update preview when defaultUrl changes (e.g., when editing an item)
  useEffect(() => {
    const currentValue = getValues(fieldName)?.url;
    if (defaultUrl && defaultUrl !== currentValue) {
      setPreview(defaultUrl);
    } else if (!defaultUrl) {
      setPreview(null);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultUrl, fieldName]);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      try {
        const imageInfo = await startUpload(file, 'categories');
        if (imageInfo) {
          setValue(fieldName, imageInfo, { shouldValidate: true, shouldDirty: true });
        }
      } catch (uploadError) {
        console.error('Upload failed in component', uploadError);
        // Error state is already handled by the hook
      }
    }
  };

  const handleRemoveImage = () => {
    setPreview(null);
    setValue(fieldName, null, { shouldValidate: true, shouldDirty: true });
  };

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div className="w-full aspect-video border-2 border-dashed border-muted-foreground/30 rounded-lg flex items-center justify-center relative group">
        {preview ? (
          <>
            <Image src={preview} alt="Preview" layout="fill" objectFit="contain" className="rounded-lg" />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={handleRemoveImage}
            >
              <X className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <label htmlFor={`file-upload-${fieldName}`} className="cursor-pointer flex flex-col items-center">
            <Upload className="h-10 w-10 text-muted-foreground" />
            <p className="mt-2 text-sm text-muted-foreground">Nhấn hoặc kéo thả ảnh</p>
            <Input 
                id={`file-upload-${fieldName}`}
                name={`file-upload-${fieldName}`}
                type="file"
                className="sr-only"
                onChange={handleFileChange}
                accept="image/png, image/jpeg, image/webp"
            />
          </label>
        )}
      </div>
      {isUploading && <Progress value={progress} className="w-full mt-2 h-2" />}
      {error && <p className="text-sm text-destructive mt-2">{error}</p>}
      {formState.errors[fieldName] && (
        <p className="text-sm font-medium text-destructive mt-2">
            {(formState.errors[fieldName] as any)?.message}
        </p>
      )}
    </div>
  );
}
