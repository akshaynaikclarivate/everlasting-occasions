import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  LogOut, 
  Settings, 
  Image, 
  Calendar, 
  BookOpen, 
  Clock,
  Home
} from 'lucide-react';
import AdminSettingsPanel from '@/components/admin/AdminSettingsPanel';
import AdminEventsPanel from '@/components/admin/AdminEventsPanel';
import AdminGalleryPanel from '@/components/admin/AdminGalleryPanel';
import AdminStoryPanel from '@/components/admin/AdminStoryPanel';
import AdminSchedulePanel from '@/components/admin/AdminSchedulePanel';

const AdminDashboard = () => {
  const { user, isAdmin, isLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('settings');

  useEffect(() => {
    if (!isLoading && (!user || !isAdmin)) {
      navigate('/');
    }
  }, [user, isAdmin, isLoading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Signed out",
      description: "You have been signed out successfully.",
    });
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <h1 className="font-display text-xl font-light text-foreground">
                Wedding Admin
              </h1>
              <span className="hidden sm:inline-block px-2 py-1 bg-primary/10 text-primary text-xs rounded-sm font-body">
                Dashboard
              </span>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.open('/', '_blank')}
                className="gap-2"
              >
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">View Site</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="gap-2 text-muted-foreground hover:text-destructive"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-card border border-border/50 p-1 h-auto flex-wrap">
            <TabsTrigger value="settings" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </TabsTrigger>
            <TabsTrigger value="events" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Calendar className="w-4 h-4" />
              <span>Events</span>
            </TabsTrigger>
            <TabsTrigger value="gallery" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Image className="w-4 h-4" />
              <span>Gallery</span>
            </TabsTrigger>
            <TabsTrigger value="story" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <BookOpen className="w-4 h-4" />
              <span>Our Story</span>
            </TabsTrigger>
            <TabsTrigger value="schedule" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Clock className="w-4 h-4" />
              <span>Schedule</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="settings" className="mt-6">
            <AdminSettingsPanel />
          </TabsContent>

          <TabsContent value="events" className="mt-6">
            <AdminEventsPanel />
          </TabsContent>

          <TabsContent value="gallery" className="mt-6">
            <AdminGalleryPanel />
          </TabsContent>

          <TabsContent value="story" className="mt-6">
            <AdminStoryPanel />
          </TabsContent>

          <TabsContent value="schedule" className="mt-6">
            <AdminSchedulePanel />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
