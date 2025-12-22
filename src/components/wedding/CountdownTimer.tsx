import { useState, useEffect } from 'react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface CountdownTimerProps {
  targetDate: Date;
}

const CountdownTimer = ({ targetDate }: CountdownTimerProps) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const calculateTimeLeft = () => {
      const difference = targetDate.getTime() - new Date().getTime();
      
      if (difference > 0) {
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      }
      
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const timeUnits = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Minutes', value: timeLeft.minutes },
    { label: 'Seconds', value: timeLeft.seconds },
  ];

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex justify-center gap-4 md:gap-8">
      {timeUnits.map((unit, index) => (
        <div
          key={unit.label}
          className="flex flex-col items-center"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div className="relative">
            <div className="w-16 h-16 md:w-24 md:h-24 rounded-sm bg-card/80 backdrop-blur-sm border border-border/30 flex items-center justify-center shadow-soft">
              <span className="font-display text-2xl md:text-4xl font-light text-foreground tabular-nums">
                {String(unit.value).padStart(2, '0')}
              </span>
            </div>
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-12 md:w-16 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
          </div>
          <span className="mt-3 font-body text-xs md:text-sm tracking-[0.2em] uppercase text-muted-foreground">
            {unit.label}
          </span>
        </div>
      ))}
    </div>
  );
};

export default CountdownTimer;
