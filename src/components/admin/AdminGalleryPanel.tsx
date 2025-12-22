import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Trash2, Upload, Eye, EyeOff } from 'lucide-react';

interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  display_order: number;
  is_visible: boolean;
}

const AdminGalleryPanel = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newImageAlt, setNewImageAlt] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    const { data, error } = await supabase
      .from('gallery_images')
      .select('*')
      .order('display_order');

    if (error) {
      toast({ title: 'Error loading gallery', variant: 'destructive' });
      return;
    }

    setImages(data || []);
    setIsLoading(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);

    for (const file of Array.from(files)) {
      const fileExt = file.name.split('.').pop();
      const fileName = `gallery-${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('wedding-images')
        .upload(fileName, file);

      if (uploadError) {
        toast({ title: `Error uploading ${file.name}`, variant: 'destructive' });
        continue;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('wedding-images')
        .getPublicUrl(fileName);

      const { error: insertError } = await supabase
        .from('gallery_images')
        .insert({
          src: publicUrl,
          alt: file.name.replace(/\.[^/.]+$/, ''),
          display_order: images.length + 1,
        });

      if (insertError) {
        toast({ title: 'Error saving image to gallery', variant: 'destructive' });
      }
    }

    toast({ title: 'Images uploaded successfully!' });
    setIsUploading(false);
    fetchImages();
  };

  const handleAddUrl = async () => {
    if (!newImageUrl) {
      toast({ title: 'Please enter an image URL', variant: 'destructive' });
      return;
    }

    const { error } = await supabase
      .from('gallery_images')
      .insert({
        src: newImageUrl,
        alt: newImageAlt || 'Gallery image',
        display_order: images.length + 1,
      });

    if (error) {
      toast({ title: 'Error adding image', variant: 'destructive' });
      return;
    }

    toast({ title: 'Image added!' });
    setNewImageUrl('');
    setNewImageAlt('');
    setIsDialogOpen(false);
    fetchImages();
  };

  const handleDelete = async (image: GalleryImage) => {
    if (!confirm('Are you sure you want to delete this image?')) return;

    // If it's a storage URL, try to delete from storage
    if (image.src.includes('wedding-images')) {
      const fileName = image.src.split('/').pop();
      if (fileName) {
        await supabase.storage.from('wedding-images').remove([fileName]);
      }
    }

    const { error } = await supabase
      .from('gallery_images')
      .delete()
      .eq('id', image.id);

    if (error) {
      toast({ title: 'Error deleting image', variant: 'destructive' });
      return;
    }

    toast({ title: 'Image deleted!' });
    fetchImages();
  };

  const toggleVisibility = async (image: GalleryImage) => {
    const { error } = await supabase
      .from('gallery_images')
      .update({ is_visible: !image.is_visible })
      .eq('id', image.id);

    if (error) {
      toast({ title: 'Error updating visibility', variant: 'destructive' });
      return;
    }

    fetchImages();
  };

  if (isLoading) {
    return <div className="text-center py-12 text-muted-foreground">Loading gallery...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="font-display text-2xl font-light text-foreground">Photo Gallery</h2>
          <p className="text-sm text-muted-foreground">Manage your wedding photos</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Upload Button */}
          <Label htmlFor="gallery-upload" className="cursor-pointer">
            <div className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-sm hover:bg-secondary/80 transition-colors">
              <Upload className="w-4 h-4" />
              <span>{isUploading ? 'Uploading...' : 'Upload Images'}</span>
            </div>
            <input
              id="gallery-upload"
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileUpload}
              className="hidden"
              disabled={isUploading}
            />
          </Label>

          {/* Add URL Dialog */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Plus className="w-4 h-4" />
                Add URL
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="font-display text-xl">Add Image by URL</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label>Image URL *</Label>
                  <Input
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    placeholder="https://..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Alt Text</Label>
                  <Input
                    value={newImageAlt}
                    onChange={(e) => setNewImageAlt(e.target.value)}
                    placeholder="Description of the image"
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddUrl}>Add Image</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image) => (
          <Card key={image.id} className={`overflow-hidden group ${!image.is_visible ? 'opacity-60' : ''}`}>
            <CardContent className="p-0 relative">
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-40 object-cover"
              />
              <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={() => toggleVisibility(image)}
                    className="h-8 w-8"
                  >
                    {image.is_visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDelete(image)}
                    className="h-8 w-8"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {images.length === 0 && (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            No images yet. Upload some photos or add by URL.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminGalleryPanel;
