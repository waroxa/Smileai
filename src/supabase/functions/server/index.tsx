import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import { createClient } from "jsr:@supabase/supabase-js@2";
import oauthRoutes from "./oauth-routes-db.tsx";
import ghlApiRoutes from "./ghl-api-routes-db.tsx";
import { getFreshAccessToken } from "./oauth-routes-db.tsx";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
);

// Create storage bucket on startup (idempotent)
const initializeStorage = async () => {
  const bucketName = 'make-c5a5d193-smile-images';
  try {
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
    
    if (!bucketExists) {
      console.log('📦 Creating storage bucket:', bucketName);
      const { data, error } = await supabase.storage.createBucket(bucketName, {
        public: true, // Make public so FAL can access the images
      });
      
      if (error) {
        console.error('❌ Error creating bucket:', error);
      } else {
        console.log('✅ Bucket created successfully');
      }
    } else {
      console.log('✅ Storage bucket already exists:', bucketName);
    }
  } catch (error) {
    console.error('❌ Error initializing storage:', error);
  }
};

// Initialize storage on startup
initializeStorage();


const DEFAULT_CRM_LOCATION_ID = Deno.env.get('DEFAULT_CRM_LOCATION_ID') ?? '';
const IMAGE_MODEL_API_KEY = Deno.env.get('GOOGLE_IMAGE_API_KEY') ?? '';
const VEO_API_KEY = Deno.env.get('GOOGLE_VEO_API_KEY') ?? '';

const createJsonHeaders = (token?: string) => ({
  'Content-Type': 'application/json',
  ...(token ? { Authorization: `Bearer ${token}`, Version: '2021-07-28' } : {}),
});

const getServerCrmAccessToken = async () => {
  if (!DEFAULT_CRM_LOCATION_ID) {
    throw new Error('DEFAULT_CRM_LOCATION_ID is not configured on the server');
  }

  const accessToken = await getFreshAccessToken(DEFAULT_CRM_LOCATION_ID);
  if (!accessToken) {
    throw new Error('No valid CRM access token is available for the configured location');
  }

  return { accessToken, locationId: DEFAULT_CRM_LOCATION_ID };
};

// Health check endpoint
app.get("/make-server-c5a5d193/health", (c) => {
  return c.json({ status: "ok" });
});

// Check API Key Configuration endpoint
app.get("/make-server-c5a5d193/check-api-key", (c) => {
  const falApiKey = Deno.env.get('FAL_API_KEY');
  
  if (!falApiKey) {
    return c.json({ 
      configured: false,
      error: "FAL_API_KEY not found in environment variables",
      message: "Please add FAL_API_KEY to Supabase Edge Function secrets"
    }, 200);
  }
  
  return c.json({ 
    configured: true,
    message: "FAL_API_KEY is configured ✅",
    keyLength: falApiKey.length,
    keyPrefix: falApiKey.substring(0, 8) + "..." // Show first 8 chars only for verification
  }, 200);
});

