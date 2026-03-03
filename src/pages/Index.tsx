import { useState } from "react";
import HeroBanner from "@/components/HeroBanner";
import WhatWeDo from "@/components/WhatWeDo";
import MemberBoard from "@/components/MemberBoard";
import JoinForm from "@/components/JoinForm";

const Index = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <HeroBanner onJoinClick={() => setShowForm(true)} />
      <WhatWeDo />
      <MemberBoard />

      <footer className="border-t border-border py-6 text-center">
        <p className="text-muted-foreground font-mono text-xs">
          SECTOR_9 © {new Date().getFullYear()} // hack responsibly
        </p>
      </footer>

      {showForm && <JoinForm onClose={() => setShowForm(false)} />}
    </div>
  );
};

export default Index;
