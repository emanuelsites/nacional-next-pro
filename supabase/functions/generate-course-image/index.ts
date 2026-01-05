import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { courseTitle, courseCategory, courseId } = await req.json();
    
    if (!courseTitle || !courseId) {
      return new Response(
        JSON.stringify({ error: "courseTitle and courseId are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Generate prompt based on course info with specific context
    let contextualPrompt = '';
    const titleLower = courseTitle.toLowerCase();
    
    if (titleLower.includes('licitaç') || titleLower.includes('contrato') || titleLower.includes('pregoeir')) {
      contextualPrompt = 'Government officials in formal meeting room reviewing bidding documents and contracts, official procurement process, digital screens showing analytics, Brazilian government office setting, professional atmosphere';
    } else if (titleLower.includes('patrimoni') || titleLower.includes('almoxarifado') || titleLower.includes('desfazimento')) {
      contextualPrompt = 'Modern warehouse with organized inventory shelves, professionals managing asset control on computers, property management system, clean corporate storage facility';
    } else if (titleLower.includes('convênio') || titleLower.includes('siconv')) {
      contextualPrompt = 'Government officials reviewing partnership agreements and federal transfers, collaborative meeting about public agreements, formal office with documents and laptops';
    } else if (titleLower.includes('orçament') || titleLower.includes('contabil')) {
      contextualPrompt = 'Finance professionals analyzing budget spreadsheets and accounting reports, public sector financial planning, modern office with charts and graphs on screens';
    } else if (titleLower.includes('pessoal') || titleLower.includes('rh') || titleLower.includes('recursos humanos')) {
      contextualPrompt = 'HR professionals in training session about personnel legislation, employment law seminar, corporate training room with diverse professionals';
    } else {
      contextualPrompt = 'Professional corporate training seminar for public administration, government employees in modern training center, business presentation setting';
    }
    
    const prompt = `${contextualPrompt}. High quality corporate photography, professional lighting, 16:9 aspect ratio, photorealistic, no text overlay. Ultra high resolution.`;

    console.log("Generating image with prompt:", prompt);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image-preview",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        modalities: ["image", "text"],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required. Please add credits to your workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: "Failed to generate image" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    console.log("AI response received");

    const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    
    if (!imageUrl) {
      console.error("No image in response:", JSON.stringify(data));
      return new Response(
        JSON.stringify({ error: "No image generated" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Upload image to Supabase Storage
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Convert base64 to blob
    const base64Data = imageUrl.replace(/^data:image\/\w+;base64,/, "");
    const imageBuffer = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
    
    const fileName = `course-images/${courseId}-${Date.now()}.png`;
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("courses")
      .upload(fileName, imageBuffer, {
        contentType: "image/png",
        upsert: true,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      // If storage bucket doesn't exist, return base64 directly
      return new Response(
        JSON.stringify({ imageUrl }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from("courses")
      .getPublicUrl(fileName);

    const publicUrl = publicUrlData.publicUrl;

    // Update course with new image URL
    const { error: updateError } = await supabase
      .from("courses")
      .update({ image_url: publicUrl })
      .eq("id", courseId);

    if (updateError) {
      console.error("Update error:", updateError);
    }

    return new Response(
      JSON.stringify({ imageUrl: publicUrl, success: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("Error:", error);
    const message = error instanceof Error ? error.message : "An unexpected error occurred";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
