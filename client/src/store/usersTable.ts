import { ref } from "vue";
import type { MongoUser } from "@/ts/mongo";

const users = ref<MongoUser[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);

const apiUrl = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

export function useUsersTableStore() {
  const fetchUsers = async () => {
    loading.value = true;
    error.value = null;

    try {
      const response = await fetch(`${apiUrl}/api/users`);
      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }
      const data = await response.json();
      users.value = Array.isArray(data) ? data : [];
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Unknown error";
    } finally {
      loading.value = false;
    }
  };

  const createUser = async (payload: Omit<MongoUser, "_id" | "createdAt">) => {
    error.value = null;

    try {
      const response = await fetch(`${apiUrl}/api/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error ?? `Request failed: ${response.status}`);
      }

      const created = await response.json();
      users.value = [created, ...users.value];
      return created;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Unknown error";
      return null;
    }
  };

  const updateUser = async (
    id: string,
    payload: Partial<Omit<MongoUser, "_id" | "createdAt">>
  ) => {
    error.value = null;

    try {
      const response = await fetch(`${apiUrl}/api/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error ?? `Request failed: ${response.status}`);
      }

      const updated = await response.json();
      const index = users.value.findIndex((item) => item._id === id);
      if (index >= 0) {
        users.value[index] = updated;
      }
      return updated;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Unknown error";
      return null;
    }
  };

  const deleteUser = async (id: string) => {
    error.value = null;

    try {
      const response = await fetch(`${apiUrl}/api/users/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error ?? `Request failed: ${response.status}`);
      }

      users.value = users.value.filter((user) => user._id !== id);
      return true;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Unknown error";
      return false;
    }
  };

  return {
    users,
    loading,
    error,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    apiUrl,
  };
}
