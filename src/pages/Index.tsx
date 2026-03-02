import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/integrations/supabase/client';
import Navigation from '@/components/wedding/Navigation';
import HeroSection from '@/components/wedding/HeroSection';
import OurStorySection from '@/components/wedding/OurStorySection';
import EventsSection from '@/components/wedding/EventsSection';
import GallerySection from '@/components/wedding/GallerySection';
import ScheduleSection from '@/components/wedding/ScheduleSection';
import Footer from '@/components/wedding/Footer';

// Fetch functions
const fetchSettings = async () => {
  const { data, error } = await supabase
    .from('wedding_settings')
    .select('key, value');
  
  if (error) throw error;
  
  const settings: Record<string, any> = {};
  data?.forEach((item) => {
    settings[item.key] = item.value;
  });
  
  return settings;
};

const fetchEvents = async () => {
  const { data, error } = await supabase
    .from('wedding_events')
    .select('*')
    .eq('is_visible', true)
    .order('display_order');
  
  if (error) throw error;
  return data || [];
};

const fetchStoryEvents = async () => {
  const { data, error } = await supabase
    .from('story_events')
    .select('*')
    .eq('is_visible', true)
    .order('display_order');
  
  if (error) throw error;
  return data || [];
};

const fetchGalleryImages = async () => {
  const { data, error } = await supabase
    .from('gallery_images')
    .select('*')
    .eq('is_visible', true)
    .order('display_order');
  
  if (error) throw error;
  return data || [];
};

const fetchSchedule = async () => {
  const [daysResult, itemsResult] = await Promise.all([
    supabase.from('schedule_days').select('*').eq('is_visible', true).order('display_order'),
    supabase.from('schedule_items').select('*').order('display_order'),
  ]);
  
  if (daysResult.error || itemsResult.error) {
    throw daysResult.error || itemsResult.error;
  }
  
  const days = daysResult.data || [];
  const items = itemsResult.data || [];
  
  return days.map(day => ({
    date: day.date,
    dayName: day.day_name,
    items: items.filter(item => item.day_id === day.id).map(item => ({
      time: item.time,
      title: item.title,
      description: item.description,
    })),
  }));
};

const Index = () => {
  const { data: settings, isLoading: settingsLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: fetchSettings,
  });

  const { data: events, isLoading: eventsLoading } = useQuery({
    queryKey: ['events'],
    queryFn: fetchEvents,
  });

  const { data: storyEvents, isLoading: storyLoading } = useQuery({
    queryKey: ['story-events'],
    queryFn: fetchStoryEvents,
  });

  const { data: galleryImages, isLoading: galleryLoading } = useQuery({
    queryKey: ['gallery-images'],
    queryFn: fetchGalleryImages,
  });

  const { data: schedule, isLoading: scheduleLoading } = useQuery({
    queryKey: ['schedule'],
    queryFn: fetchSchedule,
  });

  // Loading state
  if (settingsLoading || eventsLoading || storyLoading || galleryLoading || scheduleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-pulse text-muted-foreground mb-2">Loading...</div>
          <p className="text-sm text-muted-foreground/60">Preparing your wedding website</p>
        </div>
      </div>
    );
  }

  // Extract data with fallbacks
  const couple = settings?.couple || { name1: 'Bride', name2: 'Groom' };
  const weddingDate = settings?.wedding_date?.date 
    ? new Date(settings.wedding_date.date) 
    : new Date();
  const footer = settings?.footer || { quote: 'Two souls, one heart' };
  const heroBackground = settings?.hero_background?.url;

  const navigationItems = [
    { label: "Our Story", href: "#our-story" },
    { label: "Events", href: "#events" },
    { label: "Gallery", href: "#gallery" },
    { label: "Schedule", href: "#schedule" },
  ];

  return (
    <>
      <Helmet>
        <title>{couple.name1} & {couple.name2} - Wedding</title>
        <meta name="description" content={`Join us in celebrating the wedding of ${couple.name1} and ${couple.name2}. View our story, events, and RSVP.`} />
      </Helmet>

      <Navigation 
        items={navigationItems} 
        coupleName={`${couple.name1} & ${couple.name2}`}
      />

      <main>
        <HeroSection
          coupleName={couple.name1}
          partnerName={couple.name2}
          weddingDate={weddingDate}
          backgroundImage={heroBackground}
        />

        {storyEvents && storyEvents.length > 0 && (
          <OurStorySection events={storyEvents} />
        )}

        {events && events.length > 0 && (
          <EventsSection events={events.map(e => ({
            id: e.id,
            title: e.title,
            date: e.date,
            time: e.time,
            venue: e.venue,
            address: e.address,
            description: e.description,
            mapUrl: e.map_url,
          }))} />
        )}

        {galleryImages && galleryImages.length > 0 && (
          <GallerySection images={galleryImages} />
        )}

        {schedule && schedule.length > 0 && (
          <ScheduleSection schedule={schedule} />
        )}
      </main>

      <Footer
        coupleName={couple.name1}
        partnerName={couple.name2}
        quote={footer.quote}
        socialLinks={footer}
      />
    </>
  );
};

export default Index;
