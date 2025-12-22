import { Calendar, Clock, MapPin } from 'lucide-react';

interface WeddingEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  address: string;
  description?: string;
  mapUrl?: string;
}

interface EventsSectionProps {
  title?: string;
  subtitle?: string;
  events: WeddingEvent[];
}

const EventsSection = ({ 
  title = "Wedding Events", 
  subtitle = "Join us in celebrating our love",
  events 
}: EventsSectionProps) => {
  return (
    <section id="events" className="wedding-section">
      <div className="wedding-container">
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-24">
          <h2 className="wedding-heading mb-4">{title}</h2>
          <div className="wedding-divider mb-6" />
          <p className="wedding-text max-w-2xl mx-auto">{subtitle}</p>
        </div>

        {/* Events Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
          {events.map((event, index) => (
            <div
              key={event.id}
              className="group relative bg-card rounded-sm border border-border/50 p-6 md:p-8 shadow-soft hover:shadow-elegant transition-all duration-500"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Decorative corner */}
              <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
                <div className="absolute -top-8 -right-8 w-16 h-16 bg-sage-light/50 rotate-45" />
              </div>

              {/* Event Title */}
              <h3 className="font-display text-2xl md:text-3xl font-light text-foreground mb-6 pr-8">
                {event.title}
              </h3>

              {/* Event Details */}
              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3">
                  <Calendar className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                  <span className="font-body text-sm text-muted-foreground">{event.date}</span>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                  <span className="font-body text-sm text-muted-foreground">{event.time}</span>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <span className="font-body text-sm font-medium text-foreground block">{event.venue}</span>
                    <span className="font-body text-sm text-muted-foreground">{event.address}</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              {event.description && (
                <p className="font-body text-sm text-muted-foreground mb-6 leading-relaxed">
                  {event.description}
                </p>
              )}

              {/* Map Link */}
              {event.mapUrl && (
                <a
                  href={event.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-body text-xs tracking-[0.15em] uppercase text-primary hover:text-primary/80 transition-colors"
                >
                  <span>View on Map</span>
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              )}

              {/* Hover accent line */}
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/0 to-transparent group-hover:via-primary/30 transition-all duration-500" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EventsSection;
