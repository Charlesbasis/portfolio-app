"use server";

import { getCurrentUser } from "./auth";
import * as profileLib from "@/lib/profile";
import { revalidatePath } from "next/cache";

export async function getCurrentProfile() {
  const user = await getCurrentUser();
  if (!user) return null;
  
  const profile = await profileLib.getProfileByUserId(user.id);
  return profile || null;
}

export async function getPublicProfile(username: string) {
  return await profileLib.getProfileByUsername(username);
}

export async function createProfile(data: { username: string; full_name: string }) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Not authenticated");

  try {
    const profile = await profileLib.createProfile({
      user_id: user.id,
      username: data.username,
      full_name: data.full_name,
    });
    revalidatePath("/");
    return profile;
  } catch (error: any) {
    if (error.code === 'ER_DUP_ENTRY') {
      throw new Error("Username already taken");
    }
    throw error;
  }
}

export async function updateProfile(id: string, updates: any) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Not authenticated");

  const profile = await profileLib.updateProfile(id, updates);
  revalidatePath("/");
  return profile;
}

export async function checkUsername(username: string) {
  const available = await profileLib.checkUsernameAvailable(username);
  return { available };
}
