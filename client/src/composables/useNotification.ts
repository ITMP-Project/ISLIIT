import { ref } from 'vue';

type NotificationType = 'success' | 'error' | 'info' | 'warning';

interface Notification {
    id: number;
    message: string;
    type: NotificationType;
}

// Global state
const notifications = ref<Notification[]>([]);
let nextId = 0;

export const useNotification = () => {
    const addNotification = (message: string, type: NotificationType = 'info', durationMs = 3000) => {
        const id = nextId++;
        const notification: Notification = { id, message, type };

        notifications.value.push(notification);

        setTimeout(() => {
            removeNotification(id);
        }, durationMs);
    };

    const removeNotification = (id: number) => {
        notifications.value = notifications.value.filter(n => n.id !== id);
    };

    return {
        notifications,
        addNotification,
        removeNotification
    };
};
