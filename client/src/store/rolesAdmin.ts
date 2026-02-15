import { ref } from "vue";
import type { AuthUser, Role } from "@/ts/mongo";

const roles = ref<Role[]>([]);
const authUsers = ref<AuthUser[]>([]);
const loadingRoles = ref(false);
const loadingUsers = ref(false);
const error = ref<string | null>(null);

const apiUrl = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

const sortRoles = (items: Role[]) => {
  return [...items].sort((a, b) =>
    String(a.name ?? "").localeCompare(String(b.name ?? ""))
  );
};

export function useRolesAdminStore() {
  const fetchRoles = async () => {
    loadingRoles.value = true;
    error.value = null;

    try {
      const response = await fetch(`${apiUrl}/api/roles`);
      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }
      const data = await response.json();
      roles.value = sortRoles(Array.isArray(data) ? data : []);
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Unknown error";
    } finally {
      loadingRoles.value = false;
    }
  };





  const fetchAuthUsers = async () => {
    loadingUsers.value = true;
    error.value = null;

    try {
      const response = await fetch(`${apiUrl}/api/auth-users`);
      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }
      const data = await response.json();
      authUsers.value = Array.isArray(data) ? data : [];
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Unknown error";
    } finally {
      loadingUsers.value = false;
    }
  };

  const assignRoles = async (id: string, rolesList: string[]) => {
    error.value = null;

    try {
      const response = await fetch(`${apiUrl}/api/auth-users/${id}/roles`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roles: rolesList }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error ?? `Request failed: ${response.status}`);
      }

      const updated = await response.json();
      const index = authUsers.value.findIndex((user) => user._id === id);
      if (index >= 0) {
        authUsers.value[index] = updated;
      }
      return updated;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Unknown error";
      return null;
    }
  };

  return {
    roles,
    authUsers,
    loadingRoles,
    loadingUsers,
    error,
    apiUrl,
    fetchRoles,
    fetchAuthUsers,
    assignRoles,
  };
}
