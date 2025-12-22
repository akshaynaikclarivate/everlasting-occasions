import CountdownTimer from './CountdownTimer';

interface HeroSectionProps {
  coupleName: string;
  partnerName: string;
  weddingDate: Date;
  backgroundImage?: string;
}

const HeroSection = ({ coupleName, partnerName, weddingDate, backgroundImage }: HeroSectionProps) => {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        {backgroundImage ? (
          <img
            src={backgroundImage}
            alt="Wedding background"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-b from-sage-light/30 via-background to-background" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
      </div>

      {/* Floating decorative elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="floating-particle w-2 h-2 bg-champagne top-1/4 left-1/4" style={{ animationDelay: '0s' }} />
        <div className="floating-particle w-3 h-3 bg-sage top-1/3 right-1/3" style={{ animationDelay: '5s' }} />
        <div className="floating-particle w-2 h-2 bg-blush bottom-1/3 left-1/3" style={{ animationDelay: '10s' }} />
        <div className="floating-particle w-4 h-4 bg-champagne-light bottom-1/4 right-1/4" style={{ animationDelay: '15s' }} />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        {/* Pre-heading */}
        <p className="font-body text-sm tracking-[0.3em] uppercase text-muted-foreground mb-6 opacity-0 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          We're Getting Married
        </p>

        {/* Couple Names */}
        <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-light tracking-wide text-foreground mb-4 opacity-0 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          {coupleName}
        </h1>
        
        <div className="flex items-center justify-center gap-4 mb-4 opacity-0 animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <div className="w-12 md:w-20 h-px bg-gradient-to-r from-transparent to-primary/50" />
          <span className="font-display text-3xl md:text-4xl text-primary italic">&</span>
          <div className="w-12 md:w-20 h-px bg-gradient-to-l from-transparent to-primary/50" />
        </div>

        <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-light tracking-wide text-foreground mb-8 opacity-0 animate-fade-in" style={{ animationDelay: '0.6s' }}>
          {partnerName}
        </h1>

        {/* Date */}
        <p className="font-display text-xl md:text-2xl font-light text-muted-foreground tracking-wide mb-12 opacity-0 animate-fade-in" style={{ animationDelay: '0.8s' }}>
          {formatDate(weddingDate)}
        </p>

        {/* Countdown */}
        <div className="opacity-0 animate-fade-in" style={{ animationDelay: '1s' }}>
          <CountdownTimer targetDate={weddingDate} />
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-0 animate-fade-in" style={{ animationDelay: '1.5s' }}>
          <div className="flex flex-col items-center gap-2 text-muted-foreground/50">
            <span className="text-xs tracking-[0.2em] uppercase">Scroll</span>
            <div className="w-px h-8 bg-gradient-to-b from-muted-foreground/50 to-transparent animate-pulse-soft" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
