import { useState } from 'react';
import { Search, Download, Eye, Video, Calendar, Mail, Phone } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import type { Submission } from '../App';

interface DashboardProps {
  submissions: Submission[];
}

export function Dashboard({ submissions }: DashboardProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);

  const filteredSubmissions = submissions.filter(sub =>
    sub.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sub.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl mb-2">Submissions Dashboard</h1>
          <p className="text-gray-600">
            Manage and view all customer smile transformations
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <p className="text-gray-600 mb-1">Total Submissions</p>
            <p className="text-3xl">{submissions.length}</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <p className="text-gray-600 mb-1">With Videos</p>
            <p className="text-3xl">
              {submissions.filter(s => s.hasVideo).length}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <p className="text-gray-600 mb-1">Today</p>
            <p className="text-3xl">
              {submissions.filter(s => {
                const today = new Date();
                const subDate = new Date(s.timestamp);
                return subDate.toDateString() === today.toDateString();
              }).length}
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Submissions Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {filteredSubmissions.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <p className="text-xl mb-2">No submissions yet</p>
              <p>Submissions will appear here once customers upload their smiles</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-gray-600">Customer</th>
                    <th className="px-6 py-3 text-left text-gray-600">Contact</th>
                    <th className="px-6 py-3 text-left text-gray-600">Date</th>
                    <th className="px-6 py-3 text-left text-gray-600">Status</th>
                    <th className="px-6 py-3 text-left text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredSubmissions.map((submission) => (
                    <tr key={submission.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={submission.originalImage}
                            alt={submission.customerName}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div>
                            <p>{submission.customerName}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Mail className="w-3 h-3" />
                            {submission.email}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone className="w-3 h-3" />
                            {submission.phone}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          {new Date(submission.timestamp).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <Badge variant="secondary">AI Generated</Badge>
                          {submission.hasVideo && (
                            <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-200">
                              <Video className="w-3 h-3 mr-1" />
                              Video
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedSubmission(submission)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                          <Button size="sm" variant="outline">
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Detail Dialog */}
        <Dialog open={!!selectedSubmission} onOpenChange={() => setSelectedSubmission(null)}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Submission Details</DialogTitle>
              <DialogDescription>
                {selectedSubmission?.customerName} - {new Date(selectedSubmission?.timestamp || '').toLocaleString()}
              </DialogDescription>
            </DialogHeader>
            
            {selectedSubmission && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Email</p>
                    <p>{selectedSubmission.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Phone</p>
                    <p>{selectedSubmission.phone}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Original Image</p>
                    <img
                      src={selectedSubmission.originalImage}
                      alt="Original"
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-2">AI Generated</p>
                    <div className="relative">
                      <img
                        src={selectedSubmission.aiGeneratedImage}
                        alt="AI Generated"
                        className="w-full h-64 object-cover rounded-lg brightness-110 contrast-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-blue-500/20 to-transparent rounded-lg pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button className="flex-1">
                    <Download className="w-4 h-4 mr-2" />
                    Download Images
                  </Button>
                  {selectedSubmission.hasVideo && (
                    <Button variant="outline" className="flex-1">
                      <Video className="w-4 h-4 mr-2" />
                      Download Video
                    </Button>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
