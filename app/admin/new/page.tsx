"use client"
import { createPost } from "@/app/actions/posts";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useActionState } from "react";

const initialState = {
  error: undefined as string | undefined,
};

export default function NewPostPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(createPost, initialState);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth");
    }
  }, [user, loading, router]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto p-10">
      <h1 className="text-2xl font-bold mb-4">Create New Post</h1>
      <form action={formAction} className="flex flex-col gap-4">
        <input 
          name="title" 
          placeholder="Post Title" 
          className="p-2 border rounded text-black" 
          required 
          disabled={isPending}
        />
        <textarea 
          name="content" 
          placeholder="Write something..." 
          className="p-2 border rounded h-40 text-black" 
          required 
          disabled={isPending}
        />
        {state?.error && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {state.error}
          </div>
        )}
        <button 
          type="submit" 
          className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50"
          disabled={isPending}
        >
          {isPending ? "Publishing..." : "Publish to WordPress"}
        </button>
      </form>
    </div>
  );
}
