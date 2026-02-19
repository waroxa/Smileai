import { Hono } from "npm:hono";
import { createClient } from "jsr:@supabase/supabase-js@2";
import { getFreshAccessToken } from "./oauth-routes-db.tsx";

const app = new Hono();

const GHL_API_BASE = 'https://services.leadconnectorhq.com';
const API_VERSION = '2021-07-28';

// Initialize Supabase client
const getSupabase = () => {
  return createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  );
};

// Helper: Make authenticated GHL API request
const makeGHLRequest = async (
  locationId: string,
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> => {
  const accessToken = await getFreshAccessToken(locationId);
  
  if (!accessToken) {
    throw new Error('No valid access token available');
  }
  
  const url = `${GHL_API_BASE}${endpoint}`;
  
  return fetch(url, {
    ...options,
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Version': API_VERSION,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
};

// Log action in audit table
const logAudit = async (locationId: string, action: string, details: any, userId: string | null = null) => {
  try {
    const supabase = getSupabase();
    await supabase.from('ghl_audit_log').insert({
      location_id: locationId,
      action,
      details,
      user_id: userId,
    });
  } catch (error) {
    console.error('Failed to log audit:', error);
  }
};

// GET /ghl/forms - List forms in location
app.get("/make-server-c5a5d193/ghl/forms", async (c) => {
  try {
    const locationId = c.req.query('locationId');
    
    if (!locationId) {
      return c.json({ error: 'Missing locationId' }, 400);
    }
    
    console.log('📋 Fetching forms for location:', locationId);
    
    const response = await makeGHLRequest(
      locationId,
      `/locations/${locationId}/forms`
    );
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Failed to fetch forms:', errorText);
      return c.json({
        error: 'Failed to fetch forms',
        details: errorText,
      }, response.status);
    }
    
    const data = await response.json();
    
    console.log('✅ Forms fetched:', data.forms?.length || 0);
    
    return c.json({
      success: true,
      forms: data.forms || [],
    });
    
  } catch (error: any) {
    console.error('❌ Error fetching forms:', error);
    return c.json({
      error: 'Failed to fetch forms',
      message: error.message,
    }, 500);
  }
});

// POST /ghl/forms - Create or update form
app.post("/make-server-c5a5d193/ghl/forms", async (c) => {
  try {
    const body = await c.req.json();
    const { locationId, formData, formId } = body;
    
    if (!locationId || !formData) {
      return c.json({ error: 'Missing locationId or formData' }, 400);
    }
    
    console.log('📝 Creating/updating form for location:', locationId);
    console.log('   Form name:', formData.name);
    
    const endpoint = formId 
      ? `/locations/${locationId}/forms/${formId}`
      : `/locations/${locationId}/forms`;
    
    const method = formId ? 'PUT' : 'POST';
    
    const response = await makeGHLRequest(locationId, endpoint, {
      method,
      body: JSON.stringify(formData),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Failed to save form:', errorText);
      return c.json({
        error: 'Failed to save form',
        details: errorText,
      }, response.status);
    }
    
    const data = await response.json();
    
    // Log in audit
    await logAudit(locationId, formId ? 'form_updated' : 'form_created', {
      formId: data.form?.id || formId,
      formName: formData.name,
    });
    
    console.log('✅ Form saved:', data.form?.id);
    
    return c.json({
      success: true,
      form: data.form,
    });
    
  } catch (error: any) {
    console.error('❌ Error saving form:', error);
    return c.json({
      error: 'Failed to save form',
      message: error.message,
    }, 500);
  }
});

// GET /ghl/custom-fields - Get custom fields
app.get("/make-server-c5a5d193/ghl/custom-fields", async (c) => {
  try {
    const locationId = c.req.query('locationId');
    
    if (!locationId) {
      return c.json({ error: 'Missing locationId' }, 400);
    }
    
    console.log('🏷️  Fetching custom fields for location:', locationId);
    
    const response = await makeGHLRequest(
      locationId,
      `/locations/${locationId}/customFields`
    );
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Failed to fetch custom fields:', errorText);
      return c.json({
        error: 'Failed to fetch custom fields',
        details: errorText,
      }, response.status);
    }
    
    const data = await response.json();
    
    console.log('✅ Custom fields fetched:', data.customFields?.length || 0);
    
    return c.json({
      success: true,
      customFields: data.customFields || [],
    });
    
  } catch (error: any) {
    console.error('❌ Error fetching custom fields:', error);
    return c.json({
      error: 'Failed to fetch custom fields',
      message: error.message,
    }, 500);
  }
});

// POST /ghl/custom-fields - Create custom field
app.post("/make-server-c5a5d193/ghl/custom-fields", async (c) => {
  try {
    const body = await c.req.json();
    const { locationId, fieldData } = body;
    
    if (!locationId || !fieldData) {
      return c.json({ error: 'Missing locationId or fieldData' }, 400);
    }
    
    console.log('➕ Creating custom field for location:', locationId);
    console.log('   Field name:', fieldData.name);
    
    const response = await makeGHLRequest(
      locationId,
      `/locations/${locationId}/customFields`,
      {
        method: 'POST',
        body: JSON.stringify(fieldData),
      }
    );
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Failed to create custom field:', errorText);
      return c.json({
        error: 'Failed to create custom field',
        details: errorText,
      }, response.status);
    }
    
    const data = await response.json();
    
    // Log in audit
    await logAudit(locationId, 'custom_field_created', {
      fieldId: data.customField?.id,
      fieldName: fieldData.name,
    });
    
    console.log('✅ Custom field created:', data.customField?.id);
    
    return c.json({
      success: true,
      customField: data.customField,
    });
    
  } catch (error: any) {
    console.error('❌ Error creating custom field:', error);
    return c.json({
      error: 'Failed to create custom field',
      message: error.message,
    }, 500);
  }
});

// POST /ghl/videos - Save video metadata
app.post("/make-server-c5a5d193/ghl/videos", async (c) => {
  try {
    const body = await c.req.json();
    const { locationId, videoData } = body;
    
    if (!locationId || !videoData) {
      return c.json({ error: 'Missing locationId or videoData' }, 400);
    }
    
    console.log('🎥 Saving video metadata for location:', locationId);
    console.log('   Video URL:', videoData.url);
    console.log('   Title:', videoData.title);
    
    const supabase = getSupabase();
    
    // Save video metadata to custom values in GHL
    const customValueKey = `smile_video_${Date.now()}`;
    
    const customValueData = {
      key: customValueKey,
      value: JSON.stringify({
        url: videoData.url,
        title: videoData.title,
        tags: videoData.tags || [],
        workflowStep: videoData.workflowStep || 'transformation',
        contactId: videoData.contactId,
        createdAt: new Date().toISOString(),
        ...videoData,
      }),
    };
    
    let customValueId = null;
    
    try {
      const response = await makeGHLRequest(
        locationId,
        `/locations/${locationId}/customValues`,
        {
          method: 'POST',
          body: JSON.stringify(customValueData),
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        customValueId = data.id;
      }
    } catch (err) {
      console.warn('⚠️ Failed to save to GHL custom values:', err);
    }
    
    // Save to our database
    const { data: video, error } = await supabase
      .from('ghl_videos')
      .insert({
        location_id: locationId,
        contact_id: videoData.contactId,
        video_url: videoData.url,
        title: videoData.title,
        tags: videoData.tags || [],
        workflow_step: videoData.workflowStep || 'transformation',
        custom_value_id: customValueId,
        custom_value_key: customValueKey,
        metadata: videoData.metadata || {},
      })
      .select()
      .single();
    
    if (error) {
      console.error('❌ Failed to save video to database:', error);
      throw error;
    }
    
    // Log in audit
    await logAudit(locationId, 'video_saved', {
      videoUrl: videoData.url,
      title: videoData.title,
      videoId: video.id,
    });
    
    console.log('✅ Video metadata saved:', video.id);
    
    return c.json({
      success: true,
      videoId: video.id,
      customValueId,
    });
    
  } catch (error: any) {
    console.error('❌ Error saving video metadata:', error);
    return c.json({
      error: 'Failed to save video metadata',
      message: error.message,
    }, 500);
  }
});

// GET /ghl/videos - Get videos for location
app.get("/make-server-c5a5d193/ghl/videos", async (c) => {
  try {
    const locationId = c.req.query('locationId');
    
    if (!locationId) {
      return c.json({ error: 'Missing locationId' }, 400);
    }
    
    console.log('🎥 Fetching videos for location:', locationId);
    
    const supabase = getSupabase();
    
    const { data: videos, error } = await supabase
      .from('ghl_videos')
      .select('*')
      .eq('location_id', locationId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    console.log('✅ Videos fetched:', videos?.length || 0);
    
    return c.json({
      success: true,
      videos: videos || [],
    });
    
  } catch (error: any) {
    console.error('❌ Error fetching videos:', error);
    return c.json({
      error: 'Failed to fetch videos',
      message: error.message,
    }, 500);
  }
});

// GET /ghl/audit - Get audit log
app.get("/make-server-c5a5d193/ghl/audit", async (c) => {
  try {
    const locationId = c.req.query('locationId');
    const limit = parseInt(c.req.query('limit') || '20');
    
    if (!locationId) {
      return c.json({ error: 'Missing locationId' }, 400);
    }
    
    console.log('📊 Fetching audit log for location:', locationId);
    
    const supabase = getSupabase();
    
    const { data: entries, error } = await supabase
      .from('ghl_audit_log')
      .select('*')
      .eq('location_id', locationId)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    
    // Format for frontend
    const formattedEntries = (entries || []).map((entry: any) => ({
      locationId: entry.location_id,
      action: entry.action,
      details: entry.details,
      timestamp: new Date(entry.created_at).getTime(),
      user: entry.user_id || 'system',
    }));
    
    console.log('✅ Audit entries fetched:', formattedEntries.length);
    
    return c.json({
      success: true,
      entries: formattedEntries,
    });
    
  } catch (error: any) {
    console.error('❌ Error fetching audit log:', error);
    return c.json({
      error: 'Failed to fetch audit log',
      message: error.message,
    }, 500);
  }
});

// POST /ghl/setup-custom-fields - Setup required custom fields for SmileVision
app.post("/make-server-c5a5d193/ghl/setup-custom-fields", async (c) => {
  try {
    const body = await c.req.json();
    const { locationId } = body;
    
    if (!locationId) {
      return c.json({ error: 'Missing locationId' }, 400);
    }
    
    console.log('⚙️ Setting up custom fields for SmileVision Pro...');
    
    const requiredFields = [
      {
        name: 'Smile Before Image',
        dataType: 'TEXT',
        fieldKey: 'smile_before_image',
      },
      {
        name: 'Smile After Image',
        dataType: 'TEXT',
        fieldKey: 'smile_after_image',
      },
      {
        name: 'Smile Video URL',
        dataType: 'TEXT',
        fieldKey: 'smile_video_url',
      },
      {
        name: 'Smile Intensity',
        dataType: 'TEXT',
        fieldKey: 'smile_intensity',
        options: ['subtle', 'natural', 'bright'],
      },
      {
        name: 'Transformation Date',
        dataType: 'TEXT',
        fieldKey: 'transformation_date',
      },
    ];
    
    const createdFields = [];
    const errors = [];
    
    for (const field of requiredFields) {
      try {
        const response = await makeGHLRequest(
          locationId,
          `/locations/${locationId}/customFields`,
          {
            method: 'POST',
            body: JSON.stringify(field),
          }
        );
        
        if (response.ok) {
          const data = await response.json();
          createdFields.push(data.customField);
          console.log('✅ Created field:', field.name);
        } else {
          const errorText = await response.text();
          errors.push({ field: field.name, error: errorText });
          console.warn('⚠️ Failed to create field:', field.name, errorText);
        }
      } catch (err: any) {
        errors.push({ field: field.name, error: err.message });
        console.warn('⚠️ Error creating field:', field.name, err.message);
      }
    }
    
    // Log in audit
    await logAudit(locationId, 'custom_fields_setup', {
      createdCount: createdFields.length,
      errorCount: errors.length,
    });
    
    return c.json({
      success: true,
      createdFields,
      errors,
      message: `Created ${createdFields.length} custom fields`,
    });
    
  } catch (error: any) {
    console.error('❌ Error setting up custom fields:', error);
    return c.json({
      error: 'Failed to setup custom fields',
      message: error.message,
    }, 500);
  }
});

export default app;