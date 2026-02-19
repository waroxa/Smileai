// GoHighLevel API Integration Utilities

export interface ContactData {
  fullName: string;
  email: string;
  phone: string;
  interestedIn: string;
  notes?: string;
  source?: string;
}

export interface MediaData {
  beforeImage?: string;
  afterImage?: string;
  smileVideo?: string;
}

/**
 * Create or update a contact in GoHighLevel
 */
export async function createGHLContact(contactData: ContactData): Promise<{ success: boolean; contactId?: string; error?: string }> {
  try {
    const apiKey = localStorage.getItem('ghl_api_key');
    const locationId = localStorage.getItem('ghl_location_id');

    if (!apiKey || !locationId) {
      // Silently skip GHL integration if not configured - this is optional
      console.log('ℹ️ GHL API credentials not configured - skipping GHL contact creation (this is optional)');
      return { success: true, contactId: undefined }; // Return success so the form flow continues
    }

    // Split full name into first and last name
    const nameParts = contactData.fullName.trim().split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ') || '';

    // Prepare the request payload
    const payload = {
      firstName,
      lastName,
      email: contactData.email,
      phone: contactData.phone,
      source: contactData.source || 'SmileVision AI Landing Page',
      tags: ['smile-transformation', 'ai-lead'],
      customFields: {
        service_interest: contactData.interestedIn,
        notes: contactData.notes || '',
        lead_source: 'Smile AI Website',
        transformation_status: 'Pending',
      },
    };

    // Make API request to GHL
    const response = await fetch(`https://rest.gohighlevel.com/v1/contacts/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Version': '2021-07-28',
      },
      body: JSON.stringify({
        ...payload,
        locationId,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Contact created in GHL:', data);

    return {
      success: true,
      contactId: data.contact?.id || data.id,
    };
  } catch (error: any) {
    console.error('❌ Error creating GHL contact:', error);
    return {
      success: false,
      error: error.message || 'Failed to create contact',
    };
  }
}

/**
 * Upload media files (before/after images, video) to a GHL contact
 */
export async function uploadGHLMedia(contactId: string, mediaData: MediaData): Promise<{ success: boolean; error?: string }> {
  try {
    const apiKey = localStorage.getItem('ghl_api_key');

    if (!apiKey) {
      // Silently skip if not configured
      console.log('ℹ️ GHL API credentials not configured - skipping media upload (this is optional)');
      return { success: true }; // Return success so the flow continues
    }

    // Prepare custom fields for the contact
    const customFields: Record<string, any> = {};

    // Save before/after image URLs (in production, you'd upload these to GHL storage first)
    if (mediaData.beforeImage) {
      customFields.before_image_url = mediaData.beforeImage.substring(0, 1000); // Truncate if too long
    }

    if (mediaData.afterImage) {
      customFields.after_image_url = mediaData.afterImage.substring(0, 1000); // Truncate if too long
    }

    // Save video URL as custom field
    if (mediaData.smileVideo) {
      // Only save if it's a real video URL (not 'ANIMATED')
      if (mediaData.smileVideo !== 'ANIMATED' && !mediaData.smileVideo.startsWith('data:image')) {
        customFields.smile_video_url = mediaData.smileVideo;
        console.log('💾 Saving video URL to GHL:', mediaData.smileVideo.substring(0, 100) + '...');
      }
    }

    // Update contact with custom fields
    if (Object.keys(customFields).length > 0) {
      await fetch(`https://rest.gohighlevel.com/v1/contacts/${contactId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'Version': '2021-07-28',
        },
        body: JSON.stringify({
          customFields,
        }),
      });

      console.log('✅ Media URLs saved to GHL contact custom fields');
    }

    // Also add a note with the video link for easy access
    if (mediaData.smileVideo && mediaData.smileVideo !== 'ANIMATED' && !mediaData.smileVideo.startsWith('data:image')) {
      await fetch(`https://rest.gohighlevel.com/v1/contacts/${contactId}/notes`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'Version': '2021-07-28',
        },
        body: JSON.stringify({
          body: `🎥 AI Smile Video Generated!\n\nWatch the transformation: ${mediaData.smileVideo}\n\nThis video shows the patient's smile transformation in action.`,
        }),
      });
      
      console.log('✅ Video URL added to contact notes');
    }

    return { success: true };
  } catch (error: any) {
    console.error('❌ Error uploading media to GHL:', error);
    return {
      success: false,
      error: error.message || 'Failed to upload media',
    };
  }
}

/**
 * Helper function to upload a single file to a contact
 */
async function uploadFileToContact(contactId: string, fileData: string, fileName: string, apiKey: string): Promise<void> {
  // This function is now deprecated - we save URLs directly to custom fields instead
  console.log(`ℹ️ File upload helper deprecated - using custom fields instead`);
}

/**
 * Update contact's transformation status
 */
export async function updateContactStatus(contactId: string, status: string): Promise<{ success: boolean; error?: string }> {
  try {
    const apiKey = localStorage.getItem('ghl_api_key');

    if (!apiKey) {
      return { success: false, error: 'GHL API credentials not configured' };
    }

    await fetch(`https://rest.gohighlevel.com/v1/contacts/${contactId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Version': '2021-07-28',
      },
      body: JSON.stringify({
        customFields: {
          transformation_status: status,
        },
      }),
    });

    console.log('✅ Contact status updated in GHL');
    return { success: true };
  } catch (error: any) {
    console.error('❌ Error updating contact status:', error);
    return {
      success: false,
      error: error.message || 'Failed to update status',
    };
  }
}