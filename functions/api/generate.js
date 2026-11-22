// RANTEX AI wallpaper endpoint — Cloudflare Pages Function.
// Uses the Cloudflare Workers AI binding. No API key belongs in browser code.

const MODEL = "@cf/black-forest-labs/flux-1-schnell";
const MAX_PROMPT_LENGTH = 900;

function json(data, status = 200) {
  return Response.json(data, {
    status,
    headers: { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" }
  });
}

export async function onRequestPost({ request, env }) {
  const origin = request.headers.get("Origin");
  const siteOrigin = new URL(request.url).origin;
  if (origin && origin !== siteOrigin) {
    return json({ error: "This request is not allowed." }, 403);
  }

  if (!env.AI || typeof env.AI.run !== "function") {
    return json({ error: "AI is not connected yet. Add a Workers AI binding named AI in Cloudflare Pages settings, then redeploy." }, 503);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Please send a valid JSON request." }, 400);
  }

  const prompt = typeof body?.prompt === "string" ? body.prompt.trim() : "";
  if (prompt.length < 8) {
    return json({ error: "Please enter a more detailed wallpaper prompt (at least 8 characters)." }, 400);
  }
  if (prompt.length > MAX_PROMPT_LENGTH) {
    return json({ error: `Please keep your prompt under ${MAX_PROMPT_LENGTH} characters.` }, 400);
  }

  try {
    const result = await env.AI.run(MODEL, {
      prompt: `Create an original, high-quality wallpaper based on this idea: ${prompt}. Detailed composition, polished lighting, crisp visual quality, no text, no watermark.`,
      steps: 4
    });

    if (!result || typeof result.image !== "string" || !result.image) {
      return json({ error: "The image model returned no image. Please try another prompt." }, 502);
    }

    const binary = atob(result.image);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);

    return new Response(bytes, {
      status: 200,
      headers: {
        "Content-Type": "image/jpeg",
        "Content-Disposition": 'inline; filename="rantex-wallpaper.jpg"',
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff"
      }
    });
  } catch (error) {
    console.error("RANTEX image generation failed:", error?.message || "Unknown error");
    return json({ error: "Image generation failed. Check that Workers AI is enabled for this Pages project and try again." }, 502);
  }
}

export async function onRequest(context) {
  if (context.request.method !== "POST") {
    return new Response("Method Not Allowed", {
      status: 405,
      headers: { "Allow": "POST", "Cache-Control": "no-store" }
    });
  }
  return onRequestPost(context);
}
