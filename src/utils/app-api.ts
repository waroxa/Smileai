import { projectId, publicAnonKey } from './supabase/info';

const baseUrl = `https://${projectId}.supabase.co/functions/v1/make-server-c5a5d193`;

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${publicAnonKey}`,
      ...(options.headers || {}),
    },
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = typeof data?.message === 'string' ? data.message : data?.error || 'Request failed';
    throw new Error(message);
  }

  return data as T;
}

export interface LeadCapturePayload {
  fullName: string;
  email: string;
  phone: string;
  interestedIn: string;
  notes?: string;
  source?: string;
}

export interface LeadCaptureResponse {
  success: boolean;
  contactId?: string;
  crmSyncEnabled?: boolean;
  message?: string;
}

export interface SmileGenerationResponse {
  success: boolean;
  imageDataUrl: string;
  provider: string;
}

export interface VideoGenerationResponse {
  success: boolean;
  videoUrl: string;
  provider?: string;
  message?: string;
}

export interface MediaSyncPayload {
  contactId: string;
  beforeImage?: string;
  afterImage?: string;
  smileVideo?: string;
  status?: string;
}

export const AppApi = {
  captureLead(payload: LeadCapturePayload) {
    return request<LeadCaptureResponse>('/api/lead-capture', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  generateSmile(imageDataUrl: string, smileIntensity: 'subtle' | 'natural' | 'bright') {
    return request<SmileGenerationResponse>('/api/generate-smile', {
      method: 'POST',
      body: JSON.stringify({ imageDataUrl, smileIntensity }),
    });
  },
  generateVideo(imageUrl: string, prompt: string) {
    return request<VideoGenerationResponse>('/api/video/generate', {
      method: 'POST',
      body: JSON.stringify({ imageUrl, prompt }),
    });
  },
  syncMedia(payload: MediaSyncPayload) {
    return request<{ success: boolean; message?: string }>('/api/lead-media', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  checkVideoProvider() {
    return request<{ configured: boolean; provider: string; message?: string }>('/api/video/status');
  },
};
