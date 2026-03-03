import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const AcceptMember = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [name, setName] = useState("");

  useEffect(() => {
    const accept = async () => {
      const memberId = searchParams.get("id");
      const token = searchParams.get("token");

      if (!memberId || !token) {
        setStatus("error");
        return;
      }

      try {
        const { error, data } = await supabase.functions.invoke("accept-member", {
          body: { memberId, token },
        });

        if (error) throw error;
        setName(data?.name || "Member");
        setStatus("success");
      } catch {
        setStatus("error");
      }
    };

    accept();
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="border border-border bg-card p-8 border-glow max-w-md w-full text-center">
        {status === "loading" && (
          <p className="text-foreground font-mono">Processing...</p>
        )}
        {status === "success" && (
          <>
            <p className="text-primary text-glow font-display text-2xl font-bold mb-2">
              Member Accepted
            </p>
            <p className="text-foreground font-mono text-sm">
              {name} has been added to the team.
            </p>
          </>
        )}
        {status === "error" && (
          <>
            <p className="text-destructive font-display text-2xl font-bold mb-2">
              Error
            </p>
            <p className="text-muted-foreground font-mono text-sm">
              Invalid or expired link.
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default AcceptMember;
