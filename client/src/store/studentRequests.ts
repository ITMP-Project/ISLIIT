import { ref } from "vue";
import type { Faculty, Module, Specialization, StudentRequest } from "@/ts/mongo";

const apiUrl = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

const faculties = ref<Faculty[]>([]);
const specializations = ref<Specialization[]>([]);
const modules = ref<Module[]>([]);
const requests = ref<StudentRequest[]>([]);
const myRequest = ref<StudentRequest | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);

export function useStudentRequestsStore() {
  const fetchFaculties = async () => {
    error.value = null;
    try {
      const response = await fetch(`${apiUrl}/api/faculties`);
      if (!response.ok) throw new Error(`Request failed: ${response.status}`);
      const data = await response.json();
      faculties.value = Array.isArray(data) ? data : [];
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Unknown error";
    }
  };

  const fetchSpecializations = async (facultyId?: string) => {
    error.value = null;
    try {
      const qs = facultyId ? `?faculty_id=${encodeURIComponent(facultyId)}` : "";
      const response = await fetch(`${apiUrl}/api/specializations${qs}`);
      if (!response.ok) throw new Error(`Request failed: ${response.status}`);
      const data = await response.json();
      specializations.value = Array.isArray(data) ? data : [];
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Unknown error";
    }
  };

  const fetchModules = async (options?: {
    specializationId?: string;
    year?: number;
    semester?: number;
  }) => {
    error.value = null;
    try {
      const params = new URLSearchParams();
      if (options?.specializationId) {
        params.set("specialization_id", options.specializationId);
      }
      if (options?.year !== undefined) {
        params.set("year", String(options.year));
      }
      if (options?.semester !== undefined) {
        params.set("semester", String(options.semester));
      }
      const qs = params.toString() ? `?${params.toString()}` : "";
      const response = await fetch(`${apiUrl}/api/modules${qs}`);
      if (!response.ok) throw new Error(`Request failed: ${response.status}`);
      const data = await response.json();
      modules.value = Array.isArray(data) ? data : [];
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Unknown error";
    }
  };

  const fetchPendingRequests = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await fetch(`${apiUrl}/api/student-requests?status=pending`);
      if (!response.ok) throw new Error(`Request failed: ${response.status}`);
      const data = await response.json();
      requests.value = Array.isArray(data) ? data : [];
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Unknown error";
    } finally {
      loading.value = false;
    }
  };

  const fetchMyRequest = async (username: string) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await fetch(
        `${apiUrl}/api/student-requests/me?username=${encodeURIComponent(username)}`
      );
      if (!response.ok) throw new Error(`Request failed: ${response.status}`);
      const data = await response.json();
      myRequest.value = data ?? null;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Unknown error";
    } finally {
      loading.value = false;
    }
  };

  const submitStudentRequest = async (
    payload: Omit<StudentRequest, "_id" | "status" | "createdAt" | "updatedAt" | "approvedAt">
  ) => {
    error.value = null;
    try {
      const response = await fetch(`${apiUrl}/api/student-requests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error ?? `Request failed: ${response.status}`);
      }
      const saved = await response.json();
      myRequest.value = saved ?? null;
      return saved as StudentRequest;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Unknown error";
      return null;
    }
  };

  const approveRequest = async (id: string) => {
    error.value = null;
    try {
      const response = await fetch(`${apiUrl}/api/student-requests/${id}/approve`, {
        method: "PUT",
      });
      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error ?? `Request failed: ${response.status}`);
      }
      return await response.json();
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Unknown error";
      return null;
    }
  };

  return {
    apiUrl,
    faculties,
    specializations,
    modules,
    requests,
    myRequest,
    loading,
    error,
    fetchFaculties,
    fetchSpecializations,
    fetchModules,
    fetchPendingRequests,
    fetchMyRequest,
    submitStudentRequest,
    approveRequest,
  };
}

