import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const ADMIN_EMAIL = "ak9499348@gmail.com";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, skills, bestSkill } = await req.json();

    if (!name || !skills || !bestSkill) {
      return new Response(JSON.stringify({ error: "Missing fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const resendApiKey = Deno.env.get("RESEND_API_KEY");

    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // Generate accept token
    const token = crypto.randomUUID();

    // Insert as pending member
    const { data: member, error: insertError } = await supabase
      .from("members")
      .insert({
        name,
        skills,
        best_skill: `${bestSkill}||TOKEN:${token}`,
        status: "pending",
      })
      .select("id")
      .single();

    if (insertError) throw insertError;

    // Build accept URL from origin header
    const origin = req.headers.get("origin") || "https://id-preview--5359a541-0d96-4f28-864d-28ecd68df7e2.lovable.app";
    const acceptUrl = `${origin}/accept?id=${member.id}&token=${token}`;

    // Send email via Resend
    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "SECTOR_9 <onboarding@resend.dev>",
        to: [ADMIN_EMAIL],
        subject: `New Application: ${name}`,
        html: `
          <div style="font-family: monospace; background: #0a0a0a; color: #00cc00; padding: 30px; border: 1px solid #003300;">
            <h1 style="color: #00ff00; font-size: 20px;">// NEW APPLICATION — SECTOR_9</h1>
            <hr style="border-color: #003300;" />
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Skills:</strong> ${skills.join(", ")}</p>
            <p><strong>Best At:</strong> ${bestSkill}</p>
            <hr style="border-color: #003300;" />
            <p style="margin-top: 20px;">
              <a href="${acceptUrl}" style="display: inline-block; background: #00cc00; color: #000; padding: 12px 24px; text-decoration: none; font-weight: bold; font-family: monospace; letter-spacing: 2px;">
                &gt; ACCEPT MEMBER
              </a>
            </p>
            <p style="color: #666; font-size: 12px; margin-top: 20px;">
              Click above to add this person to the team.
            </p>
          </div>
        `,
      }),
    });

    const emailResult = await emailResponse.json();

    if (!emailResponse.ok) {
      console.error("Resend error:", emailResult);
      // Still return success since application was saved
    }

    return new Response(
      JSON.stringify({ success: true, message: "Application submitted" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("Error:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
