import { ref } from "vue";
import type { MongoKuppiSession } from "@/ts/mongo";

const sessions = ref<MongoKuppiSession[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);

const apiUrl = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

export function useKuppiSessionsStore() {
  const fetchKuppiSessions = async () => {
    loading.value = true;
    error.value = null;

    try {
      const response = await fetch(`${apiUrl}/api/kuppi-sessions`);
      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }
      const data = await response.json();
      sessions.value = Array.isArray(data) ? data : [];
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Unknown error";
    } finally {
      loading.value = false;
    }
  };

  const getKuppiSession = async (id: string): Promise<MongoKuppiSession | null> => {
    try {
      const response = await fetch(`${apiUrl}/api/kuppi-sessions/${id}`);
      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }
      return await response.json();
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Unknown error";
      return null;
    }
  };

  const createKuppiSession = async (
    payload: Omit<MongoKuppiSession, "_id" | "status" | "createdAt">
  ): Promise<MongoKuppiSession | null> => {
    error.value = null;

    try {
      const response = await fetch(`${apiUrl}/api/kuppi-sessions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error ?? `Request failed: ${response.status}`);
      }

      const created: MongoKuppiSession = await response.json();
      sessions.value = [created, ...sessions.value];
      return created;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Unknown error";
      return null;
    }
  };

  return {
    sessions,
    loading,
    error,
    fetchKuppiSessions,
    getKuppiSession,
    createKuppiSession,
    apiUrl,
  };
}
