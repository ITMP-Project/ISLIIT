import { ref } from "vue";
import type { MongoTimeTable } from "@/ts/mongo";

const timeTables = ref<MongoTimeTable[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);

const apiUrl = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

export function useTimeTableStore() {
  const fetchTimeTables = async () => {
    loading.value = true;
    error.value = null;

    try {
      const response = await fetch(`${apiUrl}/api/time-tables`);
      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }
      const data = await response.json();
      timeTables.value = Array.isArray(data) ? data : [];
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Unknown error";
    } finally {
      loading.value = false;
    }
  };

  return {
    timeTables,
    loading,
    error,
    fetchTimeTables,
    apiUrl,
  };
}
