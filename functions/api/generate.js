const MODEL = "@cf/black-forest-labs/flux-1-schnell";
const MAX_PROMPT_LENGTH = 1500;

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store"
    }
  });
}

export async function onRequestPost({ request, env }) {
  if (!env.AI || typeof env.AI.run !== "function") {
    return json({ error: "Image generation is not configured yet. Add the Workers AI binding named AI in Cloudflare Pages settings, then redeploy." }, 503);
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
    return json({ error: `Your prompt is too long. Keep it under ${MAX_PROMPT_LENGTH} characters.` }, 400);
  }

  try {
    const result = await env.AI.run(MODEL, {
      prompt,
      steps: 4
    });

    if (!result || typeof result.image !== "string" || !result.image) {
      return json({ error: "The image model did not return an image. Please try another prompt." }, 502);
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
    // Do not return provider details, account identifiers, or secrets to visitors.
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