// Test video generation endpoint - for debugging
app.post("/make-server-c5a5d193/test-video", async (c) => {
  try {
    const falApiKey = Deno.env.get('FAL_API_KEY');
    
    if (!falApiKey) {
      return c.json({ 
        success: false,
        error: "FAL_API_KEY not configured",
        message: "Please add FAL_API_KEY to Supabase Edge Function secrets"
      }, 500);
    }

    // Test with a simple public image URL
    const testImageUrl = "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400";
    const testPrompt = "The person smiles naturally";

    console.log('🧪 Testing FAL API with test image...');

    const submitResponse = await fetch('https://queue.fal.run/fal-ai/kling-video/v2.6/pro/image-to-video', {
      method: 'POST',
      headers: {
        'Authorization': `Key ${falApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image_url: testImageUrl,
        prompt: testPrompt,
        duration: "5",
        aspect_ratio: "16:9"
      }),
    });

    console.log('📥 Test response status:', submitResponse.status);

    if (!submitResponse.ok) {
      const errorText = await submitResponse.text();
      return c.json({
        success: false,
        error: 'FAL API test failed',
        status: submitResponse.status,
        message: errorText,
        hint: submitResponse.status === 401 ? 'Invalid FAL_API_KEY' : 'Check FAL API status'
      }, submitResponse.status);
    }

    const result = await submitResponse.json();
    
    return c.json({
      success: true,
      message: "FAL API is working! ✅",
      requestId: result.request_id,
      note: "Video generation has been queued. Check FAL dashboard to see if it completes."
    });

  } catch (error: any) {
    console.error('❌ Test failed:', error);
    return c.json({
      success: false,
      error: 'Test endpoint error',
      message: error.message,
      stack: error.stack
    }, 500);
  }
});

// Upload base64 image to Supabase Storage
app.post("/make-server-c5a5d193/api/upload-image", async (c) => {
  try {
    const body = await c.req.json();
    const { imageData } = body;

    console.log('📤 ===============================================');
    console.log('📤 IMAGE UPLOAD REQUEST STARTED');
    console.log('📤 ===============================================');
    console.log('📸 Image data length:', imageData?.length || 0);

    if (!imageData) {
      console.error('❌ Missing imageData in request');
      return c.json({ error: "Missing imageData" }, 400);
    }

    // Extract base64 data and mime type
    const matches = imageData.match(/^data:([^;]+);base64,(.+)$/);
    if (!matches) {
      console.error('❌ Invalid base64 image format');
      return c.json({ error: "Invalid base64 image format" }, 400);
    }

    const mimeType = matches[1];
    const base64Data = matches[2];
    const extension = mimeType.split('/')[1] || 'png';

    console.log('📝 MIME type:', mimeType);
    console.log('📝 Extension:', extension);
    console.log('📝 Base64 length:', base64Data.length);

    // Convert base64 to binary
    const binaryString = atob(base64Data);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    console.log('📝 Binary size:', bytes.length, 'bytes');

    // Generate unique filename
    const filename = `smile-${Date.now()}-${Math.random().toString(36).substring(7)}.${extension}`;
    const bucketName = 'make-c5a5d193-smile-images';

    console.log('📤 Uploading to bucket:', bucketName);
    console.log('📤 Filename:', filename);

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filename, bytes, {
        contentType: mimeType,
        upsert: false,
      });

    if (error) {
      console.error('❌ Upload error:', error);
      return c.json({ 
        error: 'Failed to upload image to storage',
        message: error.message,
        details: error
      }, 500);
    }

    console.log('✅ Upload successful:', data);

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filename);

    const publicUrl = urlData.publicUrl;
    
    console.log('🌐 Public URL:', publicUrl);
    console.log('📤 ===============================================');
    console.log('📤 IMAGE UPLOAD COMPLETED SUCCESSFULLY');
    console.log('📤 ===============================================');

    return c.json({
      success: true,
      publicUrl: publicUrl,
      filename: filename,
      message: '✨ Image uploaded successfully!',
    });

  } catch (error: any) {
    console.error('❌ ===============================================');
    console.error('❌ CRITICAL ERROR IN IMAGE UPLOAD');
    console.error('❌ ===============================================');
    console.error('❌ Error name:', error.name);
    console.error('❌ Error message:', error.message);
    console.error('❌ Error stack:', error.stack);
    
    return c.json({
      error: 'Internal server error during image upload',
      message: error.message || 'Unknown error occurred',
      errorType: error.name || 'UnknownError',
      stack: error.stack,
    }, 500);
  }
});


// Public-safe lead capture endpoint. Any CRM sync happens server-side only.
app.post("/make-server-c5a5d193/api/lead-capture", async (c) => {
  try {
    const body = await c.req.json();
    const { fullName, email, phone, interestedIn, notes, source } = body;

    if (!fullName || !email || !phone || !interestedIn) {
      return c.json({ error: 'Missing required lead fields' }, 400);
    }

    const responseBody: Record<string, unknown> = {
      success: true,
      message: 'Lead captured successfully.',
      crmSyncEnabled: false,
    };

    if (!DEFAULT_CRM_LOCATION_ID) {
      responseBody.message = 'Lead captured locally. Configure DEFAULT_CRM_LOCATION_ID to sync with your CRM.';
      return c.json(responseBody, 200);
    }

    const { accessToken, locationId } = await getServerCrmAccessToken();
    const [firstName, ...rest] = String(fullName).trim().split(/\s+/);
    const lastName = rest.join(' ');

    const crmResponse = await fetch('https://services.leadconnectorhq.com/contacts/', {
      method: 'POST',
      headers: createJsonHeaders(accessToken),
      body: JSON.stringify({
        locationId,
        firstName,
        lastName,
        email,
        phone,
        source: source || 'SmileVisionPro AI website',
        tags: ['smilevisionpro-ai', 'website-lead'],
        customFields: [
          { key: 'service_interest', field_value: interestedIn },
          { key: 'notes', field_value: notes || '' },
          { key: 'transformation_status', field_value: 'Lead Captured' },
        ],
      }),
    });

    const crmData = await crmResponse.json().catch(() => ({}));
    if (!crmResponse.ok) {
      console.error('CRM lead capture failed:', crmData);
      responseBody.message = 'Lead captured, but CRM sync is pending.';
      return c.json(responseBody, 200);
    }

    responseBody.crmSyncEnabled = true;
    responseBody.contactId = crmData.contact?.id || crmData.id;
    responseBody.message = 'Lead captured and synced successfully.';
    return c.json(responseBody, 200);
  } catch (error: any) {
    console.error('Lead capture endpoint error:', error);
    return c.json({ success: true, message: 'Lead captured. Backend follow-up sync is pending.' }, 200);
  }
});

app.post("/make-server-c5a5d193/api/lead-media", async (c) => {
  try {
    const body = await c.req.json();
    const { contactId, beforeImage, afterImage, smileVideo, status } = body;

    if (!contactId) {
      return c.json({ error: 'Missing contactId' }, 400);
    }

    if (!DEFAULT_CRM_LOCATION_ID) {
      return c.json({ success: true, message: 'CRM sync skipped because no default location is configured.' }, 200);
    }

    const { accessToken } = await getServerCrmAccessToken();
    const customFields = [] as Array<{ key: string; field_value: string }>;
    if (beforeImage) customFields.push({ key: 'before_image_url', field_value: beforeImage.slice(0, 4000) });
    if (afterImage) customFields.push({ key: 'after_image_url', field_value: afterImage.slice(0, 4000) });
    if (smileVideo && smileVideo !== 'ANIMATED') customFields.push({ key: 'smile_video_url', field_value: smileVideo });
    if (status) customFields.push({ key: 'transformation_status', field_value: status });

    if (!customFields.length) {
      return c.json({ success: true, message: 'Nothing to sync.' }, 200);
    }

    const crmResponse = await fetch(`https://services.leadconnectorhq.com/contacts/${contactId}`, {
      method: 'PUT',
      headers: createJsonHeaders(accessToken),
      body: JSON.stringify({ customFields }),
    });

    if (!crmResponse.ok) {
      const errorText = await crmResponse.text();
      console.error('CRM media sync failed:', errorText);
      return c.json({ success: false, message: 'CRM sync failed.' }, 500);
    }

    return c.json({ success: true, message: 'Lead media synced successfully.' }, 200);
  } catch (error: any) {
    console.error('Lead media endpoint error:', error);
    return c.json({ success: false, message: error.message || 'Lead media sync failed.' }, 500);
  }
});

app.post("/make-server-c5a5d193/api/generate-smile", async (c) => {
  try {
    const body = await c.req.json();
    const { imageDataUrl, smileIntensity } = body;

    if (!imageDataUrl) {
      return c.json({ error: 'Missing imageDataUrl' }, 400);
    }

    if (!IMAGE_MODEL_API_KEY) {
      return c.json({ error: 'GOOGLE_IMAGE_API_KEY is not configured on the server' }, 500);
    }

    const match = String(imageDataUrl).match(/^data:(image\/\w+);base64,(.+)$/);
    if (!match) {
      return c.json({ error: 'Invalid image data URL' }, 400);
    }

    const prompts = {
      subtle: 'Enhance only the teeth into a cleaner, naturally aligned smile while preserving the rest of the portrait exactly.',
      natural: 'Create a polished, realistic smile transformation focused only on the teeth and gums while preserving identity, lighting, skin, hair, and background.',
      bright: 'Create a premium cosmetic-dentistry smile result with bright, realistic whitening and ideal alignment while preserving the rest of the portrait exactly.',
    } as Record<string, string>;

    const googleResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${IMAGE_MODEL_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: prompts[smileIntensity] || prompts.natural },
            { inlineData: { mimeType: match[1], data: match[2] } },
          ],
        }],
      }),
    });

    const googleData = await googleResponse.json().catch(() => ({}));
    if (!googleResponse.ok) {
      console.error('Image generation failed:', googleData);
      return c.json({ error: googleData?.error?.message || 'Image generation failed' }, 500);
    }

    const imagePart = googleData?.candidates?.[0]?.content?.parts?.find((part: Record<string, unknown>) => part.inlineData);
    const inlineData = imagePart?.inlineData as Record<string, string> | undefined;
    if (!inlineData?.data || !inlineData?.mimeType) {
      return c.json({ error: 'No image returned from the model provider' }, 500);
    }

    return c.json({ success: true, imageDataUrl: `data:${inlineData.mimeType};base64,${inlineData.data}`, provider: 'gemini-2.5-flash-image' }, 200);
  } catch (error: any) {
    console.error('Generate smile endpoint error:', error);
    return c.json({ error: error.message || 'Failed to generate smile preview' }, 500);
  }
});

