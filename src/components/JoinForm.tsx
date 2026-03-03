import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";

const joinSchema = z.object({
  name: z.string().trim().min(1, "Name required").max(100),
  skills: z.string().trim().min(1, "List at least one skill").max(500),
  bestSkill: z.string().trim().min(1, "Tell us your best skill").max(200),
});

const JoinForm = ({ onClose }: { onClose: () => void }) => {
  const [name, setName] = useState("");
  const [skills, setSkills] = useState("");
  const [bestSkill, setBestSkill] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = joinSchema.safeParse({ name, skills, bestSkill });
    if (!result.success) {
      toast.error(result.error.errors[0].message);
      return;
    }

    setLoading(true);
    try {
      const skillsArray = skills.split(",").map((s) => s.trim()).filter(Boolean);
      
      const { error } = await supabase.functions.invoke("submit-application", {
        body: { name: result.data.name, skills: skillsArray, bestSkill: result.data.bestSkill },
      });

      if (error) throw error;

      toast.success("Application sent. We'll review it.");
      onClose();
    } catch {
      toast.error("Failed to submit. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-sm px-4">
      <div className="w-full max-w-md border border-border bg-card p-6 border-glow">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-xl font-bold text-primary text-glow">
            $ ./join.sh
          </h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground font-mono text-sm"
          >
            [x]
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-mono text-muted-foreground block mb-1">
              name:
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-secondary border border-border text-foreground font-mono text-sm px-3 py-2 focus:outline-none focus:border-primary"
              placeholder="your handle"
              maxLength={100}
            />
          </div>

          <div>
            <label className="text-xs font-mono text-muted-foreground block mb-1">
              skills (comma separated):
            </label>
            <input
              type="text"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              className="w-full bg-secondary border border-border text-foreground font-mono text-sm px-3 py-2 focus:outline-none focus:border-primary"
              placeholder="web hacking, python, reverse engineering"
              maxLength={500}
            />
          </div>

          <div>
            <label className="text-xs font-mono text-muted-foreground block mb-1">
              what do you do best?
            </label>
            <textarea
              value={bestSkill}
              onChange={(e) => setBestSkill(e.target.value)}
              rows={3}
              className="w-full bg-secondary border border-border text-foreground font-mono text-sm px-3 py-2 focus:outline-none focus:border-primary resize-none"
              placeholder="i find XSS in my sleep"
              maxLength={200}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full border border-primary bg-primary/10 text-primary font-mono px-4 py-2 text-sm uppercase tracking-wider hover:bg-primary hover:text-primary-foreground transition-all duration-200 disabled:opacity-50"
          >
            {loading ? "submitting..." : "> submit_application"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default JoinForm;
