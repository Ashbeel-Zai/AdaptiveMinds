import { Shield, Code } from "lucide-react";

const WhatWeDo = () => {
  return (
    <section className="py-16 px-4 max-w-4xl mx-auto">
      <h2 className="font-display text-2xl font-bold text-primary text-glow mb-8 text-center">
        $ cat /what-we-do
      </h2>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="border border-border bg-card p-6 border-glow">
          <Shield className="w-8 h-8 text-primary mb-3" />
          <h3 className="font-display text-lg font-semibold text-foreground mb-2">
            Ethical Hacking
          </h3>
          <p className="text-muted-foreground text-sm font-mono leading-relaxed">
            Bug bounties, penetration testing, vulnerability research. We break things so others can fix them.
          </p>
        </div>
        <div className="border border-border bg-card p-6 border-glow">
          <Code className="w-8 h-8 text-primary mb-3" />
          <h3 className="font-display text-lg font-semibold text-foreground mb-2">
            Coding
          </h3>
          <p className="text-muted-foreground text-sm font-mono leading-relaxed">
            Security tools, automation scripts, exploit PoCs. We build what we need.
          </p>
        </div>
      </div>
    </section>
  );
};

export default WhatWeDo;
