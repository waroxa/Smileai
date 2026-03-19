import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Phone, 
  Mail, 
  Calendar, 
  MapPin, 
  Tag,
  Image as ImageIcon,
  Video,
  Download,
  ExternalLink,
  Clock,
  User,
  MessageSquare,
  FileText,
  Eye,
  X as XIcon
} from 'lucide-react';
import { Button } from '../ui/button';
import { ReviewStatus, StatusDropdown, ReviewStatusType } from './ReviewStatus';

interface ContactProfileProps {
  contactId?: string;
  onBack: () => void;
  primaryColor?: string;
}

interface ContactData {
  id: string;
  name: string;
  email: string;
  phone: string;
  dateAdded: string;
  lastActivity: string;
  location: string;
  source: string;
  tags: string[];
  interestedIn: string;
  notes: string;
  media: MediaItem[];
}

interface MediaItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  thumbnail?: string;
  filename: string;
  size: string;
  uploadedAt: string;
  description?: string;
}

export function ContactProfile({ contactId, onBack, primaryColor = '#0ea5e9' }: ContactProfileProps) {
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [reviewStatus, setReviewStatus] = useState<ReviewStatusType>('Under Review');

  // Mock contact data - in production, this would come from platform API
  const contact: ContactData = {
    id: contactId || '12345',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    phone: '(555) 234-5678',
    dateAdded: '2026-01-15',
    lastActivity: '2026-01-19 10:30 AM',
    location: 'Los Angeles, CA',
    source: 'Landing Page Form',
    tags: ['New Lead', 'Veneers Interest', 'High Priority', 'Follow-up Scheduled'],
    interestedIn: 'Veneers',
    notes: 'Interested in full smile makeover. Mentioned upcoming wedding in 6 months. Very motivated. Prefers morning appointments.',
    media: [
      {
        id: '1',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=800',
        thumbnail: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=200',
        filename: 'smile-front-view.jpg',
        size: '2.4 MB',
        uploadedAt: '2026-01-15 2:30 PM',
        description: 'Front smile view'
      },
      {
        id: '2',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800',
        thumbnail: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=200',
        filename: 'smile-side-view.jpg',
        size: '1.8 MB',
        uploadedAt: '2026-01-15 2:31 PM',
        description: 'Side profile'
      },
      {
        id: '3',
        type: 'video',
        url: '#',
        thumbnail: 'https://images.unsplash.com/photo-1609840114035-3c981337b645?w=200',
        filename: 'smile-video.mp4',
        size: '8.5 MB',
        uploadedAt: '2026-01-15 2:35 PM',
        description: 'Smile animation video'
      },
      {
        id: '4',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?w=800',
        thumbnail: 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?w=200',
        filename: 'teeth-close-up.jpg',
        size: '3.1 MB',
        uploadedAt: '2026-01-15 2:36 PM',
        description: 'Close-up view'
      }
    ]
  };

  const tagColors: { [key: string]: string } = {
    'New Lead': 'bg-blue-100 text-blue-700 border-blue-200',
    'Veneers Interest': 'bg-purple-100 text-purple-700 border-purple-200',
    'High Priority': 'bg-red-100 text-red-700 border-red-200',
    'Follow-up Scheduled': 'bg-green-100 text-green-700 border-green-200',
  };

  const handleDownload = (media: MediaItem) => {
    console.log('Downloading:', media.filename);
    // In production, trigger actual download
  };

  const handleView = (media: MediaItem) => {
    setSelectedMedia(media);
  };

  return (
    <div className="h-full bg-gray-50 overflow-auto">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="hover:bg-gray-100"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Patients
              </Button>
              <div className="h-6 w-px bg-gray-300" />
              <h1 className="text-xl font-semibold text-gray-900">Contact Profile</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <MessageSquare className="w-4 h-4 mr-2" />
                Send Message
              </Button>
              <Button 
                size="sm" 
                style={{ backgroundColor: primaryColor }}
                className="text-white hover:opacity-90"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Book Appointment
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Contact Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Contact Card */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center gap-4 mb-4">
                  <div 
                    className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-semibold"
                    style={{ backgroundColor: primaryColor }}
                  >
                    {contact.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{contact.name}</h2>
                    <p className="text-sm text-gray-500">Patient ID: #{contact.id}</p>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-4">
                {/* Phone */}
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Phone</p>
                    <a href={`tel:${contact.phone}`} className="text-sm font-medium text-gray-900 hover:text-blue-600">
                      {contact.phone}
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Email</p>
                    <a href={`mailto:${contact.email}`} className="text-sm font-medium text-gray-900 hover:text-blue-600 break-all">
                      {contact.email}
                    </a>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Location</p>
                    <p className="text-sm font-medium text-gray-900">{contact.location}</p>
                  </div>
                </div>

                {/* Date Added */}
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Date Added</p>
                    <p className="text-sm font-medium text-gray-900">{contact.dateAdded}</p>
                  </div>
                </div>

                {/* Last Activity */}
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Last Activity</p>
                    <p className="text-sm font-medium text-gray-900">{contact.lastActivity}</p>
                  </div>
                </div>

                {/* Source */}
                <div className="flex items-start gap-3">
                  <ExternalLink className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Source</p>
                    <p className="text-sm font-medium text-gray-900">{contact.source}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tags Card */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-gray-600" />
                  <h3 className="font-semibold text-gray-900">Tags</h3>
                </div>
              </div>
              <div className="p-4">
                <div className="flex flex-wrap gap-2">
                  {contact.tags.map((tag, index) => (
                    <span
                      key={index}
                      className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium border ${
                        tagColors[tag] || 'bg-gray-100 text-gray-700 border-gray-200'
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <Button variant="outline" size="sm" className="w-full mt-3">
                  <Tag className="w-3 h-3 mr-2" />
                  Manage Tags
                </Button>
              </div>
            </div>

            {/* Service Interest Card */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-600" />
                  <h3 className="font-semibold text-gray-900">Service Interest</h3>
                </div>
              </div>
              <div className="p-4">
                <div 
                  className="px-4 py-3 rounded-lg border-2 font-medium text-center"
                  style={{ 
                    borderColor: primaryColor, 
                    backgroundColor: `${primaryColor}10`,
                    color: primaryColor 
                  }}
                >
                  {contact.interestedIn}
                </div>
              </div>
            </div>

            {/* Review Status Card */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-gray-600" />
                  <h3 className="font-semibold text-gray-900">Review Status</h3>
                </div>
              </div>
              <div className="p-4">
                <StatusDropdown
                  currentStatus={reviewStatus}
                  onStatusChange={setReviewStatus}
                />
              </div>
            </div>
          </div>

          {/* Right Column - Media & Notes */}
          <div className="lg:col-span-2 space-y-6">
            {/* Notes Section */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-gray-600" />
                    <h3 className="font-semibold text-gray-900">Clinical Notes</h3>
                  </div>
                  <Button variant="ghost" size="sm">Edit</Button>
                </div>
              </div>
              <div className="p-4">
                <p className="text-sm text-gray-700 leading-relaxed">{contact.notes}</p>
              </div>
            </div>

            {/* Media Gallery */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-gray-600" />
                    <h3 className="font-semibold text-gray-900">Uploaded Media</h3>
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                      {contact.media.length}
                    </span>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-2 gap-4">
                  {contact.media.map((media) => (
                    <div
                      key={media.id}
                      className="group border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow bg-white"
                    >
                      {/* Thumbnail */}
                      <div className="relative aspect-video bg-gray-100">
                        <img
                          src={media.thumbnail || media.url}
                          alt={media.description}
                          className="w-full h-full object-cover"
                        />
                        {media.type === 'video' && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                            <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
                              <Video className="w-6 h-6 text-gray-700" />
                            </div>
                          </div>
                        )}
                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="bg-white/90 hover:bg-white"
                            onClick={() => handleView(media)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="bg-white/90 hover:bg-white"
                            onClick={() => handleDownload(media)}
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      
                      {/* Info */}
                      <div className="p-3 border-t border-gray-100">
                        <div className="flex items-start gap-2 mb-2">
                          {media.type === 'image' ? (
                            <ImageIcon className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                          ) : (
                            <Video className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-gray-900 truncate">
                              {media.filename}
                            </p>
                            {media.description && (
                              <p className="text-xs text-gray-500 truncate">{media.description}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{media.size}</span>
                          <span>{media.uploadedAt}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Activity Timeline Preview */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-600" />
                  <h3 className="font-semibold text-gray-900">Recent Activity</h3>
                </div>
              </div>
              <div className="p-4">
                <div className="space-y-4">
                  {/* Activity Item */}
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <ImageIcon className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">Uploaded 4 media files</p>
                      <p className="text-xs text-gray-500">Jan 15, 2026 at 2:35 PM</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                      <FileText className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">Submitted contact form</p>
                      <p className="text-xs text-gray-500">Jan 15, 2026 at 2:30 PM</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                      <User className="w-4 h-4 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">Contact created from landing page</p>
                      <p className="text-xs text-gray-500">Jan 15, 2026 at 2:30 PM</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Media Viewer Modal */}
      {selectedMedia && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-5xl w-full">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedMedia(null)}
              className="absolute -top-12 right-0 text-white hover:bg-white/20"
            >
              <XIcon className="w-5 h-5 mr-2" />
              Close
            </Button>
            <div className="bg-white rounded-lg overflow-hidden">
              <img
                src={selectedMedia.url}
                alt={selectedMedia.description}
                className="w-full max-h-[70vh] object-contain"
              />
              <div className="p-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{selectedMedia.filename}</p>
                    <p className="text-sm text-gray-500">{selectedMedia.uploadedAt} • {selectedMedia.size}</p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleDownload(selectedMedia)}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}