'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaBell } from 'react-icons/fa';
import { useAuth } from '@/app/context/AuthContext';
import Link from 'next/link';

interface Notification {
  _id: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export default function NotificationBell() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user) {
      fetchNotifications();
      // Poll for new notifications every 30 seconds
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get('/api/notifications');
      const data = Array.isArray(res.data) ? res.data : [];
      setNotifications(data);
      const unread = data.filter((n: Notification) => !n.isRead).length;
      setUnreadCount(unread);
      console.log('Unread count fetched:', unread);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const markAsRead = async () => {
    if (unreadCount === 0) return;
    try {
      await axios.patch('/api/notifications');
      setUnreadCount(0);
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    } catch (error) {
      console.error('Error marking notifications as read:', error);
    }
  };

  if (!user) return null;

  return (
    <div className="dropdown dropdown-end">
      <div 
        tabIndex={0} 
        role="button" 
        className="btn btn-ghost btn-circle"
      >
        <div className="indicator">
          <FaBell className="text-xl" />
          {unreadCount > 0 && (
            <span className="badge badge-sm badge-error indicator-item">
              {unreadCount}
            </span>
          )}
        </div>
      </div>
      <div
        tabIndex={0}
        className="mt-3 z-100 card card-compact dropdown-content w-80 bg-base-100 shadow-xl border border-base-200"
      >
        <div className="card-body">
          <div className="flex items-center justify-between px-2 pt-2">
            <h3 className="font-bold text-lg">Notifications</h3>
            {unreadCount > 0 && (
              <button 
                onClick={markAsRead}
                className="text-xs text-primary hover:underline font-medium"
              >
                Mark all as read
              </button>
            )}
          </div>
          <div className="divider my-0"></div>
          <div className="max-h-64 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-base-content/50">
                No notifications yet
              </div>
            ) : (
              notifications.map((notification) => (
                <div 
                  key={notification._id} 
                  className={`p-3 border-b border-base-200 last:border-0 hover:bg-base-200/50 transition-colors ${!notification.isRead ? 'bg-primary/5' : ''}`}
                >
                  <p className="text-sm">{notification.message}</p>
                  <span className="text-[10px] text-base-content/50 mt-1 block">
                    {new Date(notification.createdAt).toLocaleString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
