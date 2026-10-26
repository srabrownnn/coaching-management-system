'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Notice, NoticePriority, NoticeAudience } from '@/types';
import { Badge } from '@/components/common/Badge';
import { formatDate } from '@/utils';
import {
  BellRing,
  Plus,
  Pin,
  Trash2,
  AlertTriangle,
  Calendar,
  X,
} from 'lucide-react';

export const NoticesView: React.FC = () => {
  const { notices, addNotice, deleteNotice, togglePinNotice } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState<NoticePriority>('Medium');
  const [audience, setAudience] = useState<NoticeAudience>('All');
  const [filterAudience, setFilterAudience] = useState<string>('all');

  const filteredNotices = notices.filter((n) => {
    return filterAudience === 'all' || n.audience === filterAudience;
  });

  // Sort pinned first, then by date
  const sortedNotices = [...filteredNotices].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    addNotice({
      title,
      content,
      priority,
      audience,
      date: new Date().toISOString().split('T')[0],
      author: 'Academic Administration',
      pinned: false,
    });

    setTitle('');
    setContent('');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Institute Notice Board
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Publish announcements, urgent notifications, and notices for students, parents and staff
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md shadow-indigo-600/20 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Publish Announcement
        </button>
      </div>

      {/* Filter */}
      <div className="flex gap-2 pb-2 overflow-x-auto">
        {['all', 'All', 'Students', 'Parents', 'Teachers'].map((aud) => (
          <button
            key={aud}
            onClick={() => setFilterAudience(aud)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition-colors ${
              filterAudience === aud
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            {aud === 'all' ? 'All Audiences' : aud}
          </button>
        ))}
      </div>

      {/* Notices Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sortedNotices.map((notice) => (
          <div
            key={notice.id}
            className={`p-5 rounded-2xl bg-white dark:bg-gray-800 border transition-all flex flex-col justify-between ${
              notice.pinned
                ? 'border-indigo-300 dark:border-indigo-700 shadow-md shadow-indigo-500/5'
                : 'border-gray-200 dark:border-gray-700 shadow-sm'
            }`}
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge
                    variant={
                      notice.priority === 'Urgent'
                        ? 'danger'
                        : notice.priority === 'High'
                        ? 'warning'
                        : 'info'
                    }
                  >
                    {notice.priority}
                  </Badge>

                  <Badge variant="gray">Audience: {notice.audience}</Badge>

                  {notice.pinned && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                      <Pin className="w-3 h-3 fill-current" /> Pinned
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => togglePinNotice(notice.id)}
                    className={`p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 transition-colors ${
                      notice.pinned ? 'text-indigo-600 fill-current' : ''
                    }`}
                    title={notice.pinned ? 'Unpin' : 'Pin to top'}
                  >
                    <Pin className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Delete this announcement?')) {
                        deleteNotice(notice.id);
                      }
                    }}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 transition-colors"
                    title="Delete notice"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h3 className="font-bold text-base text-gray-900 dark:text-white mt-1">
                {notice.title}
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-300 mt-2 leading-relaxed whitespace-pre-line">
                {notice.content}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between text-[11px] text-gray-400">
              <span>By {notice.author}</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {formatDate(notice.date)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Publish Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-lg w-full shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Publish New Notice
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Notice Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Schedule for Upcoming Winter Mock Exams"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-xl bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-gray-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Priority Level
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as NoticePriority)}
                    className="w-full px-3.5 py-2 text-sm rounded-xl bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Audience
                  </label>
                  <select
                    value={audience}
                    onChange={(e) => setAudience(e.target.value as NoticeAudience)}
                    className="w-full px-3.5 py-2 text-sm rounded-xl bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none"
                  >
                    <option value="All">All Audiences</option>
                    <option value="Students">Students Only</option>
                    <option value="Parents">Parents Only</option>
                    <option value="Teachers">Faculty / Staff Only</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Notice Content *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Type the announcement announcement details here..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-xl bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-gray-900 dark:text-white"
                />
              </div>

              <div className="pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20"
                >
                  Publish Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
