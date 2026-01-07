'use client';
import { useState, ChangeEvent, useEffect } from 'react';
import { useUploadStorage } from '@/hooks/use-upload-storage';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Image as ImageIcon, Upload, CheckCircle, XCircle } from 'lucide-react';
import Image from 'next/image';
import type { ImageInfo } from '@/lib/types';
import { useFormContext } from 'react-hook-form';

interface FileUploaderProps {
  fieldName: 'image' | 'detailImage';
  label: string;
  defaultUrl?: string | null;
  onUploadStateChange: (isUploading: boolean, fieldName: any) => void;
}

export default function FileUploader({ fieldName, label, defaultUrl, onUploadStateChange }: FileUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const { progress, url, error, startUpload, isUploading } = useUploadStorage();
  const { setValue, watch } = useFormContext(); 

  const fieldValue = watch(fieldName);

  useEffect(() => {
    if (fieldValue?.url) {
      setPreview(fieldValue.url);
    } else if (defaultUrl) {
      setPreview(defaultUrl);
    } else {
      setPreview(null);
    }
  }, [fieldValue, defaultUrl]);

  useEffect(() => {
    onUploadStateChange(isUploading, fieldName);
  }, [isUploading, onUploadStateChange, fieldName]);
  
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (file) {
      const uploadedImageInfo = await startUpload(file, 'products');
      if (uploadedImageInfo) {
        setValue(fieldName, uploadedImageInfo, { shouldValidate: true, shouldDirty: true });
      }
    }
  };
  
  const hasUploaded = url && !error;

  return (
    <div className="space-y-4 rounded-md border p-4">
      <p className="font-medium text-sm">{label}</p>
      <div className="relative flex h-48 w-full items-center justify-center rounded-md border-2 border-dashed bg-muted">
        {preview ? (
          <Image src={preview} alt="Xem trước ảnh" fill objectFit="contain" className="rounded-md" />
        ) : (
          <div className="text-center text-muted-foreground">
            <ImageIcon className="mx-auto h-10 w-10" />
            <p className="mt-2 text-xs">Chưa có ảnh nào được chọn</p>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Input id={fieldName} type="file" onChange={handleFileChange} accept="image/*" />
        <Button
            type="button"
            onClick={handleUpload}
            disabled={!file || isUploading}
            className="w-full"
            variant="outline"
        >
            <Upload className="mr-2 h-4 w-4" />
            {isUploading ? 'Đang tải...' : 'Tải ảnh lên'}
        </Button>
      </div>


      {isUploading && <Progress value={progress} />}
      {hasUploaded && (
        <div className="flex items-center gap-2 text-sm text-green-600">
          <CheckCircle className="h-4 w-4" />
          <p>Tải lên thành công!</p>
        </div>
      )}
      {error && (
        <div className="flex items-center gap-2 text-sm text-destructive">
          <XCircle className="h-4 w-4" />
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}
