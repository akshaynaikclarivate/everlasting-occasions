import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Save, Upload, Image as ImageIcon } from 'lucide-react';

interface Settings {
  couple: { name1: string; name2: string };
  wedding_date: { date: string };
  footer: { quote: string; instagram?: string; email?: string };
  hero_background: { type: string; url: string };
}

const AdminSettingsPanel = () => {
  const [settings, setSettings] = useState<Settings>({
    couple: { name1: '', name2: '' },
    wedding_date: { date: '' },
    footer: { quote: '', instagram: '', email: '' },
    hero_background: { type: 'image', url: '' },
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingHero, setUploadingHero] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    const { data, error } = await supabase
      .from('wedding_settings')
      .select('key, value');

    if (error) {
      toast({ title: 'Error loading settings', variant: 'destructive' });
      return;
    }

    const settingsMap: Partial<Settings> = {};
    data?.forEach((item) => {
      settingsMap[item.key as keyof Settings] = item.value as any;
    });

    setSettings((prev) => ({ ...prev, ...settingsMap }));
    setIsLoading(false);
  };

  const saveSettings = async () => {
    setIsSaving(true);
    
    const updates = [
      { key: 'couple', value: settings.couple },
      { key: 'wedding_date', value: settings.wedding_date },
      { key: 'footer', value: settings.footer },
      { key: 'hero_background', value: settings.hero_background },
    ];

    for (const update of updates) {
      const { error } = await supabase
        .from('wedding_settings')
        .upsert({ key: update.key, value: update.value }, { onConflict: 'key' });

      if (error) {
        toast({ title: `Error saving ${update.key}`, variant: 'destructive' });
        setIsSaving(false);
        return;
      }
    }

    toast({ title: 'Settings saved successfully!' });
    setIsSaving(false);
  };

  const handleHeroImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingHero(true);

    const fileExt = file.name.split('.').pop();
    const fileName = `hero-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('wedding-images')
      .upload(fileName, file, { upsert: true });

    if (uploadError) {
      toast({ title: 'Error uploading image', description: uploadError.message, variant: 'destructive' });
      setUploadingHero(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('wedding-images')
      .getPublicUrl(fileName);

    setSettings((prev) => ({
      ...prev,
      hero_background: { type: 'image', url: publicUrl },
    }));

    toast({ title: 'Hero image uploaded!' });
    setUploadingHero(false);
  };

  if (isLoading) {
    return <div className="text-center py-12 text-muted-foreground">Loading settings...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Couple Names */}
      <Card>
        <CardHeader>
          <CardTitle className="font-display text-xl font-light">Couple Information</CardTitle>
          <CardDescription>Names displayed on the wedding website</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Partner 1 Name</Label>
              <Input
                value={settings.couple.name1}
                onChange={(e) => setSettings((prev) => ({
                  ...prev,
                  couple: { ...prev.couple, name1: e.target.value }
                }))}
                placeholder="e.g., Simran"
              />
            </div>
            <div className="space-y-2">
              <Label>Partner 2 Name</Label>
              <Input
                value={settings.couple.name2}
                onChange={(e) => setSettings((prev) => ({
                  ...prev,
                  couple: { ...prev.couple, name2: e.target.value }
                }))}
                placeholder="e.g., Akshay"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Wedding Date */}
      <Card>
        <CardHeader>
          <CardTitle className="font-display text-xl font-light">Wedding Date</CardTitle>
          <CardDescription>The countdown timer will use this date</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label>Date & Time</Label>
            <Input
              type="datetime-local"
              value={settings.wedding_date.date?.slice(0, 16) || ''}
              onChange={(e) => setSettings((prev) => ({
                ...prev,
                wedding_date: { date: new Date(e.target.value).toISOString() }
              }))}
            />
          </div>
        </CardContent>
      </Card>

      {/* Hero Background */}
      <Card>
        <CardHeader>
          <CardTitle className="font-display text-xl font-light">Hero Background</CardTitle>
          <CardDescription>The main background image for the hero section</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {settings.hero_background.url && (
            <div className="relative aspect-video max-w-md rounded-sm overflow-hidden border border-border">
              <img
                src={settings.hero_background.url}
                alt="Hero background"
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="flex items-center gap-4">
            <Label htmlFor="hero-upload" className="cursor-pointer">
              <div className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-sm hover:bg-secondary/80 transition-colors">
                <Upload className="w-4 h-4" />
                <span>{uploadingHero ? 'Uploading...' : 'Upload New Image'}</span>
              </div>
              <input
                id="hero-upload"
                type="file"
                accept="image/*"
                onChange={handleHeroImageUpload}
                className="hidden"
                disabled={uploadingHero}
              />
            </Label>
            <span className="text-xs text-muted-foreground">
              Recommended: 1920x1080px
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Footer Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="font-display text-xl font-light">Footer Settings</CardTitle>
          <CardDescription>Quote and social links for the footer</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Quote</Label>
            <Textarea
              value={settings.footer.quote}
              onChange={(e) => setSettings((prev) => ({
                ...prev,
                footer: { ...prev.footer, quote: e.target.value }
              }))}
              placeholder="A romantic quote..."
              rows={2}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Instagram URL (optional)</Label>
              <Input
                value={settings.footer.instagram || ''}
                onChange={(e) => setSettings((prev) => ({
                  ...prev,
                  footer: { ...prev.footer, instagram: e.target.value }
                }))}
                placeholder="https://instagram.com/..."
              />
            </div>
            <div className="space-y-2">
              <Label>Contact Email (optional)</Label>
              <Input
                value={settings.footer.email || ''}
                onChange={(e) => setSettings((prev) => ({
                  ...prev,
                  footer: { ...prev.footer, email: e.target.value }
                }))}
                placeholder="wedding@example.com"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={saveSettings} disabled={isSaving} className="gap-2">
          <Save className="w-4 h-4" />
          {isSaving ? 'Saving...' : 'Save All Settings'}
        </Button>
      </div>
    </div>
  );
};

export default AdminSettingsPanel;
