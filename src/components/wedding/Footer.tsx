import { Heart, Instagram, Facebook, Mail } from 'lucide-react';

interface FooterProps {
  coupleName: string;
  partnerName: string;
  quote?: string;
  socialLinks?: {
    instagram?: string;
    facebook?: string;
    email?: string;
  };
}

const Footer = ({ 
  coupleName, 
  partnerName, 
  quote = "Two souls, one heart", 
  socialLinks 
}: FooterProps) => {
  return (
    <footer className="py-16 md:py-24 bg-muted/30">
      <div className="wedding-container">
        <div className="text-center">
          {/* Quote */}
          <p className="font-display text-2xl md:text-3xl italic text-muted-foreground mb-8">
            "{quote}"
          </p>

          {/* Couple Names */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <span className="font-display text-xl md:text-2xl text-foreground">{coupleName}</span>
            <Heart className="w-4 h-4 text-primary fill-current" />
            <span className="font-display text-xl md:text-2xl text-foreground">{partnerName}</span>
          </div>

          {/* Social Links */}
          {socialLinks && (
            <div className="flex justify-center gap-4 mb-8">
              {socialLinks.instagram && (
                <a
                  href={socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-card border border-border/50 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 transition-colors"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {socialLinks.facebook && (
                <a
                  href={socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-card border border-border/50 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 transition-colors"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              {socialLinks.email && (
                <a
                  href={`mailto:${socialLinks.email}`}
                  className="w-10 h-10 rounded-full bg-card border border-border/50 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 transition-colors"
                >
                  <Mail className="w-4 h-4" />
                </a>
              )}
            </div>
          )}

          {/* Divider */}
          <div className="wedding-divider mb-8" />

          {/* Copyright */}
          <p className="font-body text-xs text-muted-foreground/60 tracking-wider">
            Made with love for our special day
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
