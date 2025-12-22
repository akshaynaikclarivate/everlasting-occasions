interface StoryEvent {
  date: string;
  title: string;
  description: string;
  image?: string;
}

interface OurStorySectionProps {
  title?: string;
  subtitle?: string;
  events: StoryEvent[];
}

const OurStorySection = ({ 
  title = "Our Story", 
  subtitle = "A journey of love, laughter, and happily ever after",
  events 
}: OurStorySectionProps) => {
  return (
    <section id="our-story" className="wedding-section bg-gradient-soft">
      <div className="wedding-container">
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-24">
          <h2 className="wedding-heading mb-4">{title}</h2>
          <div className="wedding-divider mb-6" />
          <p className="wedding-text max-w-2xl mx-auto">{subtitle}</p>
        </div>

        {/* Timeline */}
        <div className="relative max-w-4xl mx-auto">
          {/* Vertical line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary/20 to-transparent md:-translate-x-px" />

          {events.map((event, index) => (
            <div
              key={index}
              className={`relative flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8 mb-12 md:mb-16 ${
                index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
              }`}
            >
              {/* Timeline dot */}
              <div className="absolute left-4 md:left-1/2 w-3 h-3 bg-primary rounded-full md:-translate-x-1.5 ring-4 ring-background shadow-soft" />

              {/* Content */}
              <div className={`flex-1 pl-12 md:pl-0 ${index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12 md:text-left'}`}>
                <span className="inline-block font-body text-xs tracking-[0.2em] uppercase text-primary mb-2">
                  {event.date}
                </span>
                <h3 className="font-display text-2xl md:text-3xl font-light text-foreground mb-3">
                  {event.title}
                </h3>
                <p className="wedding-text">
                  {event.description}
                </p>
              </div>

              {/* Image */}
              <div className={`flex-1 pl-12 md:pl-0 ${index % 2 === 0 ? 'md:pl-12' : 'md:pr-12'}`}>
                {event.image && (
                  <div className="relative group overflow-hidden rounded-sm">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-48 md:h-64 object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-primary/5 group-hover:bg-transparent transition-colors duration-300" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurStorySection;
