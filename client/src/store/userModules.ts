import { ref } from "vue";
import type { AuthUser, Module } from "@/ts/mongo";

const apiUrl = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

const modules = ref<Module[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);

export function useUserModulesStore() {
  const fetchModulesForContext = async (options: {
    specializationId?: string;
    year?: number;
    semester?: number;
  }) => {
    error.value = null;
    loading.value = true;
    try {
      const params = new URLSearchParams();
      if (options.specializationId) params.set("specialization_id", options.specializationId);
      if (options.year !== undefined) params.set("year", String(options.year));
      if (options.semester !== undefined) params.set("semester", String(options.semester));
      const qs = params.toString() ? `?${params.toString()}` : "";
      const response = await fetch(`${apiUrl}/api/modules${qs}`);
      if (!response.ok) throw new Error(`Request failed: ${response.status}`);
      const data = await response.json();
      modules.value = Array.isArray(data) ? data : [];
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Unknown error";
    } finally {
      loading.value = false;
    }
  };

  const updateUserModules = async (id: string, moduleIds: string[]) => {
    error.value = null;
    try {
      const response = await fetch(`${apiUrl}/api/auth-users/${id}/modules`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ modules: moduleIds }),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error ?? `Request failed: ${response.status}`);
      }
      return (await response.json()) as AuthUser;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Unknown error";
      return null;
    }
  };

  return {
    apiUrl,
    modules,
    loading,
    error,
    fetchModulesForContext,
    updateUserModules,
  };
}

