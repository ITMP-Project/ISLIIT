import { ref } from "vue";
import type { ModuleEvent } from "@/ts/mongo";

const apiUrl = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

const events = ref<ModuleEvent[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);

export function useModuleEventsStore() {
  const fetchEvents = async (moduleId: string) => {
    if (!moduleId) return;
    loading.value = true;
    error.value = null;

    try {
      const response = await fetch(`${apiUrl}/api/modules/${encodeURIComponent(moduleId)}/events`);
      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }
      const data = await response.json();
      events.value = Array.isArray(data) ? data : [];
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Unknown error";
    } finally {
      loading.value = false;
    }
  };

  const createEvent = async (
    moduleId: string,
    payload: Omit<ModuleEvent, "_id" | "module_id" | "createdBy" | "createdAt">
  ) => {
    if (!moduleId) return null;
    error.value = null;

    try {
      const response = await fetch(
        `${apiUrl}/api/modules/${encodeURIComponent(moduleId)}/events`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error ?? `Request failed: ${response.status}`);
      }

      const created = (await response.json()) as ModuleEvent;
      events.value = [created, ...events.value];
      return created;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Unknown error";
      return null;
    }
  };

  return {
    apiUrl,
    events,
    loading,
    error,
    fetchEvents,
    createEvent,
  };
}

