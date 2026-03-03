import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Link, Image as ImageIcon, X, Check, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export default function ImageUpload({ value, onChange, label = 'Image' }: ImageUploadProps) {
  const [imageUrl, setImageUrl] = useState(value || '');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState(value || '');
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [uploadMethod, setUploadMethod] = useState<'url' | 'upload'>('url');

  // Test if image URL loads successfully
  const testImageUrl = (url: string) => {
    if (!url) {
      setImageError(false);
      setPreviewUrl('');
      return;
    }

    setImageLoading(true);
    setImageError(false);

    const img = new Image();
    
    img.onload = () => {
      setImageError(false);
      setPreviewUrl(url);
      onChange(url);
      setImageLoading(false);
    };
    
    img.onerror = () => {
      setImageError(true);
      setPreviewUrl('');
      setImageLoading(false);
    };
    
    img.src = url;
  };

  const handleUrlChange = (url: string) => {
    setImageUrl(url);
    testImageUrl(url);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setImageError(true);
      return;
    }

    setUploadFile(file);
    setImageError(false);

    // Create preview URL
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPreviewUrl(result);
      setImageUrl(result);
      onChange(result);
    };
    reader.readAsDataURL(file);
  };

  const clearImage = () => {
    setImageUrl('');
    setPreviewUrl('');
    setUploadFile(null);
    setImageError(false);
    onChange('');
  };

  const socialMediaExamples = [
    {
      name: 'Facebook',
      example: 'Right-click image → Copy image address',
      icon: '📘'
    },
    {
      name: 'Instagram',
      example: 'Use browser tools to get image URL',
      icon: '📷'
    },
    {
      name: 'Pinterest',
      example: 'Right-click image → Copy image address',
      icon: '📌'
    },
    {
      name: 'Google Images',
      example: 'Right-click → Copy image address',
      icon: '🔍'
    },
    {
      name: 'Imgur',
      example: 'Right-click → Copy image address',
      icon: '🖼️'
    }
  ];

  return (
    <div className="space-y-4">
      <Label className="text-slate-300">{label}</Label>
      
      <Tabs value={uploadMethod} onValueChange={(v) => setUploadMethod(v as 'url' | 'upload')} className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-slate-800">
          <TabsTrigger value="url" className="data-[state=active]:bg-orange-500">
            <Link className="w-4 h-4 mr-2" />
            Image URL
          </TabsTrigger>
          <TabsTrigger value="upload" className="data-[state=active]:bg-orange-500">
            <Upload className="w-4 h-4 mr-2" />
            Upload File
          </TabsTrigger>
        </TabsList>

        <TabsContent value="url" className="space-y-3">
          <div>
            <Input
              type="url"
              value={imageUrl}
              onChange={(e) => handleUrlChange(e.target.value)}
              placeholder="https://example.com/image.jpg or paste from social media"
              className="bg-slate-800 border-slate-700 text-white"
            />
            <p className="text-xs text-slate-500 mt-1">
              Paste image URL from any website, social media, or cloud storage
            </p>
          </div>

          {/* Social Media Sources */}
          <div className="bg-slate-800 rounded-lg p-3">
            <p className="text-xs text-slate-400 mb-2 font-medium">How to get image URLs:</p>
            <div className="grid grid-cols-1 gap-2">
              {socialMediaExamples.map((source) => (
                <div key={source.name} className="flex items-start gap-2 text-xs">
                  <span className="text-base">{source.icon}</span>
                  <div>
                    <span className="text-slate-300 font-medium">{source.name}:</span>
                    <span className="text-slate-500 ml-1">{source.example}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Image loading status */}
          {imageLoading && (
            <Alert className="bg-blue-950/50 border-blue-900">
              <AlertCircle className="h-4 w-4 text-blue-400" />
              <AlertDescription className="text-blue-400">
                Loading image...
              </AlertDescription>
            </Alert>
          )}

          {/* Image error */}
          {imageError && imageUrl && (
            <Alert variant="destructive" className="bg-red-950/50 border-red-900">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Failed to load image. Please check the URL or try a different image.
              </AlertDescription>
            </Alert>
          )}

          {/* Image success */}
          {!imageError && !imageLoading && previewUrl && (
            <Alert className="bg-green-950/50 border-green-900">
              <Check className="h-4 w-4 text-green-400" />
              <AlertDescription className="text-green-400">
                Image loaded successfully!
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>

        <TabsContent value="upload" className="space-y-3">
          <div>
            <div className="flex items-center gap-2">
              <Input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="bg-slate-800 border-slate-700 text-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-orange-500 file:text-white hover:file:bg-orange-600"
              />
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Upload from your device (JPEG, PNG, GIF, WebP)
            </p>
          </div>

          {uploadFile && (
            <Alert className="bg-green-950/50 border-green-900">
              <Check className="h-4 w-4 text-green-400" />
              <AlertDescription className="text-green-400">
                File selected: {uploadFile.name} ({(uploadFile.size / 1024).toFixed(1)} KB)
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>
      </Tabs>

      {/* Image Preview */}
      {previewUrl && !imageError && (
        <div className="relative">
          <div className="bg-slate-800 rounded-lg p-4 border-2 border-green-500/50">
            <div className="flex items-center justify-between mb-2">
              <Label className="text-slate-300 text-sm">Preview:</Label>
              <Button
                type="button"
                size="sm"
                variant="destructive"
                onClick={clearImage}
                className="h-8"
              >
                <X className="w-4 h-4 mr-1" />
                Clear
              </Button>
            </div>
            <div className="relative w-full h-48 bg-slate-900 rounded overflow-hidden flex items-center justify-center">
              <img
                src={previewUrl}
                alt="Preview"
                className="max-w-full max-h-full object-contain"
                onError={() => setImageError(true)}
              />
            </div>
            <div className="mt-2 text-xs text-slate-500 break-all">
              {imageUrl.length > 80 ? imageUrl.substring(0, 80) + '...' : imageUrl}
            </div>
          </div>
        </div>
      )}

      {/* Placeholder when no image */}
      {!previewUrl && !imageError && !imageLoading && (
        <div className="bg-slate-800 rounded-lg p-8 border-2 border-dashed border-slate-700 flex flex-col items-center justify-center text-center">
          <ImageIcon className="w-12 h-12 text-slate-600 mb-3" />
          <p className="text-slate-400 text-sm">No image selected</p>
          <p className="text-slate-500 text-xs mt-1">
            Paste URL or upload a file to preview
          </p>
        </div>
      )}
    </div>
  );
}
