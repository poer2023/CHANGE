import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UIState, Notification } from '@/types';

interface UIStore extends UIState {
  // Actions
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setActiveModal: (modal: string | null) => void;
  closeModal: () => void;
  
  // Notification actions
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  
  // Loading actions
  setGlobalLoading: (loading: boolean) => void;
  setPaperLoading: (loading: boolean) => void;
  setAgentLoading: (loading: boolean) => void;
  setLoading: (key: keyof UIState['loading'], loading: boolean) => void;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

export const useUIStore = create<UIStore>()(
  persist(
    (set, get) => ({
      // Initial state
      theme: 'light',
      sidebarOpen: true,
      activeModal: null,
      notifications: [],
      loading: {
        global: false,
        paper: false,
        agent: false,
      },

      // Theme actions
      setTheme: (theme) => set({ theme }),
      
      toggleTheme: () => set((state) => ({
        theme: state.theme === 'light' ? 'dark' : 'light',
      })),

      // Sidebar actions
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      
      toggleSidebar: () => set((state) => ({
        sidebarOpen: !state.sidebarOpen,
      })),

      // Modal actions
      setActiveModal: (modal) => set({ activeModal: modal }),
      closeModal: () => set({ activeModal: null }),

      // Notification actions
      addNotification: (notification) => {
        const newNotification: Notification = {
          ...notification,
          id: generateId(),
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          notifications: [newNotification, ...state.notifications],
        }));

        // Auto-remove notification after duration
        if (notification.duration && notification.duration > 0) {
          setTimeout(() => {
            get().removeNotification(newNotification.id);
          }, notification.duration);
        }
      },
      
      removeNotification: (id) => set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== id),
      })),
      
      clearNotifications: () => set({ notifications: [] }),

      // Loading actions
      setGlobalLoading: (loading) => set((state) => ({
        loading: { ...state.loading, global: loading },
      })),
      
      setPaperLoading: (loading) => set((state) => ({
        loading: { ...state.loading, paper: loading },
      })),
      
      setAgentLoading: (loading) => set((state) => ({
        loading: { ...state.loading, agent: loading },
      })),
      
      setLoading: (key, loading) => set((state) => ({
        loading: { ...state.loading, [key]: loading },
      })),
    }),
    {
      name: 'ui-store',
      partialize: (state) => ({
        theme: state.theme,
        sidebarOpen: state.sidebarOpen,
      }),
    }
  )
);