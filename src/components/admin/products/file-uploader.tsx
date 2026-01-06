'use client';
import { useState, ChangeEvent } from 'react';
import { useUploadStorage } from '@/hooks/use-upload-storage';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Image as ImageIcon, Upload, CheckCircle, XCircle } from 'lucide-react';
import Image from 'next/image';
import type { ImageInfo } from '@/lib/types';

interface FileUploaderProps {
  fieldName: 'image' | 'detailImage';
  label: string;
  onUploadComplete: (imageInfo: ImageInfo, fieldName: 'image' | 'detailImage') => void;
  defaultUrl?: string;
}

export default function FileUploader({ fieldName, label, onUploadComplete, defaultUrl }: FileUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(defaultUrl || null);
  const { progress, url, error, startUpload } = useUploadStorage();

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
        onUploadComplete(uploadedImageInfo, fieldName);
      }
    }
  };
  
  const hasUploaded = url && !error;
  const isUploading = progress > 0 && progress < 100;


  return (
    <div className="space-y-4 rounded-md border p-4">
      <p className="font-medium text-sm">{label}</p>
      <div className="relative flex h-48 w-full items-center justify-center rounded-md border-2 border-dashed bg-muted">
        {preview ? (
          <Image src={preview} alt="Xem trước ảnh" layout="fill" objectFit="contain" className="rounded-md" />
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
            <Upload className="mr-2" />
            {isUploading ? 'Đang tải...' : 'Tải ảnh lên'}
        </Button>
      </div>


      {isUploading && <Progress value={progress} />}
      {hasUploaded && (
        <div className="flex items-center gap-2 text-sm text-green-600">
          <CheckCircle />
          <p>Tải lên thành công!</p>
        </div>
      )}
      {error && (
        <div className="flex items-center gap-2 text-sm text-destructive">
          <XCircle />
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}