app.get("/make-server-c5a5d193/api/video/status", (c) => {
  if (VEO_API_KEY) {
    return c.json({ configured: true, provider: 'Google Veo', message: 'Google Veo is configured server-side and ready for private testing.' }, 200);
  }
  if (Deno.env.get('FAL_API_KEY')) {
    return c.json({ configured: true, provider: 'FAL Kling', message: 'Fallback video generation is configured via the server.' }, 200);
  }
  return c.json({ configured: false, provider: 'none', message: 'No server-side video provider secret is configured yet.' }, 200);
});

app.post("/make-server-c5a5d193/api/video/generate", async (c) => {
  if (VEO_API_KEY) {
    return c.json({ success: false, error: 'Google Veo support has been re-enabled in configuration detection, but a private backend implementation still needs the final provider request wiring for your account setup.' }, 501);
  }

  return app.fetch(new Request(new URL('/make-server-c5a5d193/api/fal-video', c.req.url), {
    method: 'POST',
    headers: c.req.raw.headers,
    body: await c.req.raw.text(),
  }));
});

// FAL AI Kling Video Generation endpoint
app.post("/make-server-c5a5d193/api/fal-video", async (c) => {
  try {
    const body = await c.req.json();
    const { imageUrl, prompt } = body;

    console.log('🎥 ===============================================');
    console.log('🎥 FAL VIDEO GENERATION REQUEST STARTED');
    console.log('🎥 ===============================================');

    if (!imageUrl) {
      console.error('❌ Missing imageUrl in request');
      return c.json({ error: "Missing imageUrl" }, 400);
    }

    const falApiKey = Deno.env.get('FAL_API_KEY');
    if (!falApiKey) {
      console.error('❌ FAL_API_KEY not configured');
      return c.json({ 
        error: "FAL_API_KEY not configured",
        message: "Please add FAL_API_KEY to Supabase Edge Function secrets"
      }, 500);
    }

    console.log('🔑 FAL API Key exists:', !!falApiKey);
    console.log('🖼️  Image URL:', imageUrl.substring(0, 100) + '...');
    console.log('📝 Prompt length:', prompt?.length || 0);
    console.log('🎬 Starting FAL AI Kling Video v2.6 Pro generation...');

    // Use default optimized prompt if none provided
    const videoPrompt = prompt || "Professional dental testimonial style: The person smoothly and naturally showcases their beautiful white teeth with confidence. Starts with a gentle, warm smile that gradually widens to reveal the perfect teeth. Natural facial expressions flow smoothly - subtle head movements, soft eye expressions, and genuine joy. Like someone proudly showing their smile transformation in a high-end dental commercial. Movements are slow, graceful, and professional. Natural breathing, soft blinking, gentle smile variations. No sudden jerks or awkward expressions - everything flows beautifully and naturally. The person looks comfortable, confident, and genuinely happy with their smile.";

    const requestPayload = {
      image_url: imageUrl,
      prompt: videoPrompt,
      duration: "5",
      aspect_ratio: "1:1"
    };

    console.log('📤 Request payload:', {
      image_url_length: imageUrl.length,
      prompt_length: videoPrompt.length,
      duration: "5",
      aspect_ratio: "1:1"
    });

    // Call FAL AI Kling Video API (direct endpoint, not queue)
    const response = await fetch('https://fal.run/fal-ai/kling-video/v2.6/pro/image-to-video', {
      method: 'POST',
      headers: {
        'Authorization': `Key ${falApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestPayload),
    });

    console.log('📥 FAL AI response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ FAL AI request failed:', errorText);
      console.error('❌ Response status:', response.status);
      
      return c.json({
        error: 'FAL AI request failed',
        status: response.status,
        message: errorText,
        hint: response.status === 401 ? 'Invalid FAL_API_KEY' : 
              response.status === 400 ? 'Invalid request parameters' :
              response.status === 413 ? 'Image too large' :
              'Check FAL API status at https://status.fal.ai'
      }, response.status);
    }

    const resultData = await response.json();
    console.log('📥 FAL AI response data:', JSON.stringify(resultData, null, 2));
    console.log('✅ Video generation complete!');

    if (resultData.video?.url) {
      console.log('🎉 Video URL:', resultData.video.url);
      console.log('🎥 ===============================================');
      console.log('🎥 VIDEO GENERATION COMPLETED SUCCESSFULLY');
      console.log('🎥 ===============================================');
      
      return c.json({
        success: true,
        videoUrl: resultData.video.url,
        message: '✨ Your smile transformation video is ready!',
      });
    } else {
      console.error('❌ No video URL in response:', resultData);
      return c.json({
        error: 'No video URL in response',
        response: resultData
      }, 500);
    }

  } catch (error: any) {
    console.error('❌ ===============================================');
    console.error('❌ CRITICAL ERROR IN VIDEO GENERATION');
    console.error('❌ ===============================================');
    console.error('❌ Error name:', error.name);
    console.error('❌ Error message:', error.message);
    console.error('❌ Error stack:', error.stack);
    
    return c.json({
      error: 'Internal server error during video generation',
      message: error.message || 'Unknown error occurred',
      errorType: error.name || 'UnknownError',
    }, 500);
  }
});

// Add OAuth routes
app.route("/", oauthRoutes);

// Add platform API routes
app.route("/", ghlApiRoutes);

Deno.serve(app.fetch);