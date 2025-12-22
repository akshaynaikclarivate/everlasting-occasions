import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Pencil, Trash2, GripVertical } from 'lucide-react';

interface WeddingEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  address: string;
  description: string | null;
  map_url: string | null;
  display_order: number;
  is_visible: boolean;
}

const AdminEventsPanel = () => {
  const [events, setEvents] = useState<WeddingEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingEvent, setEditingEvent] = useState<WeddingEvent | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const emptyEvent: Omit<WeddingEvent, 'id'> = {
    title: '',
    date: '',
    time: '',
    venue: '',
    address: '',
    description: '',
    map_url: '',
    display_order: 0,
    is_visible: true,
  };

  const [formData, setFormData] = useState<Omit<WeddingEvent, 'id'>>(emptyEvent);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const { data, error } = await supabase
      .from('wedding_events')
      .select('*')
      .order('display_order');

    if (error) {
      toast({ title: 'Error loading events', variant: 'destructive' });
      return;
    }

    setEvents(data || []);
    setIsLoading(false);
  };

  const handleSave = async () => {
    if (!formData.title || !formData.date || !formData.time || !formData.venue || !formData.address) {
      toast({ title: 'Please fill in all required fields', variant: 'destructive' });
      return;
    }

    if (editingEvent) {
      const { error } = await supabase
        .from('wedding_events')
        .update(formData)
        .eq('id', editingEvent.id);

      if (error) {
        toast({ title: 'Error updating event', variant: 'destructive' });
        return;
      }
      toast({ title: 'Event updated!' });
    } else {
      const { error } = await supabase
        .from('wedding_events')
        .insert({ ...formData, display_order: events.length + 1 });

      if (error) {
        toast({ title: 'Error creating event', variant: 'destructive' });
        return;
      }
      toast({ title: 'Event created!' });
    }

    setIsDialogOpen(false);
    setEditingEvent(null);
    setFormData(emptyEvent);
    fetchEvents();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;

    const { error } = await supabase
      .from('wedding_events')
      .delete()
      .eq('id', id);

    if (error) {
      toast({ title: 'Error deleting event', variant: 'destructive' });
      return;
    }

    toast({ title: 'Event deleted!' });
    fetchEvents();
  };

  const toggleVisibility = async (event: WeddingEvent) => {
    const { error } = await supabase
      .from('wedding_events')
      .update({ is_visible: !event.is_visible })
      .eq('id', event.id);

    if (error) {
      toast({ title: 'Error updating visibility', variant: 'destructive' });
      return;
    }

    fetchEvents();
  };

  const openEditDialog = (event: WeddingEvent) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      date: event.date,
      time: event.time,
      venue: event.venue,
      address: event.address,
      description: event.description || '',
      map_url: event.map_url || '',
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
    return <div className="text-center py-12 text-muted-foreground">Loading events...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-light text-foreground">Wedding Events</h2>
          <p className="text-sm text-muted-foreground">Manage your wedding ceremony events</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog} className="gap-2">
              <Plus className="w-4 h-4" />
              Add Event
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-display text-xl">
                {editingEvent ? 'Edit Event' : 'Add New Event'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Title *</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Wedding Ceremony"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Date *</Label>
                  <Input
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    placeholder="e.g., December 15, 2025"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Time *</Label>
                  <Input
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    placeholder="e.g., 10:00 AM onwards"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Venue *</Label>
                <Input
                  value={formData.venue}
                  onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                  placeholder="e.g., The Royal Gardens"
                />
              </div>
              <div className="space-y-2">
                <Label>Address *</Label>
                <Input
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="e.g., Chanakyapuri, New Delhi"
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of the event..."
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>Google Maps URL</Label>
                <Input
                  value={formData.map_url || ''}
                  onChange={(e) => setFormData({ ...formData, map_url: e.target.value })}
                  placeholder="https://maps.google.com/..."
                />
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
                  {editingEvent ? 'Save Changes' : 'Create Event'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Events List */}
      <div className="space-y-3">
        {events.map((event) => (
          <Card key={event.id} className={`${!event.is_visible ? 'opacity-60' : ''}`}>
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className="cursor-move text-muted-foreground">
                  <GripVertical className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-display text-lg font-medium text-foreground">
                    {event.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {event.date} • {event.time}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {event.venue}, {event.address}
                  </p>
                </div>
                <div className="flex items-center gap-2">
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
            </CardContent>
          </Card>
        ))}

        {events.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No events yet. Click "Add Event" to create one.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminEventsPanel;
