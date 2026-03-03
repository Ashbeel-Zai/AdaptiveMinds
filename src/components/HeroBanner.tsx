import bannerImg from "@/assets/banner.png";

const HeroBanner = ({ onJoinClick }: { onJoinClick: () => void }) => {
  return (
    <section className="relative w-full h-[60vh] min-h-[400px] overflow-hidden">
      <img
        src={bannerImg}
        alt="Cyber matrix code background"
        className="absolute inset-0 w-full h-full object-cover opacity-60"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/60 to-background" />
      <div className="scanline absolute inset-0 pointer-events-none" />
      
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-center">
        <p className="text-muted-foreground font-mono text-sm mb-2 tracking-widest uppercase">
          // bug bounty collective
        </p>
        <h1 className="font-display text-5xl md:text-7xl font-bold text-primary text-glow mb-4">
          $ADAPTIVE-MINDS
        </h1>
        <p className="text-foreground font-mono text-lg md:text-xl max-w-xl mb-2">
          Ethical Hacking. Code. That's it.
        </p>
        <p className="text-muted-foreground font-mono text-sm max-w-md mb-8">
          We find vulnerabilities. We write tools. No fluff.
        </p>
        <button
          onClick={onJoinClick}
          className="border border-primary bg-primary/10 text-primary font-mono px-8 py-3 text-sm uppercase tracking-wider hover:bg-primary hover:text-primary-foreground transition-all duration-200 animate-pulse-glow"
        >
          {'>'} Join Us_
        </button>
      </div>
    </section>
  );
};

export default HeroBanner;
