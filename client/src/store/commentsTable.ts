import { ref } from "vue";
import type { MongoComment } from "@/ts/mongo";

const comments = ref<MongoComment[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);

const apiUrl = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

export function useCommentsTableStore() {
  const fetchComments = async () => {
    loading.value = true;
    error.value = null;

    try {
      const response = await fetch(`${apiUrl}/api/comments`);
      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }
      const data = await response.json();
      comments.value = Array.isArray(data) ? data : [];
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Unknown error";
    } finally {
      loading.value = false;
    }
  };

  const createComment = async (
    payload: Omit<MongoComment, "_id" | "createdAt">
  ) => {
    error.value = null;

    try {
      const response = await fetch(`${apiUrl}/api/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error ?? `Request failed: ${response.status}`);
      }

      const created = await response.json();
      comments.value = [created, ...comments.value];
      return created;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Unknown error";
      return null;
    }
  };

  const updateComment = async (
    id: string,
    payload: Partial<Omit<MongoComment, "_id" | "createdAt">>
  ) => {
    error.value = null;

    try {
      const response = await fetch(`${apiUrl}/api/comments/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error ?? `Request failed: ${response.status}`);
      }

      const updated = await response.json();
      const index = comments.value.findIndex((item) => item._id === id);
      if (index >= 0) {
        comments.value[index] = updated;
      }
      return updated;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Unknown error";
      return null;
    }
  };

  const deleteComment = async (id: string) => {
    error.value = null;

    try {
      const response = await fetch(`${apiUrl}/api/comments/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error ?? `Request failed: ${response.status}`);
      }

      comments.value = comments.value.filter((comment) => comment._id !== id);
      return true;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Unknown error";
      return false;
    }
  };

  return {
    comments,
    loading,
    error,
    fetchComments,
    createComment,
    updateComment,
    deleteComment,
    apiUrl,
  };
}
