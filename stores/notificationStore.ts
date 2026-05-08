import { Ionicons } from "@expo/vector-icons";
import { create } from "zustand";

export interface Notification {
  id: string;
  type: string;
  message: string;
  timestamp: string;
  read: boolean;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  iconBg: string;
}

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    type: "match",
    message: "New job match: Senior React Developer at Cloudify Networks",
    timestamp: "2 min ago",
    read: false,
    icon: "briefcase-outline",
    iconColor: "#2563EB",
    iconBg: "#DBEAFE",
  },
  {
    id: "2",
    type: "viewed",
    message:
      "Your application for Full Stack Developer was viewed by PT Uniclov Int.",
    timestamp: "1 hour ago",
    read: false,
    icon: "eye-outline",
    iconColor: "#8B5CF6",
    iconBg: "#EDE9FE",
  },
  {
    id: "3",
    type: "interview",
    message:
      "Interview scheduled for React Native Wizard at Bullshit Incorporated on Feb 25",
    timestamp: "3 hours ago",
    read: false,
    icon: "calendar-outline",
    iconColor: "#059669",
    iconBg: "#D1FAE5",
  },
  {
    id: "4",
    type: "update",
    message: "Your profile has been updated successfully",
    timestamp: "1 day ago",
    read: true,
    icon: "checkmark-circle-outline",
    iconColor: "#F59E0B",
    iconBg: "#FEF3C7",
  },
  {
    id: "5",
    type: "recommendation",
    message: "Based on your profile, we recommend 5 new jobs in your area",
    timestamp: "2 days ago",
    read: true,
    icon: "star-outline",
    iconColor: "#EC4899",
    iconBg: "#FCE7F3",
  },
];

type NotificationState = {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
};

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: INITIAL_NOTIFICATIONS,
  unreadCount: INITIAL_NOTIFICATIONS.filter((n) => !n.read).length,

  markAsRead: (id: string) => {
    set((state) => {
      const notifications = state.notifications.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif,
      );
      return {
        notifications,
        unreadCount: notifications.filter((n) => !n.read).length,
      };
    });
  },

  markAllAsRead: () => {
    set((state) => ({
      notifications: state.notifications.map((notif) => ({
        ...notif,
        read: true,
      })),
      unreadCount: 0,
    }));
  },
}));
