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

// Skills
export async function getSkills(profileId: string) {
  return await profileLib.getSkillsByProfileId(profileId);
}

export async function addSkill(profileId: string, skillName: string) {
  const skill = await profileLib.addSkill(profileId, skillName);
  revalidatePath("/dashboard");
  return skill;
}

export async function deleteSkill(id: string) {
  await profileLib.deleteSkill(id);
  revalidatePath("/dashboard");
}

// Experiences
export async function getExperiences(profileId: string) {
  return await profileLib.getExperiencesByProfileId(profileId);
}

export async function addExperience(experience: any) {
  const newExperience = await profileLib.addExperience(experience);
  revalidatePath("/dashboard");
  return newExperience;
}

export async function updateExperience(id: string, updates: any) {
  const experience = await profileLib.updateExperience(id, updates);
  revalidatePath("/dashboard");
  return experience;
}

export async function deleteExperience(id: string) {
  await profileLib.deleteExperience(id);
  revalidatePath("/dashboard");
}

// Projects
export async function getProjects(profileId: string) {
  return await profileLib.getProjectsByProfileId(profileId);
}

export async function addProject(project: any) {
  const newProject = await profileLib.addProject(project);
  revalidatePath("/dashboard");
  return newProject;
}

export async function updateProject(id: string, updates: any) {
  const project = await profileLib.updateProject(id, updates);
  revalidatePath("/dashboard");
  return project;
}

export async function deleteProject(id: string) {
  await profileLib.deleteProject(id);
  revalidatePath("/dashboard");
}
