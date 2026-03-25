
import React, { useState } from 'react';
// import { Notification } from '../types';
// import { formatTimeAgo } from '../utils';
import { MoreVertical, ChevronLeft, ChevronRight, BellOff, Trash2, CheckCheck } from 'lucide-react';
import { Notification } from '@/types/types';
import { timeAgo } from '@/utills';

interface NotificationDropdownProps {
  notifications: Notification[];
  isOpen: boolean;
  onNotificationClick: (notification: Notification) => void;
  onDeleteNotification: (notificationId: string) => void;
  onMarkAllAsRead: () => void;
  onClose: () => void;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

const ITEMS_PER_PAGE = 5;

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ 
  notifications, 
  isOpen, 
  onNotificationClick,
  onDeleteNotification,
  onMarkAllAsRead,
  currentPage: externalPage,
  totalPages: externalTotalPages,
  onPageChange,
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  if (!isOpen) return null;

  const isServerPagination = typeof onPageChange === "function";
  const activePage = externalPage ?? currentPage;
  const totalPages = isServerPagination
    ? (externalTotalPages ?? 1)
    : Math.ceil(notifications.length / ITEMS_PER_PAGE);
  const startIndex = (activePage - 1) * ITEMS_PER_PAGE;
  const currentNotifications = isServerPagination
    ? notifications
    : notifications.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const goToPrevPage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activePage > 1) {
      if (isServerPagination) onPageChange?.(activePage - 1);
      else setCurrentPage((p) => p - 1);
    }
  };

  const goToNextPage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activePage < totalPages) {
      if (isServerPagination) onPageChange?.(activePage + 1);
      else setCurrentPage((p) => p + 1);
    }
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    onDeleteNotification(id);
    // If we delete the last item on a page, go back a page
    if (currentNotifications.length === 1 && activePage > 1) {
      if (isServerPagination) onPageChange?.(activePage - 1);
      else setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <div className="absolute top-12 right-0 w-full sm:w-[480px] bg-white dark:bg-[#282828] border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl z-40 overflow-hidden flex flex-col origin-top-right animate-in fade-in zoom-in-95 duration-200">
      
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#202020]">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white">Notifications ({notifications.length})</h3>
        <div className="flex items-center gap-1">
          {notifications.some(n => !n.isRead) && (
            <button 
              onClick={(e) => { e.stopPropagation(); onMarkAllAsRead(); }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full transition-colors"
              title="Mark all as read"
            >
              <CheckCheck size={14} />
              Mark all as read
            </button>
          )}
          <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full text-gray-500 dark:text-gray-400 transition-colors">
            <MoreVertical size={20} />
          </button>
        </div>
      </div>

      {/* List */}
      <div className="overflow-y-auto max-h-[400px]">
        {notifications.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
             <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <BellOff size={24} />
             </div>
            <p>No notifications yet</p>
          </div>
        ) : (
          <div>
            {currentNotifications.map((notification) => (
              <div 
                key={notification._id}
                onClick={() => onNotificationClick(notification)}
                className={`
                  group relative flex gap-4 p-4 cursor-pointer transition-all border-b border-gray-100 dark:border-gray-800 last:border-0
                  ${!notification.isRead ? 'bg-blue-50/50 dark:bg-blue-900/10' : 'hover:bg-gray-50 dark:hover:bg-[#323232]'}
                `}
              >
                {!notification.isRead && (
                  <div className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-blue-600" />
                )}

                <div className="flex-shrink-0 relative mt-1">
                  <img 
                    src={notification.channel.avatar} 
                    alt={notification.channel.username} 
                    className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-gray-700 shadow-sm"
                  />
                </div>

                <div className="flex-1 min-w-0 pr-2">
                  <div className="text-sm text-gray-900 dark:text-white leading-snug mb-1">
                    <span className="font-semibold">{notification.channel.username}</span>{" "}
                    {notification.type === "LIVE_STREAM_STARTED" ? "started live:" : "uploaded:"}{" "}
                    <span className="text-gray-700 dark:text-gray-300">
                      {notification.type === "LIVE_STREAM_STARTED"
                        ? notification.streamTitle || "Live stream"
                        : notification.video?.title || "New video"}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-500 font-medium">
                    {timeAgo(notification.createdAt)}
                  </p>
                </div>

                {/* Video Thumbnail */}
                {notification.type === "LIVE_STREAM_STARTED" ? (
                  <div className="flex-shrink-0 w-24 h-14 rounded-md border border-red-500/60 bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-semibold flex items-center justify-center">
                    LIVE NOW
                  </div>
                ) : (
                  <div className="flex-shrink-0 w-24 h-14 relative rounded-md overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm group-hover:shadow-md transition-shadow">
                    <img 
                      src={notification.video?.thumbnail || ""} 
                      alt="" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Delete Button (Visible on Hover) */}
                <button 
                  onClick={(e) => handleDelete(e, notification._id)}
                  className="absolute right-2 top-2 p-1.5 bg-white/90 dark:bg-[#1e1e1e]/90 text-gray-500 hover:text-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-sm border border-gray-200 dark:border-gray-700"
                  title="Delete notification"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Pagination Footer */}
      {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-2 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#202020]">
             <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                Page {activePage} of {totalPages}
             </span>
             <div className="flex gap-2">
                <button 
                  onClick={goToPrevPage}
                  disabled={activePage === 1}
                  className="p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-30 text-gray-700 dark:text-gray-200 transition-colors"
                >
                   <ChevronLeft size={16} />
                </button>
                <button 
                   onClick={goToNextPage}
                   disabled={activePage === totalPages}
                   className="p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-30 text-gray-700 dark:text-gray-200 transition-colors"
                >
                   <ChevronRight size={16} />
                </button>
             </div>
          </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
