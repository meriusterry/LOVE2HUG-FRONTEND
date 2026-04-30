import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Email, Person, Subject, Delete, CheckCircle, ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';

const AdminMessages = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const response = await api.get('/contact');
      if (response.data.success) {
        setMessages(response.data.messages);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.put(`/contact/${id}/read`);
      toast.success('Message marked as read');
      fetchMessages();
    } catch (error) {
      toast.error('Failed to mark as read');
    }
  };

  const deleteMessage = async (id) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        await api.delete(`/contact/${id}`);
        toast.success('Message deleted');
        fetchMessages();
      } catch (error) {
        toast.error('Failed to delete message');
      }
    }
  };

  const filteredMessages = messages.filter(msg => {
    if (filter === 'unread') return !msg.is_read;
    if (filter === 'read') return msg.is_read;
    return true;
  });

  const stats = {
    total: messages.length,
    unread: messages.filter(m => !m.is_read).length,
    read: messages.filter(m => m.is_read).length
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <button onClick={() => navigate('/admin')} className="text-primary-500 hover:text-primary-600 mb-2 inline-flex items-center gap-1">
              <ArrowBack className="w-4 h-4" /> Back to Dashboard
            </button>
            <h1 className="text-4xl font-bold text-gray-800">Contact Messages</h1>
            <p className="text-gray-600">View and manage customer inquiries</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <Email className="w-8 h-8 text-primary-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
            <p className="text-gray-500">Total Messages</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-yellow-600 font-bold">!</span>
            </div>
            <p className="text-2xl font-bold text-yellow-600">{stats.unread}</p>
            <p className="text-gray-500">Unread</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-600">{stats.read}</p>
            <p className="text-gray-500">Read</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-4 mb-8">
          <div className="flex gap-3">
            <button onClick={() => setFilter('all')} className={`px-4 py-2 rounded-lg transition-colors ${filter === 'all' ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>All ({stats.total})</button>
            <button onClick={() => setFilter('unread')} className={`px-4 py-2 rounded-lg transition-colors ${filter === 'unread' ? 'bg-yellow-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>Unread ({stats.unread})</button>
            <button onClick={() => setFilter('read')} className={`px-4 py-2 rounded-lg transition-colors ${filter === 'read' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>Read ({stats.read})</button>
          </div>
        </div>

        <div className="space-y-4">
          {filteredMessages.map((message, index) => (
            <motion.div key={message.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className={`bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow ${!message.is_read ? 'border-l-4 border-primary-500' : ''}`}>
              <div className="p-6">
                <div className="flex justify-between items-start flex-wrap gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-4 flex-wrap">
                      <div className="flex items-center gap-2"><Person className="w-5 h-5 text-gray-400" /><span className="font-semibold text-gray-800">{message.name}</span></div>
                      <div className="flex items-center gap-2"><Email className="w-5 h-5 text-gray-400" /><a href={`mailto:${message.email}`} className="text-primary-500 hover:underline">{message.email}</a></div>
                      <div className="flex items-center gap-2"><Subject className="w-5 h-5 text-gray-400" /><span className="text-gray-600 font-medium">{message.subject}</span></div>
                    </div>
                    <p className="text-gray-700 mt-3 leading-relaxed">{message.message}</p>
                    <p className="text-sm text-gray-400 mt-2">Received: {new Date(message.created_at).toLocaleString('en-ZA')}</p>
                  </div>
                  <div className="flex gap-2">
                    {!message.is_read && <button onClick={() => markAsRead(message.id)} className="px-3 py-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors flex items-center gap-1"><CheckCircle className="w-5 h-5" /><span className="text-sm hidden md:inline">Mark Read</span></button>}
                    <button onClick={() => deleteMessage(message.id)} className="px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-1"><Delete className="w-5 h-5" /><span className="text-sm hidden md:inline">Delete</span></button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminMessages;