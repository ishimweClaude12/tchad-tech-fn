import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthenticatedAxios } from "../lib/axiosAuth";

/**
 * Example component showing how to use authenticated API calls with Clerk
 */
const AuthenticatedApiExample: React.FC = () => {
  const axios = useAuthenticatedAxios(); // This axios instance has Clerk token automatically
  const queryClient = useQueryClient();

  // Example: Fetch user data with authentication
  const {
    data: userData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["userData"],
    queryFn: async () => {
      const response = await axios.get("/users/me");
      return response.data;
    },
  });

  // Example: Post data with authentication
  const createMutation = useMutation({
    mutationFn: async (newData: any) => {
      const response = await axios.post("/some-endpoint", newData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userData"] });
    },
  });

  // Example: Update data with authentication
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await axios.put(`/some-endpoint/${id}`, data);
      return response.data;
    },
  });

  // Example: Delete data with authentication
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await axios.delete(`/some-endpoint/${id}`);
      return response.data;
    },
  });

  if (isLoading) {
    return <div className="p-8">Loading...</div>;
  }

  if (error) {
    return (
      <div className="p-8 text-red-600">
        Error: {error instanceof Error ? error.message : "An error occurred"}
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <h2 className="text-2xl font-bold">Authenticated API Example</h2>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">
          User Data (Authenticated)
        </h3>
        <pre className="bg-gray-100 p-4 rounded overflow-auto">
          {JSON.stringify(userData, null, 2)}
        </pre>
      </div>

      <div className="space-y-4">
        <button
          onClick={() => createMutation.mutate({ name: "Test" })}
          disabled={createMutation.isPending}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {createMutation.isPending ? "Creating..." : "Create Data"}
        </button>

        <button
          onClick={() =>
            updateMutation.mutate({ id: "123", data: { name: "Updated" } })
          }
          disabled={updateMutation.isPending}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 ml-2"
        >
          {updateMutation.isPending ? "Updating..." : "Update Data"}
        </button>

        <button
          onClick={() => deleteMutation.mutate("123")}
          disabled={deleteMutation.isPending}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 ml-2"
        >
          {deleteMutation.isPending ? "Deleting..." : "Delete Data"}
        </button>
      </div>

      {createMutation.isError && (
        <div className="p-4 bg-red-50 text-red-600 rounded">
          Error:{" "}
          {createMutation.error instanceof Error
            ? createMutation.error.message
            : "Failed to create"}
        </div>
      )}
    </div>
  );
};

export default AuthenticatedApiExample;
