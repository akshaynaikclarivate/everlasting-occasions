import { Helmet } from 'react-helmet-async';
import Navigation from '@/components/wedding/Navigation';
import HeroSection from '@/components/wedding/HeroSection';
import OurStorySection from '@/components/wedding/OurStorySection';
import EventsSection from '@/components/wedding/EventsSection';
import GallerySection from '@/components/wedding/GallerySection';
import ScheduleSection from '@/components/wedding/ScheduleSection';
import Footer from '@/components/wedding/Footer';

// Sample wedding data - this will be replaced with database data later
const weddingData = {
  couple: {
    name1: "Priya",
    name2: "Arjun",
  },
  weddingDate: new Date('2025-12-15T10:00:00'),
  navigationItems: [
    { label: "Our Story", href: "#our-story" },
    { label: "Events", href: "#events" },
    { label: "Gallery", href: "#gallery" },
    { label: "Schedule", href: "#schedule" },
  ],
  story: {
    events: [
      {
        date: "Summer 2020",
        title: "First Meeting",
        description: "We met at a mutual friend's gathering. What started as a casual conversation turned into hours of talking about everything and nothing.",
        image: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=600&h=400&fit=crop",
      },
      {
        date: "Winter 2021",
        title: "First Date",
        description: "A cozy coffee date that lasted well into the evening. We knew then that this was something special.",
        image: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&h=400&fit=crop",
      },
      {
        date: "Spring 2023",
        title: "The Proposal",
        description: "Under the stars on a beautiful beach, the question was asked and answered with tears of joy.",
        image: "https://images.unsplash.com/photo-1529636798458-92182e662485?w=600&h=400&fit=crop",
      },
    ],
  },
  events: [
    {
      id: "1",
      title: "Engagement Ceremony",
      date: "December 13, 2025",
      time: "6:00 PM onwards",
      venue: "The Grand Ballroom",
      address: "Hotel Taj Palace, New Delhi",
      description: "Join us for the ring ceremony followed by cocktails and dinner.",
      mapUrl: "https://maps.google.com",
    },
    {
      id: "2",
      title: "Haldi - Groom's Side",
      date: "December 14, 2025",
      time: "10:00 AM - 2:00 PM",
      venue: "Arjun's Family Residence",
      address: "Green Park, New Delhi",
      description: "Traditional Haldi ceremony with music, dance, and celebration.",
    },
    {
      id: "3",
      title: "Haldi - Bride's Side",
      date: "December 14, 2025",
      time: "10:00 AM - 2:00 PM",
      venue: "Priya's Family Residence",
      address: "Vasant Vihar, New Delhi",
      description: "Traditional Haldi ceremony with turmeric rituals and festivities.",
    },
    {
      id: "4",
      title: "Wedding Ceremony",
      date: "December 15, 2025",
      time: "10:00 AM onwards",
      venue: "The Royal Gardens",
      address: "Chanakyapuri, New Delhi",
      description: "The main wedding ceremony followed by lunch reception.",
      mapUrl: "https://maps.google.com",
    },
  ],
  gallery: [
    { id: "1", src: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop", alt: "Couple photo 1" },
    { id: "2", src: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400&h=300&fit=crop", alt: "Couple photo 2" },
    { id: "3", src: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=400&h=300&fit=crop", alt: "Couple photo 3" },
    { id: "4", src: "https://images.unsplash.com/photo-1460978812857-470ed1c77af0?w=400&h=300&fit=crop", alt: "Couple photo 4" },
    { id: "5", src: "https://images.unsplash.com/photo-1529636444744-adffc9135a5e?w=400&h=300&fit=crop", alt: "Couple photo 5" },
    { id: "6", src: "https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=400&h=300&fit=crop", alt: "Couple photo 6" },
    { id: "7", src: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=400&h=300&fit=crop", alt: "Couple photo 7" },
  ],
  schedule: [
    {
      date: "December 13, 2025",
      dayName: "Day One - Engagement",
      items: [
        { time: "5:00 PM", title: "Guest Arrival", description: "Welcome drinks and mingling" },
        { time: "6:00 PM", title: "Ring Ceremony", description: "The official engagement ritual" },
        { time: "7:30 PM", title: "Cocktails & Music", description: "Live band performance" },
        { time: "9:00 PM", title: "Dinner", description: "Grand buffet dinner" },
      ],
    },
    {
      date: "December 14, 2025",
      dayName: "Day Two - Haldi & Mehendi",
      items: [
        { time: "10:00 AM", title: "Haldi Ceremony", description: "At respective family homes" },
        { time: "4:00 PM", title: "Mehendi", description: "Bride's residence - all are welcome" },
        { time: "7:00 PM", title: "Sangeet Night", description: "Dance performances and DJ" },
      ],
    },
    {
      date: "December 15, 2025",
      dayName: "Day Three - Wedding",
      items: [
        { time: "8:00 AM", title: "Baraat Arrival", description: "Groom's procession" },
        { time: "10:00 AM", title: "Pheras", description: "Wedding rituals begin" },
        { time: "1:00 PM", title: "Lunch Reception", description: "Traditional wedding feast" },
        { time: "4:00 PM", title: "Vidaai", description: "Farewell ceremony" },
      ],
    },
  ],
  footer: {
    quote: "In all the world, there is no heart for me like yours",
    socialLinks: {
      instagram: "https://instagram.com",
      email: "priyaarjun@wedding.com",
    },
  },
};

const Index = () => {
  return (
    <>
      <Helmet>
        <title>{weddingData.couple.name1} & {weddingData.couple.name2} - Wedding</title>
        <meta name="description" content={`Join us in celebrating the wedding of ${weddingData.couple.name1} and ${weddingData.couple.name2}. View our story, events, and RSVP.`} />
      </Helmet>

      <Navigation 
        items={weddingData.navigationItems} 
        coupleName={`${weddingData.couple.name1} & ${weddingData.couple.name2}`}
      />

      <main>
        <HeroSection
          coupleName={weddingData.couple.name1}
          partnerName={weddingData.couple.name2}
          weddingDate={weddingData.weddingDate}
        />

        <OurStorySection events={weddingData.story.events} />

        <EventsSection events={weddingData.events} />

        <GallerySection images={weddingData.gallery} />

        <ScheduleSection schedule={weddingData.schedule} />
      </main>

      <Footer
        coupleName={weddingData.couple.name1}
        partnerName={weddingData.couple.name2}
        quote={weddingData.footer.quote}
        socialLinks={weddingData.footer.socialLinks}
      />
    </>
  );
};

export default Index;
