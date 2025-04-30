
import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { notificationService } from "@/services/notificationService";
import { useAuth } from "@/context/AuthContext";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { NotificationMessage } from "@/data/types";
import { cn } from "@/lib/utils";

export const NotificationsIndicator = () => {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState<NotificationMessage[]>([]);
  const [open, setOpen] = useState(false);
  
  useEffect(() => {
    if (currentUser?.id) {
      // En una app real, esto se actualizaría con websockets o polling
      const userNotifications = notificationService.getUserNotifications(currentUser.id);
      setNotifications(userNotifications);
    }
  }, [currentUser]);
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  const markAsRead = (id: string) => {
    notificationService.markAsRead(id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };
  
  const handleDelete = (id: string) => {
    notificationService.deleteNotification(id);
    setNotifications(prev => prev.filter(n => n.id !== id));
  };
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0">
        <div className="py-2 px-4 border-b">
          <h4 className="font-medium">Notificaciones</h4>
        </div>
        
        <div className="max-h-80 overflow-auto">
          {notifications.length === 0 ? (
            <div className="py-6 text-center text-gray-500">
              <Bell className="mx-auto h-8 w-8 mb-2 text-gray-400" />
              <p>No hay notificaciones</p>
            </div>
          ) : (
            notifications.map(notification => (
              <div 
                key={notification.id}
                className={cn(
                  "p-3 border-b hover:bg-gray-50 cursor-pointer flex items-start",
                  !notification.read && "bg-blue-50"
                )}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex-1">
                  <p className="font-medium">{notification.title}</p>
                  <p className="text-sm text-gray-500">{notification.message}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 w-6 p-0 text-gray-400"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(notification.id);
                  }}
                >
                  &times;
                </Button>
              </div>
            ))
          )}
        </div>
        
        {notifications.length > 0 && (
          <div className="p-2 border-t">
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full text-sm"
              onClick={() => {
                notifications.forEach(n => !n.read && markAsRead(n.id));
              }}
            >
              Marcar todo como leído
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};
