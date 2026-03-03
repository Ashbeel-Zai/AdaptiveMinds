import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type Member = {
  id: string;
  name: string;
  skills: string[];
  best_skill: string | null;
};

const MemberBoard = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [count, setCount] = useState(0);

  const fetchMembers = async () => {
    const { data } = await supabase
      .from("members")
      .select("id, name, skills, best_skill")
      .eq("status", "approved");
    if (data) {
      setMembers(data);
      setCount(data.length);
    }
  };

  useEffect(() => {
    fetchMembers();

    const channel = supabase
      .channel("members-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "members" },
        () => fetchMembers()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <section className="py-16 px-4 max-w-4xl mx-auto">
      <h2 className="font-display text-2xl font-bold text-primary text-glow mb-2 text-center">
        $ ls /team
      </h2>
      <div className="text-center mb-8">
        <span className="font-mono text-sm text-muted-foreground">
          active_members: <span className="text-primary font-bold text-lg">{count}</span>
        </span>
      </div>

      {members.length === 0 ? (
        <p className="text-center text-muted-foreground font-mono text-sm">
          // no approved members yet. be the first.
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {members.map((member) => (
            <div
              key={member.id}
              className="border border-border bg-card p-4 border-glow"
            >
              <p className="font-display text-lg font-semibold text-foreground">
                {member.name}
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                {member.skills.map((skill) => (
                  <span
                    key={skill}
                    className="text-xs font-mono border border-border bg-secondary px-2 py-0.5 text-muted-foreground"
                  >
                    {skill}
                  </span>
                ))}
              </div>
              {member.best_skill && (
                <p className="mt-2 text-xs font-mono text-primary">
                  best_at: {member.best_skill}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default MemberBoard;
