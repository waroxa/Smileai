import React from 'react';
import { Mail, Phone, Calendar, Eye, MessageSquare, MoreVertical, User, CheckCircle2, Clock } from 'lucide-react';
import { Button } from '../../ui/button';

interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  lastVisit: string;
  status: string;
  assessmentCompleted: boolean;
  consultationScheduled: boolean;
  avatar: string | null;
}

interface PatientCardProps {
  patient: Patient;
  primaryColor: string;
  onViewContact?: (contactId: string) => void;
}

export function PatientCard({ patient, primaryColor, onViewContact }: PatientCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-gray-600" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">{patient.name}</h4>
            <p className="text-sm text-gray-500">{patient.lastVisit}</p>
          </div>
        </div>
        <button className="p-1 text-gray-400 hover:text-gray-600 rounded">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      {/* Contact Info */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Mail className="w-4 h-4" />
          <span>{patient.email}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Phone className="w-4 h-4" />
          <span>{patient.phone}</span>
        </div>
      </div>

      {/* Status Badges */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
            patient.status === 'Active'
              ? 'bg-green-100 text-green-800'
              : patient.status === 'Pending'
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-blue-100 text-blue-800'
          }`}
        >
          {patient.status}
        </span>
        {patient.assessmentCompleted && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
            <CheckCircle2 className="w-3 h-3" />
            Assessment Done
          </span>
        )}
        {patient.consultationScheduled && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <Clock className="w-3 h-3" />
            Consult Booked
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-4 border-t border-gray-200">
        <Button 
          size="sm" 
          className="flex-1 text-white"
          style={{ backgroundColor: primaryColor }}
          onClick={() => onViewContact?.(patient.id)}
        >
          <Eye className="w-4 h-4 mr-1" />
          View
        </Button>
        <Button size="sm" variant="outline" className="flex-1 border-gray-300">
          <MessageSquare className="w-4 h-4 mr-1" />
          Message
        </Button>
      </div>
    </div>
  );
}