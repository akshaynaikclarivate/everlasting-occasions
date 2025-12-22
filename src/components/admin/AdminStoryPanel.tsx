import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Pencil, Trash2, Upload } from 'lucide-react';

interface StoryEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  image: string | null;
  display_order: number;
  is_visible: boolean;
}

const AdminStoryPanel = () => {
  const [events, setEvents] = useState<StoryEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingEvent, setEditingEvent] = useState<StoryEvent | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const emptyEvent = {
    date: '',
    title: '',
    description: '',
    image: '',
    display_order: 0,
    is_visible: true,
  };

  const [formData, setFormData] = useState(emptyEvent);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const { data, error } = await supabase
      .from('story_events')
      .select('*')
      .order('display_order');

    if (error) {
      toast({ title: 'Error loading story', variant: 'destructive' });
      return;
    }

    setEvents(data || []);
    setIsLoading(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    const fileExt = file.name.split('.').pop();
    const fileName = `story-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('wedding-images')
      .upload(fileName, file);

    if (uploadError) {
      toast({ title: 'Error uploading image', variant: 'destructive' });
      setIsUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('wedding-images')
      .getPublicUrl(fileName);

    setFormData({ ...formData, image: publicUrl });
    setIsUploading(false);
  };

  const handleSave = async () => {
    if (!formData.date || !formData.title || !formData.description) {
      toast({ title: 'Please fill in all required fields', variant: 'destructive' });
      return;
    }

    if (editingEvent) {
      const { error } = await supabase
        .from('story_events')
        .update(formData)
        .eq('id', editingEvent.id);

      if (error) {
        toast({ title: 'Error updating story event', variant: 'destructive' });
        return;
      }
      toast({ title: 'Story event updated!' });
    } else {
      const { error } = await supabase
        .from('story_events')
        .insert({ ...formData, display_order: events.length + 1 });

      if (error) {
        toast({ title: 'Error creating story event', variant: 'destructive' });
        return;
      }
      toast({ title: 'Story event created!' });
    }

    setIsDialogOpen(false);
    setEditingEvent(null);
    setFormData(emptyEvent);
    fetchEvents();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this story event?')) return;

    const { error } = await supabase
      .from('story_events')
      .delete()
      .eq('id', id);

    if (error) {
      toast({ title: 'Error deleting story event', variant: 'destructive' });
      return;
    }

    toast({ title: 'Story event deleted!' });
    fetchEvents();
  };

  const toggleVisibility = async (event: StoryEvent) => {
    const { error } = await supabase
      .from('story_events')
      .update({ is_visible: !event.is_visible })
      .eq('id', event.id);

    if (error) {
      toast({ title: 'Error updating visibility', variant: 'destructive' });
      return;
    }

    fetchEvents();
  };

  const openEditDialog = (event: StoryEvent) => {
    setEditingEvent(event);
    setFormData({
      date: event.date,
      title: event.title,
      description: event.description,
      image: event.image || '',
      display_order: event.display_order,
      is_visible: event.is_visible,
    });
    setIsDialogOpen(true);
  };

  const openCreateDialog = () => {
    setEditingEvent(null);
    setFormData(emptyEvent);
    setIsDialogOpen(true);
  };

  if (isLoading) {
    return <div className="text-center py-12 text-muted-foreground">Loading story...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-light text-foreground">Our Story</h2>
          <p className="text-sm text-muted-foreground">Timeline of your love story</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog} className="gap-2">
              <Plus className="w-4 h-4" />
              Add Moment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-display text-xl">
                {editingEvent ? 'Edit Moment' : 'Add New Moment'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Date/Period *</Label>
                <Input
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  placeholder="e.g., Summer 2020"
                />
              </div>
              <div className="space-y-2">
                <Label>Title *</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., First Meeting"
                />
              </div>
              <div className="space-y-2">
                <Label>Description *</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Tell the story of this moment..."
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label>Image</Label>
                {formData.image && (
                  <div className="relative w-full h-32 rounded-sm overflow-hidden mb-2">
                    <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex gap-2">
                  <Label htmlFor="story-image-upload" className="cursor-pointer flex-1">
                    <div className="flex items-center justify-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-sm hover:bg-secondary/80 transition-colors">
                      <Upload className="w-4 h-4" />
                      <span>{isUploading ? 'Uploading...' : 'Upload'}</span>
                    </div>
                    <input
                      id="story-image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={isUploading}
                    />
                  </Label>
                  <Input
                    value={formData.image || ''}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="Or paste URL"
                    className="flex-1"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.is_visible}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_visible: checked })}
                />
                <Label>Visible on website</Label>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  {editingEvent ? 'Save Changes' : 'Create Moment'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Story Events List */}
      <div className="space-y-4">
        {events.map((event) => (
          <Card key={event.id} className={`${!event.is_visible ? 'opacity-60' : ''}`}>
            <CardContent className="p-4">
              <div className="flex gap-4">
                {event.image && (
                  <div className="w-24 h-24 flex-shrink-0 rounded-sm overflow-hidden">
                    <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-xs text-primary font-medium tracking-wide uppercase">
                        {event.date}
                      </span>
                      <h3 className="font-display text-lg font-medium text-foreground">
                        {event.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {event.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Switch
                        checked={event.is_visible}
                        onCheckedChange={() => toggleVisibility(event)}
                      />
                      <Button variant="ghost" size="icon" onClick={() => openEditDialog(event)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(event.id)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {events.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No story moments yet. Click "Add Moment" to create one.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminStoryPanel;
