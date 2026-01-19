"use server";

import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUser } from "./auth";

export async function createPost(prevState: any, formData: FormData): Promise<{ error?: string }> {
  const user = await getCurrentUser();
  if (!user) {
    return { error: "Unauthorized: No user session found" };
  }

  const title = formData.get("title");
  const content = formData.get("content");

  if (!title || !content) {
    return { error: "Title and content are required" };
  }

  const auth = Buffer.from(
    `${process.env.WP_USER}:${process.env.WP_APPLICATION_PASSWORD}`
  ).toString("base64");

  try {
    const apiUrl = `${process.env.WORDPRESS_URL}/wp-json/wp/v2/posts`;

    // Ensure we have a valid WordPress User ID
    if (!user.wpId) {
      return { error: "Your account is not linked to a WordPress author. Please contact an administrator." };
    }

    const authorId = user.wpId;

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${auth}`,
      },
      body: JSON.stringify({
        title: title,
        content: content,
        status: "publish",
        author: authorId,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("WORDPRESS API ERROR DETAILS:", JSON.stringify(errorData, null, 2));
      console.error("Attempted Author ID:", authorId);
      return { error: errorData.message || "Failed to create post in WordPress" };
    }

    console.log("SUCCESS: Post Created");
  } catch (err: any) {
    console.error("CRITICAL CONNECTION ERROR:", err.message);
    return { error: "Failed to connect to WordPress" };
  }

  revalidateTag("posts", "default");
  redirect("/");
}
