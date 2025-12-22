interface ScheduleItem {
  time: string;
  title: string;
  description?: string;
}

interface ScheduleDay {
  date: string;
  dayName: string;
  items: ScheduleItem[];
}

interface ScheduleSectionProps {
  title?: string;
  subtitle?: string;
  schedule: ScheduleDay[];
}

const ScheduleSection = ({ 
  title = "Schedule", 
  subtitle = "A day-by-day guide to our celebration",
  schedule 
}: ScheduleSectionProps) => {
  return (
    <section id="schedule" className="wedding-section">
      <div className="wedding-container">
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-24">
          <h2 className="wedding-heading mb-4">{title}</h2>
          <div className="wedding-divider mb-6" />
          <p className="wedding-text max-w-2xl mx-auto">{subtitle}</p>
        </div>

        {/* Schedule */}
        <div className="max-w-3xl mx-auto space-y-12 md:space-y-16">
          {schedule.map((day, dayIndex) => (
            <div key={dayIndex} className="relative">
              {/* Day Header */}
              <div className="text-center mb-8 md:mb-12">
                <span className="font-body text-xs tracking-[0.3em] uppercase text-primary">
                  {day.date}
                </span>
                <h3 className="font-display text-3xl md:text-4xl font-light text-foreground mt-2">
                  {day.dayName}
                </h3>
              </div>

              {/* Timeline */}
              <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-[60px] md:left-[80px] top-0 bottom-0 w-px bg-border" />

                <div className="space-y-6 md:space-y-8">
                  {day.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex gap-4 md:gap-6">
                      {/* Time */}
                      <div className="w-14 md:w-16 flex-shrink-0 text-right">
                        <span className="font-body text-sm text-muted-foreground">
                          {item.time}
                        </span>
                      </div>

                      {/* Dot */}
                      <div className="relative flex-shrink-0">
                        <div className="w-3 h-3 rounded-full bg-sage border-2 border-background shadow-sm" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 pb-2">
                        <h4 className="font-display text-xl md:text-2xl font-light text-foreground mb-1">
                          {item.title}
                        </h4>
                        {item.description && (
                          <p className="font-body text-sm text-muted-foreground">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ScheduleSection;
