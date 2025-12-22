import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Pencil, Trash2 } from 'lucide-react';

interface ScheduleDay {
  id: string;
  date: string;
  day_name: string;
  display_order: number;
  is_visible: boolean;
}

interface ScheduleItem {
  id: string;
  day_id: string;
  time: string;
  title: string;
  description: string | null;
  display_order: number;
}

const AdminSchedulePanel = () => {
  const [days, setDays] = useState<ScheduleDay[]>([]);
  const [items, setItems] = useState<ScheduleItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingDay, setEditingDay] = useState<ScheduleDay | null>(null);
  const [editingItem, setEditingItem] = useState<ScheduleItem | null>(null);
  const [selectedDayId, setSelectedDayId] = useState<string | null>(null);
  const [isDayDialogOpen, setIsDayDialogOpen] = useState(false);
  const [isItemDialogOpen, setIsItemDialogOpen] = useState(false);
  const { toast } = useToast();

  const emptyDay = { date: '', day_name: '', display_order: 0, is_visible: true };
  const emptyItem = { day_id: '', time: '', title: '', description: '', display_order: 0 };

  const [dayFormData, setDayFormData] = useState(emptyDay);
  const [itemFormData, setItemFormData] = useState(emptyItem);

  useEffect(() => {
    fetchSchedule();
  }, []);

  const fetchSchedule = async () => {
    const [daysResult, itemsResult] = await Promise.all([
      supabase.from('schedule_days').select('*').order('display_order'),
      supabase.from('schedule_items').select('*').order('display_order'),
    ]);

    if (daysResult.error || itemsResult.error) {
      toast({ title: 'Error loading schedule', variant: 'destructive' });
      return;
    }

    setDays(daysResult.data || []);
    setItems(itemsResult.data || []);
    setIsLoading(false);
  };

  // Day CRUD
  const handleSaveDay = async () => {
    if (!dayFormData.date || !dayFormData.day_name) {
      toast({ title: 'Please fill in all required fields', variant: 'destructive' });
      return;
    }

    if (editingDay) {
      const { error } = await supabase
        .from('schedule_days')
        .update(dayFormData)
        .eq('id', editingDay.id);

      if (error) {
        toast({ title: 'Error updating day', variant: 'destructive' });
        return;
      }
      toast({ title: 'Day updated!' });
    } else {
      const { error } = await supabase
        .from('schedule_days')
        .insert({ ...dayFormData, display_order: days.length + 1 });

      if (error) {
        toast({ title: 'Error creating day', variant: 'destructive' });
        return;
      }
      toast({ title: 'Day created!' });
    }

    setIsDayDialogOpen(false);
    setEditingDay(null);
    setDayFormData(emptyDay);
    fetchSchedule();
  };

  const handleDeleteDay = async (id: string) => {
    if (!confirm('Are you sure? This will also delete all items for this day.')) return;

    const { error } = await supabase.from('schedule_days').delete().eq('id', id);
    if (error) {
      toast({ title: 'Error deleting day', variant: 'destructive' });
      return;
    }

    toast({ title: 'Day deleted!' });
    fetchSchedule();
  };

  // Item CRUD
  const handleSaveItem = async () => {
    if (!itemFormData.time || !itemFormData.title || !itemFormData.day_id) {
      toast({ title: 'Please fill in all required fields', variant: 'destructive' });
      return;
    }

    if (editingItem) {
      const { error } = await supabase
        .from('schedule_items')
        .update(itemFormData)
        .eq('id', editingItem.id);

      if (error) {
        toast({ title: 'Error updating item', variant: 'destructive' });
        return;
      }
      toast({ title: 'Item updated!' });
    } else {
      const dayItems = items.filter(i => i.day_id === itemFormData.day_id);
      const { error } = await supabase
        .from('schedule_items')
        .insert({ ...itemFormData, display_order: dayItems.length + 1 });

      if (error) {
        toast({ title: 'Error creating item', variant: 'destructive' });
        return;
      }
      toast({ title: 'Item created!' });
    }

    setIsItemDialogOpen(false);
    setEditingItem(null);
    setItemFormData(emptyItem);
    fetchSchedule();
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    const { error } = await supabase.from('schedule_items').delete().eq('id', id);
    if (error) {
      toast({ title: 'Error deleting item', variant: 'destructive' });
      return;
    }

    toast({ title: 'Item deleted!' });
    fetchSchedule();
  };

  const openEditDayDialog = (day: ScheduleDay) => {
    setEditingDay(day);
    setDayFormData({
      date: day.date,
      day_name: day.day_name,
      display_order: day.display_order,
      is_visible: day.is_visible,
    });
    setIsDayDialogOpen(true);
  };

  const openCreateDayDialog = () => {
    setEditingDay(null);
    setDayFormData(emptyDay);
    setIsDayDialogOpen(true);
  };

  const openEditItemDialog = (item: ScheduleItem) => {
    setEditingItem(item);
    setItemFormData({
      day_id: item.day_id,
      time: item.time,
      title: item.title,
      description: item.description || '',
      display_order: item.display_order,
    });
    setIsItemDialogOpen(true);
  };

  const openCreateItemDialog = (dayId: string) => {
    setEditingItem(null);
    setItemFormData({ ...emptyItem, day_id: dayId });
    setIsItemDialogOpen(true);
  };

  if (isLoading) {
    return <div className="text-center py-12 text-muted-foreground">Loading schedule...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-light text-foreground">Schedule</h2>
          <p className="text-sm text-muted-foreground">Manage your wedding day itineraries</p>
        </div>
        <Dialog open={isDayDialogOpen} onOpenChange={setIsDayDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDayDialog} className="gap-2">
              <Plus className="w-4 h-4" />
              Add Day
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-display text-xl">
                {editingDay ? 'Edit Day' : 'Add New Day'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Date *</Label>
                <Input
                  value={dayFormData.date}
                  onChange={(e) => setDayFormData({ ...dayFormData, date: e.target.value })}
                  placeholder="e.g., December 15, 2025"
                />
              </div>
              <div className="space-y-2">
                <Label>Day Name *</Label>
                <Input
                  value={dayFormData.day_name}
                  onChange={(e) => setDayFormData({ ...dayFormData, day_name: e.target.value })}
                  placeholder="e.g., Day One - Engagement"
                />
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={dayFormData.is_visible}
                  onCheckedChange={(checked) => setDayFormData({ ...dayFormData, is_visible: checked })}
                />
                <Label>Visible on website</Label>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setIsDayDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveDay}>
                  {editingDay ? 'Save Changes' : 'Create Day'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Item Dialog */}
      <Dialog open={isItemDialogOpen} onOpenChange={setIsItemDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-display text-xl">
              {editingItem ? 'Edit Schedule Item' : 'Add Schedule Item'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Time *</Label>
              <Input
                value={itemFormData.time}
                onChange={(e) => setItemFormData({ ...itemFormData, time: e.target.value })}
                placeholder="e.g., 10:00 AM"
              />
            </div>
            <div className="space-y-2">
              <Label>Title *</Label>
              <Input
                value={itemFormData.title}
                onChange={(e) => setItemFormData({ ...itemFormData, title: e.target.value })}
                placeholder="e.g., Wedding Ceremony"
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Input
                value={itemFormData.description || ''}
                onChange={(e) => setItemFormData({ ...itemFormData, description: e.target.value })}
                placeholder="Optional details..."
              />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setIsItemDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveItem}>
                {editingItem ? 'Save Changes' : 'Create Item'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Days List */}
      <div className="space-y-6">
        {days.map((day) => (
          <Card key={day.id} className={`${!day.is_visible ? 'opacity-60' : ''}`}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs text-primary tracking-wide uppercase">{day.date}</span>
                  <CardTitle className="font-display text-xl font-light">{day.day_name}</CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openCreateItemDialog(day.id)}
                    className="gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    Add Item
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => openEditDayDialog(day)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDeleteDay(day.id)}>
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {items
                  .filter((item) => item.day_id === day.id)
                  .map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between py-2 px-3 bg-muted/50 rounded-sm"
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-medium text-muted-foreground w-20">
                          {item.time}
                        </span>
                        <div>
                          <span className="text-sm font-medium text-foreground">{item.title}</span>
                          {item.description && (
                            <span className="text-xs text-muted-foreground ml-2">
                              - {item.description}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openEditItemDialog(item)}>
                          <Pencil className="w-3 h-3" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteItem(item.id)}>
                          <Trash2 className="w-3 h-3 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))}
                {items.filter((item) => item.day_id === day.id).length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No items yet. Click "Add Item" to add schedule items.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {days.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No schedule days yet. Click "Add Day" to create one.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSchedulePanel;
