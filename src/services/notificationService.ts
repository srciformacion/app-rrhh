import { toast } from "@/components/ui/sonner";
import { NotificationMessage } from "@/data/types";

// Mock de notificaciones (en una app real, esto estaría en una base de datos)
const mockNotifications: NotificationMessage[] = [];

export const notificationService = {
  // Obtener notificaciones de un usuario
  getUserNotifications: (userId: string): NotificationMessage[] => {
    return mockNotifications.filter(notification => notification.userId === userId);
  },
  
  // Crear una nueva notificación
  createNotification: (
    title: string,
    message: string,
    type: "info" | "success" | "warning" | "error" = "info",
    userId?: string
  ): NotificationMessage => {
    const newNotification: NotificationMessage = {
      id: (mockNotifications.length + 1).toString(),
      title,
      message,
      type,
      read: false,
      createdAt: new Date().toISOString(),
      userId
    };
    
    mockNotifications.push(newNotification);
    
    // También mostramos un toast
    switch (type) {
      case "success":
        toast.success(title, { description: message });
        break;
      case "warning":
        toast.warning(title, { description: message });
        break;
      case "error":
        toast.error(title, { description: message });
        break;
      default:
        toast(title, { description: message });
    }
    
    return newNotification;
  },
  
  // Marcar notificación como leída
  markAsRead: (notificationId: string): NotificationMessage | undefined => {
    const notification = mockNotifications.find(n => n.id === notificationId);
    
    if (notification) {
      notification.read = true;
    }
    
    return notification;
  },
  
  // Eliminar notificación
  deleteNotification: (notificationId: string): boolean => {
    const index = mockNotifications.findIndex(n => n.id === notificationId);
    
    if (index !== -1) {
      mockNotifications.splice(index, 1);
      return true;
    }
    
    return false;
  }
};
